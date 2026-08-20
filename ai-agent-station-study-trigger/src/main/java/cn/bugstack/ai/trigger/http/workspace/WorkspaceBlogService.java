package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class WorkspaceBlogService {

    private static final Pattern SAFE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final Pattern BLOG_ID = Pattern.compile("[a-f0-9-]{36}");
    private static final int MAX_EVIDENCE_CHARS = 12_000;
    private static final DateTimeFormatter FILE_DATE = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
            .withZone(ZoneOffset.UTC);

    private final WorkspaceKnowledgeService knowledgeService;
    private final WorkspaceBlogWriter blogWriter;
    private final Map<String, WorkspaceBlogPublisher> publishers;
    private final ObjectMapper objectMapper;
    private final Path storageRoot;

    public WorkspaceBlogService(WorkspaceKnowledgeService knowledgeService,
                                WorkspaceBlogWriter blogWriter,
                                List<WorkspaceBlogPublisher> publishers,
                                ObjectMapper objectMapper,
                                @Value("${workspace.blog.storage-dir:./data/blog}") String storageDirectory) {
        this.knowledgeService = knowledgeService;
        this.blogWriter = blogWriter;
        this.publishers = new LinkedHashMap<>();
        publishers.forEach(publisher -> this.publishers.put(publisher.target().toUpperCase(Locale.ROOT), publisher));
        this.objectMapper = objectMapper;
        this.storageRoot = Path.of(storageDirectory).toAbsolutePath().normalize();
    }

    public BlogPost generate(String workspaceId, GenerateRequest request) {
        validateWorkspaceId(workspaceId);
        if (request == null) {
            throw new IllegalArgumentException("Generation request is required");
        }
        String topic = required(request.topic(), "Topic", 200);
        String audience = optional(request.audience(), "Software developers", 120);
        String tone = optional(request.tone(), "Practical and technical", 120);
        int targetLength = request.targetLength() == null ? 1200 : request.targetLength();
        if (targetLength < 400 || targetLength > 4000) {
            throw new IllegalArgumentException("targetLength must be between 400 and 4000");
        }

        List<SourceReference> suppliedSources = request.sources() == null ? List.of() : request.sources().stream()
                .filter(source -> source != null && StringUtils.hasText(source.sourcePath()))
                .limit(20)
                .toList();
        List<SourceReference> sources;
        if (suppliedSources.isEmpty()) {
            String sourceQuery = optional(request.sourceQuery(), topic, 500);
            List<WorkspaceKnowledgeService.SearchResult> searchResults = knowledgeService.hybridSearch(
                    workspaceId, sourceQuery, 8);
            sources = searchResults.stream()
                    .map(result -> new SourceReference(result.sourcePath(), result.startLine(), result.endLine(),
                            truncate(result.content(), 1600)))
                    .toList();
        } else {
            sources = suppliedSources;
        }
        String evidence = evidenceText(sources);
        String content = blogWriter.write(new WorkspaceBlogWriter.WriteRequest(
                topic, audience, tone, targetLength, evidence));

        return saveNew(workspaceId, topic, summaryOf(content), content, normalizeTags(request.tags()), sources);
    }

    public BlogPost create(String workspaceId, CreateRequest request) {
        validateWorkspaceId(workspaceId);
        if (request == null) {
            throw new IllegalArgumentException("Draft request is required");
        }
        return saveNew(workspaceId,
                required(request.title(), "Title", 200),
                optional(request.summary(), summaryOf(request.content()), 500),
                required(request.content(), "Content", 100_000),
                normalizeTags(request.tags()),
                List.of());
    }

    public synchronized BlogPost update(String workspaceId, String blogId, UpdateRequest request) {
        BlogPost current = get(workspaceId, blogId);
        if (current.status() == BlogStatus.PUBLISHED) {
            throw new IllegalStateException("Published posts are immutable; create a new draft to revise one");
        }
        if (request == null) {
            throw new IllegalArgumentException("Update request is required");
        }
        String content = required(request.content(), "Content", 100_000);
        BlogPost updated = new BlogPost(current.id(), current.workspaceId(),
                required(request.title(), "Title", 200),
                optional(request.summary(), summaryOf(content), 500),
                current.slug(), content, normalizeTags(request.tags()), current.sources(), current.status(),
                current.createdAt(), Instant.now(), current.publishedAt(), current.publishArtifact(), current.publication());
        writePost(updated);
        return updated;
    }

    public synchronized BlogPost publish(String workspaceId, String blogId) {
        return publish(workspaceId, blogId, new PublishRequest("LOCAL", null, "ARCHIVE"));
    }

    public synchronized BlogPost publish(String workspaceId, String blogId, PublishRequest request) {
        BlogPost current = get(workspaceId, blogId);
        if (current.status() == BlogStatus.PUBLISHED) {
            return current;
        }
        String target = request == null ? "LOCAL" : optional(request.target(), "LOCAL", 32).toUpperCase(Locale.ROOT);
        WorkspaceBlogPublisher.Publication publication;
        if ("LOCAL".equals(target)) {
            publication = new WorkspaceBlogPublisher.Publication("LOCAL", "ARCHIVE", null, null, Instant.now());
        } else {
            WorkspaceBlogPublisher publisher = publishers.get(target);
            if (publisher == null) {
                throw new IllegalArgumentException("Unsupported blog publishing target: " + target);
            }
            if (!publisher.isConfigured()) {
                throw new IllegalStateException(target + " publishing is not configured");
            }
            publication = publisher.publish(new WorkspaceBlogPublisher.PublishRequest(
                    current.title(), current.summary(), current.content(), current.tags(),
                    request == null ? null : request.category(), request == null ? "DRAFT" : request.mode()));
        }
        Path publishedDirectory = workspaceDirectory(workspaceId).resolve("published");
        String fileName = current.slug() + ".md";
        Path output = safeResolve(publishedDirectory, fileName);
        writeText(output, markdownArtifact(current));

        BlogPost published = new BlogPost(current.id(), current.workspaceId(), current.title(), current.summary(),
                current.slug(), current.content(), current.tags(), current.sources(), BlogStatus.PUBLISHED,
                current.createdAt(), Instant.now(), publication.publishedAt(), "published/" + fileName, publication);
        writePost(published);
        return published;
    }

    public List<PublishTarget> publishTargets() {
        List<PublishTarget> targets = new java.util.ArrayList<>();
        targets.add(new PublishTarget("LOCAL", "Local Markdown", true, "ARCHIVE"));
        publishers.values().forEach(publisher -> targets.add(
                new PublishTarget(publisher.target(), publisher.target(), publisher.isConfigured(), "DRAFT")));
        return List.copyOf(targets);
    }

    public synchronized void deleteDraft(String workspaceId, String blogId) {
        BlogPost current = get(workspaceId, blogId);
        if (current.status() == BlogStatus.PUBLISHED) {
            throw new IllegalStateException("Published posts cannot be deleted through the draft endpoint");
        }
        try {
            Files.delete(postPath(workspaceId, blogId));
        } catch (IOException e) {
            throw new IllegalStateException("Unable to delete blog draft", e);
        }
    }

    public BlogPost get(String workspaceId, String blogId) {
        validateWorkspaceId(workspaceId);
        validateBlogId(blogId);
        Path path = postPath(workspaceId, blogId);
        if (!Files.isRegularFile(path)) {
            throw new NoSuchElementException("Blog post not found: " + blogId);
        }
        try {
            return objectMapper.readValue(path.toFile(), BlogPost.class);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read blog post " + blogId, e);
        }
    }

    public List<BlogPost> list(String workspaceId, BlogStatus status) {
        validateWorkspaceId(workspaceId);
        Path draftsDirectory = workspaceDirectory(workspaceId).resolve("drafts");
        if (!Files.isDirectory(draftsDirectory)) {
            return List.of();
        }
        try (var files = Files.list(draftsDirectory)) {
            return files.filter(path -> path.getFileName().toString().endsWith(".json"))
                    .map(this::readPost)
                    .filter(post -> status == null || post.status() == status)
                    .sorted(Comparator.comparing(BlogPost::updatedAt).reversed())
                    .toList();
        } catch (IOException e) {
            throw new IllegalStateException("Unable to list blog posts", e);
        }
    }

    private synchronized BlogPost saveNew(String workspaceId, String title, String summary, String content,
                                          List<String> tags, List<SourceReference> sources) {
        Instant now = Instant.now();
        String id = UUID.randomUUID().toString();
        BlogPost post = new BlogPost(id, workspaceId, title, summary, slugify(title, id, now), content, tags,
                sources, BlogStatus.DRAFT, now, now, null, null, null);
        writePost(post);
        return post;
    }

    private void writePost(BlogPost post) {
        Path path = postPath(post.workspaceId(), post.id());
        try {
            Files.createDirectories(path.getParent());
            Path temporary = Files.createTempFile(path.getParent(), post.id(), ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(temporary.toFile(), post);
            moveIntoPlace(temporary, path);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to save blog post " + post.id(), e);
        }
    }

    private BlogPost readPost(Path path) {
        try {
            return objectMapper.readValue(path.toFile(), BlogPost.class);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read " + path.getFileName(), e);
        }
    }

    private void writeText(Path output, String content) {
        try {
            Files.createDirectories(output.getParent());
            Path temporary = Files.createTempFile(output.getParent(), output.getFileName().toString(), ".tmp");
            Files.writeString(temporary, content, StandardCharsets.UTF_8);
            moveIntoPlace(temporary, output);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to publish Markdown artifact", e);
        }
    }

    private void moveIntoPlace(Path source, Path target) throws IOException {
        try {
            Files.move(source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        } catch (AtomicMoveNotSupportedException ignored) {
            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private Path postPath(String workspaceId, String blogId) {
        validateBlogId(blogId);
        return safeResolve(workspaceDirectory(workspaceId).resolve("drafts"), blogId + ".json");
    }

    private Path workspaceDirectory(String workspaceId) {
        validateWorkspaceId(workspaceId);
        return safeResolve(storageRoot, workspaceId);
    }

    private Path safeResolve(Path parent, String child) {
        Path resolved = parent.resolve(child).normalize();
        if (!resolved.startsWith(parent.normalize())) {
            throw new IllegalArgumentException("Unsafe storage path");
        }
        return resolved;
    }

    private String evidenceText(List<SourceReference> sources) {
        if (sources.isEmpty()) {
            return "No project evidence was found. Do not claim project-specific implementation details.";
        }
        StringBuilder evidence = new StringBuilder();
        for (int index = 0; index < sources.size(); index++) {
            SourceReference source = sources.get(index);
            String location = StringUtils.hasText(source.sourceUrl())
                    ? "Title: %s\nOriginal URL: %s\nPublished at: %s".formatted(
                    source.title(), source.sourceUrl(), source.publishedAt())
                    : "%s lines %d-%d".formatted(source.sourcePath(), source.startLine(), source.endLine());
            String block = "[%d] %s\n%s\n\n".formatted(index + 1, location, source.excerpt());
            if (evidence.length() + block.length() > MAX_EVIDENCE_CHARS) {
                break;
            }
            evidence.append(block);
        }
        return evidence.toString();
    }

    private String markdownArtifact(BlogPost post) {
        String tagList = post.tags().stream().map(tag -> "\"" + yamlEscape(tag) + "\"")
                .reduce((left, right) -> left + ", " + right).orElse("");
        return """
                ---
                title: "%s"
                summary: "%s"
                slug: "%s"
                tags: [%s]
                generated_at: "%s"
                ---

                %s
                """.formatted(yamlEscape(post.title()), yamlEscape(post.summary()), post.slug(), tagList,
                Instant.now(), post.content());
    }

    private String yamlEscape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\r", " ").replace("\n", " ");
    }

    private String slugify(String title, String id, Instant createdAt) {
        String slug = title.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (slug.isBlank()) {
            slug = "post-" + FILE_DATE.format(createdAt);
        }
        if (slug.length() > 72) {
            slug = slug.substring(0, 72).replaceAll("-$", "");
        }
        return slug + "-" + id.substring(0, 8);
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null) {
            return List.of();
        }
        return tags.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .filter(tag -> tag.length() <= 40)
                .distinct()
                .limit(10)
                .toList();
    }

    private String summaryOf(String markdown) {
        if (!StringUtils.hasText(markdown)) {
            return "";
        }
        String plain = markdown.replaceAll("(?m)^#{1,6}\\s+.*$", "")
                .replaceAll("[`*_>#\\[\\]()]", " ")
                .replaceAll("\\s+", " ")
                .trim();
        return truncate(plain, 240);
    }

    private String truncate(String value, int maximumLength) {
        if (value == null || value.length() <= maximumLength) {
            return value;
        }
        return value.substring(0, maximumLength - 3) + "...";
    }

    private String required(String value, String label, int maximumLength) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(label + " is required");
        }
        String trimmed = value.trim();
        if (trimmed.length() > maximumLength) {
            throw new IllegalArgumentException(label + " exceeds the " + maximumLength + " character limit");
        }
        return trimmed;
    }

    private String optional(String value, String defaultValue, int maximumLength) {
        return StringUtils.hasText(value) ? required(value, "Value", maximumLength) : defaultValue;
    }

    private void validateWorkspaceId(String workspaceId) {
        if (workspaceId == null || !SAFE_ID.matcher(workspaceId).matches()) {
            throw new IllegalArgumentException("workspaceId may only contain letters, numbers, underscores, and hyphens");
        }
    }

    private void validateBlogId(String blogId) {
        if (blogId == null || !BLOG_ID.matcher(blogId).matches()) {
            throw new IllegalArgumentException("Invalid blogId");
        }
    }

    public enum BlogStatus {
        DRAFT,
        PUBLISHED
    }

    public record GenerateRequest(String topic, String audience, String tone, Integer targetLength,
                                  String sourceQuery, List<String> tags, List<SourceReference> sources) {

        public GenerateRequest(String topic, String audience, String tone, Integer targetLength,
                               String sourceQuery, List<String> tags) {
            this(topic, audience, tone, targetLength, sourceQuery, tags, List.of());
        }
    }

    public record CreateRequest(String title, String summary, String content, List<String> tags) {
    }

    public record UpdateRequest(String title, String summary, String content, List<String> tags) {
    }

    public record PublishRequest(String target, String category, String mode) {
        public PublishRequest(String target, String category) {
            this(target, category, "DRAFT");
        }
    }

    public record PublishTarget(String id, String label, boolean configured, String mode) {
    }

    public record SourceReference(String sourcePath, int startLine, int endLine, String excerpt,
                                  String title, String sourceUrl, Instant publishedAt) {

        public SourceReference(String sourcePath, int startLine, int endLine, String excerpt) {
            this(sourcePath, startLine, endLine, excerpt, null, null, null);
        }

        public static SourceReference external(String title, String sourceUrl, Instant publishedAt, String excerpt) {
            return new SourceReference(sourceUrl, 0, 0, excerpt, title, sourceUrl, publishedAt);
        }
    }

    public record BlogPost(String id, String workspaceId, String title, String summary, String slug,
                           String content, List<String> tags, List<SourceReference> sources, BlogStatus status,
                           Instant createdAt, Instant updatedAt, Instant publishedAt, String publishArtifact,
                           WorkspaceBlogPublisher.Publication publication) {
    }
}

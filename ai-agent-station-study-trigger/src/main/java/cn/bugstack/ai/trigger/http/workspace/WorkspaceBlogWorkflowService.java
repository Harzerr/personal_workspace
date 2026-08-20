package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class WorkspaceBlogWorkflowService {

    private static final Pattern SAFE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final Pattern RUN_ID = Pattern.compile("[a-f0-9-]{36}");

    private final WorkspaceBlogService blogService;
    private final WorkspaceBlogWriter blogWriter;
    private final WorkspaceBlogInspector inspector;
    private final ObjectMapper objectMapper;
    private final Path storageRoot;

    public WorkspaceBlogWorkflowService(WorkspaceBlogService blogService,
                                        WorkspaceBlogWriter blogWriter,
                                        WorkspaceBlogInspector inspector,
                                        ObjectMapper objectMapper,
                                        @Value("${workspace.blog.storage-dir:./data/blog}") String storageDirectory) {
        this.blogService = blogService;
        this.blogWriter = blogWriter;
        this.inspector = inspector;
        this.objectMapper = objectMapper;
        this.storageRoot = Path.of(storageDirectory).toAbsolutePath().normalize();
    }

    public WorkflowResult run(String workspaceId, RunRequest request) {
        validateWorkspaceId(workspaceId);
        if (request == null) {
            throw new IllegalArgumentException("Workflow request is required");
        }
        int maxRevisions = request.maxRevisions() == null ? 2 : request.maxRevisions();
        if (maxRevisions < 0 || maxRevisions > 3) {
            throw new IllegalArgumentException("maxRevisions must be between 0 and 3");
        }
        String target = optional(request.target(), "CSDN", 32).toUpperCase(Locale.ROOT);
        String mode = optional(request.mode(), "DRAFT", 16).toUpperCase(Locale.ROOT);
        MutableRun run = new MutableRun(UUID.randomUUID().toString(), workspaceId, target, mode);
        persist(run.snapshot());

        WorkspaceBlogService.BlogPost post = null;
        try {
            run.stage = WorkflowStage.GENERATING;
            persist(run.snapshot());
            post = blogService.generate(workspaceId, request.generateRequest());
            run.blogId = post.id();

            int revision = 0;
            while (true) {
                run.stage = WorkflowStage.INSPECTING;
                persist(run.snapshot());
                WorkspaceBlogInspector.Inspection inspection = inspector.inspect(
                        new WorkspaceBlogInspector.InspectionRequest(post.title(), post.content(), post.sources(),
                                request.audienceOrDefault(), request.toneOrDefault()));
                run.reviews.add(new ReviewAttempt(revision + 1, inspection.approved(), inspection.score(),
                        inspection.issues(), inspection.revisionInstructions(), Instant.now()));
                persist(run.snapshot());

                if (inspection.approved()) {
                    break;
                }
                if (revision >= maxRevisions) {
                    run.status = WorkflowStatus.REJECTED;
                    run.stage = WorkflowStage.REJECTED;
                    run.updatedAt = Instant.now();
                    persist(run.snapshot());
                    return new WorkflowResult(run.snapshot(), post);
                }

                run.stage = WorkflowStage.REVISING;
                persist(run.snapshot());
                String revisedContent = blogWriter.revise(new WorkspaceBlogWriter.RevisionRequest(
                        request.topic(), request.audienceOrDefault(), request.toneOrDefault(),
                        request.targetLengthOrDefault(), evidenceText(post.sources()), post.content(),
                        feedback(inspection)));
                post = blogService.update(workspaceId, post.id(), new WorkspaceBlogService.UpdateRequest(
                        post.title(), null, revisedContent, post.tags()));
                revision++;
            }

            run.stage = WorkflowStage.PUBLISHING;
            persist(run.snapshot());
            post = blogService.publish(workspaceId, post.id(),
                    new WorkspaceBlogService.PublishRequest(target, request.category(), mode));
            run.status = WorkflowStatus.COMPLETED;
            run.stage = WorkflowStage.COMPLETED;
            run.updatedAt = Instant.now();
            persist(run.snapshot());
            return new WorkflowResult(run.snapshot(), post);
        } catch (RuntimeException e) {
            run.status = WorkflowStatus.FAILED;
            run.stage = WorkflowStage.FAILED;
            run.error = truncate(e.getMessage(), 500);
            run.updatedAt = Instant.now();
            persist(run.snapshot());
            throw e;
        }
    }

    public WorkflowRun get(String workspaceId, String runId) {
        validateWorkspaceId(workspaceId);
        validateRunId(runId);
        Path path = runPath(workspaceId, runId);
        if (!Files.isRegularFile(path)) {
            throw new NoSuchElementException("Blog workflow run not found: " + runId);
        }
        return read(path);
    }

    public List<WorkflowRun> list(String workspaceId) {
        validateWorkspaceId(workspaceId);
        Path directory = workflowDirectory(workspaceId);
        if (!Files.isDirectory(directory)) {
            return List.of();
        }
        try (var files = Files.list(directory)) {
            return files.filter(path -> path.getFileName().toString().endsWith(".json"))
                    .map(this::read)
                    .sorted(Comparator.comparing(WorkflowRun::createdAt).reversed())
                    .toList();
        } catch (IOException e) {
            throw new IllegalStateException("Unable to list blog workflow runs", e);
        }
    }

    private String feedback(WorkspaceBlogInspector.Inspection inspection) {
        String issues = inspection.issues().isEmpty() ? "" : String.join("; ", inspection.issues());
        if (!StringUtils.hasText(inspection.revisionInstructions())) {
            return issues;
        }
        return issues + (issues.isBlank() ? "" : "\n") + inspection.revisionInstructions();
    }

    private String evidenceText(List<WorkspaceBlogService.SourceReference> sources) {
        if (sources == null || sources.isEmpty()) {
            return "No workspace evidence was found. Treat project-specific claims as unverified.";
        }
        StringBuilder evidence = new StringBuilder();
        for (int i = 0; i < sources.size(); i++) {
            WorkspaceBlogService.SourceReference source = sources.get(i);
            evidence.append('[').append(i + 1).append("] ");
            if (StringUtils.hasText(source.sourceUrl())) {
                evidence.append(source.title()).append('\n')
                        .append("Original URL: ").append(source.sourceUrl()).append('\n')
                        .append("Published at: ").append(source.publishedAt()).append('\n');
            } else {
                evidence.append(source.sourcePath()).append(':').append(source.startLine())
                        .append('-').append(source.endLine()).append('\n');
            }
            evidence.append(source.excerpt()).append("\n\n");
        }
        return evidence.toString();
    }

    private void persist(WorkflowRun run) {
        Path path = runPath(run.workspaceId(), run.runId());
        try {
            Files.createDirectories(path.getParent());
            Path temporary = Files.createTempFile(path.getParent(), run.runId(), ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(temporary.toFile(), run);
            try {
                Files.move(temporary, path, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException e) {
                Files.move(temporary, path, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Unable to save blog workflow run " + run.runId(), e);
        }
    }

    private WorkflowRun read(Path path) {
        try {
            return objectMapper.readValue(path.toFile(), WorkflowRun.class);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read blog workflow run", e);
        }
    }

    private Path workflowDirectory(String workspaceId) {
        return storageRoot.resolve(workspaceId).resolve("workflows").normalize();
    }

    private Path runPath(String workspaceId, String runId) {
        Path directory = workflowDirectory(workspaceId);
        Path path = directory.resolve(runId + ".json").normalize();
        if (!path.startsWith(directory)) {
            throw new IllegalArgumentException("Invalid blog workflow path");
        }
        return path;
    }

    private void validateWorkspaceId(String workspaceId) {
        if (workspaceId == null || !SAFE_ID.matcher(workspaceId).matches()) {
            throw new IllegalArgumentException("workspaceId may only contain letters, numbers, underscores, and hyphens");
        }
    }

    private void validateRunId(String runId) {
        if (runId == null || !RUN_ID.matcher(runId).matches()) {
            throw new IllegalArgumentException("Invalid workflow run ID");
        }
    }

    private String optional(String value, String defaultValue, int maximumLength) {
        if (!StringUtils.hasText(value)) {
            return defaultValue;
        }
        String trimmed = value.trim();
        if (trimmed.length() > maximumLength) {
            throw new IllegalArgumentException("Value exceeds the " + maximumLength + " character limit");
        }
        return trimmed;
    }

    private String truncate(String value, int maximumLength) {
        if (value == null || value.length() <= maximumLength) {
            return value;
        }
        return value.substring(0, maximumLength - 3) + "...";
    }

    public enum WorkflowStatus { RUNNING, COMPLETED, REJECTED, FAILED }

    public enum WorkflowStage { GENERATING, INSPECTING, REVISING, PUBLISHING, COMPLETED, REJECTED, FAILED }

    public record RunRequest(String topic, String audience, String tone, Integer targetLength, String sourceQuery,
                             List<String> tags, String target, String category, String mode, Integer maxRevisions,
                             List<WorkspaceBlogService.SourceReference> sources) {

        public RunRequest(String topic, String audience, String tone, Integer targetLength, String sourceQuery,
                          List<String> tags, String target, String category, String mode, Integer maxRevisions) {
            this(topic, audience, tone, targetLength, sourceQuery, tags, target, category, mode, maxRevisions,
                    List.of());
        }

        WorkspaceBlogService.GenerateRequest generateRequest() {
            return new WorkspaceBlogService.GenerateRequest(topic, audience, tone, targetLength, sourceQuery, tags,
                    sources == null ? List.of() : sources);
        }

        String audienceOrDefault() {
            return StringUtils.hasText(audience) ? audience.trim() : "Software developers";
        }

        String toneOrDefault() {
            return StringUtils.hasText(tone) ? tone.trim() : "Practical and technical";
        }

        int targetLengthOrDefault() {
            return targetLength == null ? 1200 : targetLength;
        }
    }

    public record ReviewAttempt(int attempt, boolean approved, int score, List<String> issues,
                                String revisionInstructions, Instant inspectedAt) {
    }

    public record WorkflowRun(String runId, String workspaceId, String blogId, WorkflowStatus status,
                              WorkflowStage stage, String target, String mode, List<ReviewAttempt> reviews,
                              String error, Instant createdAt, Instant updatedAt) {
    }

    public record WorkflowResult(WorkflowRun workflow, WorkspaceBlogService.BlogPost post) {
    }

    private static final class MutableRun {
        private final String runId;
        private final String workspaceId;
        private final String target;
        private final String mode;
        private final Instant createdAt = Instant.now();
        private final List<ReviewAttempt> reviews = new ArrayList<>();
        private String blogId;
        private WorkflowStatus status = WorkflowStatus.RUNNING;
        private WorkflowStage stage = WorkflowStage.GENERATING;
        private String error;
        private Instant updatedAt = createdAt;

        private MutableRun(String runId, String workspaceId, String target, String mode) {
            this.runId = runId;
            this.workspaceId = workspaceId;
            this.target = target;
            this.mode = mode;
        }

        private WorkflowRun snapshot() {
            updatedAt = Instant.now();
            return new WorkflowRun(runId, workspaceId, blogId, status, stage, target, mode,
                    List.copyOf(reviews), error, createdAt, updatedAt);
        }
    }
}

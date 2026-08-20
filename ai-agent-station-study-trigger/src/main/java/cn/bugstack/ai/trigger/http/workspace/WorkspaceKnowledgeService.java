package cn.bugstack.ai.trigger.http.workspace;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class WorkspaceKnowledgeService {

    private static final Logger log = LoggerFactory.getLogger(WorkspaceKnowledgeService.class);
    private static final Pattern WORKSPACE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final long MAX_FILE_SIZE = 3L * 1024L * 1024L;
    private static final int MAX_FILES_PER_IMPORT = 30;
    private static final Set<String> TEXT_EXTENSIONS = Set.of(
            "java", "md", "markdown", "txt", "py", "js", "jsx", "ts", "tsx", "vue",
            "go", "rs", "c", "h", "cpp", "hpp", "cs", "kt", "kts", "scala", "sql",
            "html", "htm", "css", "scss", "less", "xml", "json", "yaml", "yml", "toml",
            "properties", "gradle", "sh", "ps1", "bat", "dockerfile");

    private final JdbcTemplate jdbcTemplate;
    private final VectorStore vectorStore;
    private final WorkspaceChunker chunker;
    private final WorkspaceLexicalRetriever lexicalRetriever;
    private final String embeddingBaseUrl;
    private final String embeddingModel;
    private final int embeddingDimensions;

    public WorkspaceKnowledgeService(@Qualifier("workspaceJdbcTemplate") JdbcTemplate jdbcTemplate,
                                     @Qualifier("vectorStore") VectorStore vectorStore,
                                     WorkspaceChunker chunker,
                                     WorkspaceLexicalRetriever lexicalRetriever,
                                     @Value("${workspace.knowledge.embedding.base-url}") String embeddingBaseUrl,
                                     @Value("${workspace.knowledge.embedding.model}") String embeddingModel,
                                     @Value("${workspace.knowledge.embedding.dimensions}") int embeddingDimensions) {
        this.jdbcTemplate = jdbcTemplate;
        this.vectorStore = vectorStore;
        this.chunker = chunker;
        this.lexicalRetriever = lexicalRetriever;
        this.embeddingBaseUrl = embeddingBaseUrl;
        this.embeddingModel = embeddingModel;
        this.embeddingDimensions = embeddingDimensions;
    }

    @PostConstruct
    public void initializeSchema() {
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS workspace_chunk (
                    id VARCHAR(64) PRIMARY KEY,
                    workspace_id VARCHAR(64) NOT NULL,
                    source_path VARCHAR(512) NOT NULL,
                    language VARCHAR(32) NOT NULL,
                    chunk_type VARCHAR(256) NOT NULL,
                    start_line INT NOT NULL,
                    end_line INT NOT NULL,
                    content TEXT NOT NULL,
                    content_hash CHAR(64) NOT NULL,
                    created_at TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP NOT NULL,
                    CONSTRAINT uk_workspace_source_hash UNIQUE (workspace_id, source_path, content_hash)
                )
                """);
        jdbcTemplate.execute("""
                CREATE INDEX IF NOT EXISTS idx_workspace_chunk
                ON workspace_chunk (workspace_id, created_at)
                """);
    }

    @Transactional
    public ImportResult importDocuments(String workspaceId, List<MultipartFile> files) {
        validateWorkspaceId(workspaceId);
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one source file is required");
        }
        if (files.size() > MAX_FILES_PER_IMPORT) {
            throw new IllegalArgumentException("A single import supports at most " + MAX_FILES_PER_IMPORT + " files");
        }

        int importedFiles = 0;
        int importedChunks = 0;
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("File exceeds the 3 MB import limit: " + safeFileName(file));
            }

            String sourcePath = safeFileName(file);
            String language = languageOf(sourcePath);
            String content = readUtf8(file, sourcePath);
            List<WorkspaceChunker.ChunkDraft> drafts = chunker.chunk(sourcePath, content);
            if (drafts.isEmpty()) {
                continue;
            }

            jdbcTemplate.update("DELETE FROM vector_store_openai WHERE metadata ->> 'workspace_id' = ? AND metadata ->> 'source_path' = ?",
                    workspaceId, sourcePath);
            jdbcTemplate.update("DELETE FROM workspace_chunk WHERE workspace_id = ? AND source_path = ?", workspaceId, sourcePath);
            LocalDateTime now = LocalDateTime.now();
            List<Object[]> rows = new ArrayList<>();
            List<Document> vectorDocuments = new ArrayList<>();
            for (WorkspaceChunker.ChunkDraft draft : drafts) {
                String hash = sha256(sourcePath + "\n" + draft.startLine() + "\n" + draft.content());
                String id = UUID.nameUUIDFromBytes((workspaceId + ":" + sourcePath + ":" + draft.chunkType() + ":" + draft.startLine())
                        .getBytes(StandardCharsets.UTF_8)).toString();
                rows.add(new Object[]{
                        id, workspaceId, sourcePath, language, draft.chunkType(), draft.startLine(), draft.endLine(),
                        draft.content(), hash, Timestamp.valueOf(now), Timestamp.valueOf(now)
                });
                vectorDocuments.add(Document.builder()
                        .id(id)
                        .text(draft.content())
                        .metadata(Map.of(
                                "workspace_id", workspaceId,
                                "chunk_id", id,
                                "source_path", sourcePath,
                                "language", language,
                                "chunk_type", draft.chunkType()))
                        .build());
            }
            jdbcTemplate.batchUpdate("""
                    INSERT INTO workspace_chunk
                    (id, workspace_id, source_path, language, chunk_type, start_line, end_line, content, content_hash, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, rows);
            indexVectors(vectorDocuments, workspaceId, sourcePath);
            importedFiles++;
            importedChunks += rows.size();
        }
        return new ImportResult(workspaceId, importedFiles, importedChunks);
    }

    public List<SearchResult> hybridSearch(String workspaceId, String query, int limit) {
        validateWorkspaceId(workspaceId);
        if (!StringUtils.hasText(query)) {
            throw new IllegalArgumentException("Query is required");
        }
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        List<WorkspaceChunk> chunks = jdbcTemplate.query("""
                        SELECT id, workspace_id, source_path, language, chunk_type, start_line, end_line, content, content_hash, created_at
                        FROM workspace_chunk WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 3000
                        """,
                (rs, rowNum) -> new WorkspaceChunk(
                        rs.getString("id"), rs.getString("workspace_id"), rs.getString("source_path"),
                        rs.getString("language"), rs.getString("chunk_type"), rs.getInt("start_line"),
                        rs.getInt("end_line"), rs.getString("content"), rs.getString("content_hash"),
                        rs.getTimestamp("created_at").toLocalDateTime()),
                workspaceId);

        List<WorkspaceLexicalRetriever.ScoredChunk> lexical = lexicalRetriever.search(expandQuery(query), chunks, safeLimit * 2);
        Map<String, WorkspaceChunk> chunksById = chunks.stream()
                .collect(java.util.stream.Collectors.toMap(WorkspaceChunk::id, chunk -> chunk));
        Map<String, Integer> lexicalRanks = ranks(lexical.stream().map(result -> result.chunk().id()).toList());
        Map<String, Integer> semanticRanks = semanticRanks(workspaceId, query, safeLimit * 2, chunksById);

        Map<String, Double> fusedScores = new LinkedHashMap<>();
        lexicalRanks.forEach((id, rank) -> fusedScores.merge(id, reciprocalRank(rank), Double::sum));
        semanticRanks.forEach((id, rank) -> fusedScores.merge(id, reciprocalRank(rank), Double::sum));

        return fusedScores.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue(Comparator.reverseOrder()))
                .limit(safeLimit)
                .map(entry -> SearchResult.from(chunksById.get(entry.getKey()), entry.getValue(), "rrf",
                        lexicalRanks.get(entry.getKey()), semanticRanks.get(entry.getKey())))
                .toList();
    }

    public int documentCount(String workspaceId) {
        validateWorkspaceId(workspaceId);
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM workspace_chunk WHERE workspace_id = ?", Integer.class, workspaceId);
        return count == null ? 0 : count;
    }

    public ReindexResult reindexWorkspace(String workspaceId) {
        validateWorkspaceId(workspaceId);
        List<WorkspaceChunk> chunks = jdbcTemplate.query("""
                        SELECT id, workspace_id, source_path, language, chunk_type, start_line, end_line, content, content_hash, created_at
                        FROM workspace_chunk WHERE workspace_id = ? ORDER BY source_path, start_line
                        """,
                (rs, rowNum) -> new WorkspaceChunk(
                        rs.getString("id"), rs.getString("workspace_id"), rs.getString("source_path"),
                        rs.getString("language"), rs.getString("chunk_type"), rs.getInt("start_line"),
                        rs.getInt("end_line"), rs.getString("content"), rs.getString("content_hash"),
                        rs.getTimestamp("created_at").toLocalDateTime()),
                workspaceId);

        jdbcTemplate.update("DELETE FROM vector_store_openai WHERE metadata ->> 'workspace_id' = ?", workspaceId);
        int indexedChunks = 0;
        for (int offset = 0; offset < chunks.size(); offset += 20) {
            List<Document> documents = chunks.subList(offset, Math.min(offset + 20, chunks.size())).stream()
                    .map(chunk -> Document.builder()
                            .id(chunk.id())
                            .text(chunk.content())
                            .metadata(Map.of(
                                    "workspace_id", chunk.workspaceId(),
                                    "chunk_id", chunk.id(),
                                    "source_path", chunk.sourcePath(),
                                    "language", chunk.language(),
                                    "chunk_type", chunk.chunkType()))
                            .build())
                    .toList();
            vectorStore.add(documents);
            indexedChunks += documents.size();
        }
        return new ReindexResult(workspaceId, chunks.size(), indexedChunks);
    }

    public KnowledgeStatus knowledgeStatus(String workspaceId) {
        validateWorkspaceId(workspaceId);
        Integer chunkCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM workspace_chunk WHERE workspace_id = ?", Integer.class, workspaceId);
        Integer sourceCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(DISTINCT source_path) FROM workspace_chunk WHERE workspace_id = ?", Integer.class, workspaceId);
        Integer vectorCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM vector_store_openai WHERE metadata ->> 'workspace_id' = ?", Integer.class, workspaceId);
        int chunks = chunkCount == null ? 0 : chunkCount;
        int vectors = vectorCount == null ? 0 : vectorCount;
        String state = chunks == 0 ? "EMPTY" : vectors == chunks ? "READY" : vectors == 0 ? "LEXICAL_ONLY" : "PARTIAL";
        return new KnowledgeStatus(workspaceId, chunks, sourceCount == null ? 0 : sourceCount, vectors,
                true, vectors > 0, "RRF", embeddingBaseUrl, embeddingModel, embeddingDimensions, state);
    }

    public List<KnowledgeSource> recentSources(String workspaceId, int limit) {
        validateWorkspaceId(workspaceId);
        int safeLimit = Math.min(Math.max(limit, 1), 30);
        return jdbcTemplate.query("""
                        SELECT source_path, language, COUNT(*) AS chunk_count, MAX(updated_at) AS updated_at,
                               LEFT(STRING_AGG(content, E'\n\n' ORDER BY start_line), 6000) AS excerpt
                        FROM workspace_chunk
                        WHERE workspace_id = ?
                        GROUP BY source_path, language
                        ORDER BY MAX(updated_at) DESC
                        LIMIT ?
                        """,
                (rs, rowNum) -> new KnowledgeSource(rs.getString("source_path"), rs.getString("language"),
                        rs.getInt("chunk_count"), rs.getString("excerpt"),
                        rs.getTimestamp("updated_at").toLocalDateTime()),
                workspaceId, safeLimit);
    }

    @Transactional
    public DeleteSourceResult deleteSource(String workspaceId, String sourcePath) {
        validateWorkspaceId(workspaceId);
        if (!StringUtils.hasText(sourcePath)) {
            throw new IllegalArgumentException("sourcePath is required");
        }
        int vectorCount = jdbcTemplate.update(
                "DELETE FROM vector_store_openai WHERE metadata ->> 'workspace_id' = ? AND metadata ->> 'source_path' = ?",
                workspaceId, sourcePath);
        int chunkCount = jdbcTemplate.update(
                "DELETE FROM workspace_chunk WHERE workspace_id = ? AND source_path = ?", workspaceId, sourcePath);
        return new DeleteSourceResult(workspaceId, sourcePath, chunkCount, vectorCount);
    }

    private void validateWorkspaceId(String workspaceId) {
        if (workspaceId == null || !WORKSPACE_ID.matcher(workspaceId).matches()) {
            throw new IllegalArgumentException("workspaceId may only contain letters, numbers, underscores, and hyphens");
        }
    }

    private String safeFileName(MultipartFile file) {
        String rawName = file.getOriginalFilename();
        if (!StringUtils.hasText(rawName)) {
            throw new IllegalArgumentException("Every uploaded file needs a name");
        }
        String normalized = rawName.replace('\\', '/');
        if (normalized.contains("../") || normalized.startsWith("/") || normalized.contains("\u0000")) {
            throw new IllegalArgumentException("Unsafe source path: " + rawName);
        }
        if (normalized.length() > 512) {
            throw new IllegalArgumentException("Source path exceeds 512 characters: " + rawName);
        }
        return normalized;
    }

    private String languageOf(String sourcePath) {
        int dot = sourcePath.lastIndexOf('.');
        String extension = dot < 0 ? "" : sourcePath.substring(dot + 1).toLowerCase(Locale.ROOT);
        if (sourcePath.toLowerCase(Locale.ROOT).endsWith("/dockerfile") || sourcePath.equalsIgnoreCase("Dockerfile")) {
            return "dockerfile";
        }
        if (!TEXT_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Unsupported text file type: " + sourcePath);
        }
        return switch (extension) {
            case "md", "markdown" -> "markdown";
            case "txt" -> "text";
            default -> extension;
        };
    }

    private String readUtf8(MultipartFile file, String sourcePath) {
        try {
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            if (content.indexOf('\u0000') >= 0) {
                throw new IllegalArgumentException("Binary files are not supported: " + sourcePath);
            }
            return content;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to read " + sourcePath, e);
        }
    }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }

    private void indexVectors(List<Document> documents, String workspaceId, String sourcePath) {
        try {
            vectorStore.add(documents);
        } catch (Exception e) {
            // Lexical retrieval remains available when an embedding provider is unavailable.
            log.warn("Vector indexing skipped for workspace {} source {}: {}", workspaceId, sourcePath, e.getMessage());
        }
    }

    private Map<String, Integer> semanticRanks(String workspaceId, String query, int limit, Map<String, WorkspaceChunk> chunksById) {
        try {
            List<Document> documents = vectorStore.similaritySearch(SearchRequest.builder()
                    .query(query)
                    .topK(limit)
                    .filterExpression("workspace_id == '" + workspaceId + "'")
                    .build());
            List<String> ids = documents.stream()
                    .map(document -> String.valueOf(document.getMetadata().get("chunk_id")))
                    .filter(chunksById::containsKey)
                    .distinct()
                    .toList();
            return ranks(ids);
        } catch (Exception e) {
            log.warn("Vector retrieval skipped for workspace {}: {}", workspaceId, e.getMessage());
            return Map.of();
        }
    }

    private Map<String, Integer> ranks(List<String> ids) {
        Map<String, Integer> ranks = new LinkedHashMap<>();
        for (int index = 0; index < ids.size(); index++) {
            ranks.putIfAbsent(ids.get(index), index + 1);
        }
        return ranks;
    }

    private double reciprocalRank(int rank) {
        return 1d / (60d + rank);
    }

    private String expandQuery(String query) {
        return query.replaceAll("([a-z])([A-Z])", "$1 $2").replace('_', ' ');
    }

    public record ImportResult(String workspaceId, int importedFiles, int importedChunks) {
    }

    public record ReindexResult(String workspaceId, int totalChunks, int indexedChunks) {
    }

    public record DeleteSourceResult(String workspaceId, String sourcePath, int deletedChunks, int deletedVectors) {
    }

    public record KnowledgeStatus(String workspaceId, int chunkCount, int sourceCount, int vectorCount,
                                  boolean lexicalEnabled, boolean semanticEnabled, String fusionMethod,
                                  String embeddingBaseUrl, String embeddingModel, int embeddingDimensions,
                                  String state) {
    }

    public record KnowledgeSource(String sourcePath, String language, int chunkCount, String excerpt,
                                  LocalDateTime updatedAt) {
    }

    public record SearchResult(String id, String sourcePath, String language, String chunkType, int startLine,
                               int endLine, String content, double score, String retrievalMethod,
                               Integer lexicalRank, Integer semanticRank) {
        private static SearchResult from(WorkspaceChunk chunk, double score, String retrievalMethod,
                                         Integer lexicalRank, Integer semanticRank) {
            return new SearchResult(chunk.id(), chunk.sourcePath(), chunk.language(), chunk.chunkType(), chunk.startLine(),
                    chunk.endLine(), chunk.content(), score, retrievalMethod, lexicalRank, semanticRank);
        }
    }
}

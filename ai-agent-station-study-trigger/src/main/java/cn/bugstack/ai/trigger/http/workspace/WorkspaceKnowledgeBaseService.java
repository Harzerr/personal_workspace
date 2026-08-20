package cn.bugstack.ai.trigger.http.workspace;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class WorkspaceKnowledgeBaseService {

    private static final Pattern RESOURCE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final String DEFAULT_KNOWLEDGE_BASE_ID = "personal-workspace";
    private static final String KNOWLEDGE_ASSISTANT_AGENT_ID = "71908750";

    private final JdbcTemplate jdbcTemplate;

    public WorkspaceKnowledgeBaseService(@Qualifier("workspaceJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initializeSchema() {
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS workspace_knowledge_base (
                    knowledge_base_id VARCHAR(64) PRIMARY KEY,
                    knowledge_base_name VARCHAR(128) NOT NULL,
                    description VARCHAR(512) NOT NULL DEFAULT '',
                    status SMALLINT NOT NULL DEFAULT 1,
                    created_at TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP NOT NULL
                )
                """);
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS workspace_agent_knowledge_base (
                    agent_id VARCHAR(64) NOT NULL,
                    knowledge_base_id VARCHAR(64) NOT NULL,
                    sequence INT NOT NULL DEFAULT 0,
                    status SMALLINT NOT NULL DEFAULT 1,
                    created_at TIMESTAMP NOT NULL,
                    PRIMARY KEY (agent_id, knowledge_base_id),
                    CONSTRAINT fk_workspace_agent_knowledge_base
                        FOREIGN KEY (knowledge_base_id) REFERENCES workspace_knowledge_base(knowledge_base_id) ON DELETE CASCADE
                )
                """);
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_workspace_agent_kb_agent ON workspace_agent_knowledge_base(agent_id, status, sequence)");
        LocalDateTime now = LocalDateTime.now();
        jdbcTemplate.update("""
                        INSERT INTO workspace_knowledge_base
                        (knowledge_base_id, knowledge_base_name, description, status, created_at, updated_at)
                        VALUES (?, ?, ?, 1, ?, ?)
                        ON CONFLICT (knowledge_base_id) DO NOTHING
                        """,
                DEFAULT_KNOWLEDGE_BASE_ID, "个人项目知识库", "项目源码、文档和工作知识的默认检索集合。",
                Timestamp.valueOf(now), Timestamp.valueOf(now));
        jdbcTemplate.update("""
                INSERT INTO workspace_agent_knowledge_base (agent_id, knowledge_base_id, sequence, status, created_at)
                SELECT ?, ?, 0, 1, ?
                WHERE EXISTS (SELECT 1 FROM ai_agent WHERE agent_id = ?)
                  AND NOT EXISTS (SELECT 1 FROM workspace_agent_knowledge_base WHERE agent_id = ?)
                """, KNOWLEDGE_ASSISTANT_AGENT_ID, DEFAULT_KNOWLEDGE_BASE_ID, Timestamp.valueOf(now),
                KNOWLEDGE_ASSISTANT_AGENT_ID, KNOWLEDGE_ASSISTANT_AGENT_ID);
    }

    public List<KnowledgeBase> list() {
        registerExistingStores();
        List<KnowledgeBaseRow> rows = jdbcTemplate.query("""
                        SELECT kb.knowledge_base_id, kb.knowledge_base_name, kb.description, kb.status,
                               kb.created_at, kb.updated_at,
                               (SELECT COUNT(*) FROM workspace_chunk c WHERE c.workspace_id = kb.knowledge_base_id) AS chunk_count,
                               (SELECT COUNT(DISTINCT c.source_path) FROM workspace_chunk c WHERE c.workspace_id = kb.knowledge_base_id) AS source_count,
                               (SELECT COUNT(*) FROM vector_store_openai v WHERE v.metadata ->> 'workspace_id' = kb.knowledge_base_id) AS vector_count
                        FROM workspace_knowledge_base kb
                        ORDER BY kb.updated_at DESC, kb.knowledge_base_name
                        """,
                (rs, rowNum) -> new KnowledgeBaseRow(
                        rs.getString("knowledge_base_id"), rs.getString("knowledge_base_name"),
                        rs.getString("description"), rs.getInt("status"), rs.getInt("source_count"),
                        rs.getInt("chunk_count"), rs.getInt("vector_count"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()));
        Map<String, List<String>> bindings = bindingsByKnowledgeBase();
        return rows.stream().map(row -> new KnowledgeBase(
                row.knowledgeBaseId(), row.knowledgeBaseName(), row.description(), row.status(),
                row.sourceCount(), row.chunkCount(), row.vectorCount(),
                bindings.getOrDefault(row.knowledgeBaseId(), List.of()), row.createdAt(), row.updatedAt())).toList();
    }

    public List<AgentOption> availableAgents() {
        return jdbcTemplate.query("""
                        SELECT agent_id, agent_name, description, status FROM ai_agent
                        WHERE status = 1 ORDER BY agent_name, agent_id
                        """,
                (rs, rowNum) -> new AgentOption(rs.getString("agent_id"), rs.getString("agent_name"),
                        rs.getString("description"), rs.getInt("status")));
    }

    public List<String> boundKnowledgeBaseIds(String agentId) {
        validateId(agentId, "agentId");
        return jdbcTemplate.queryForList("""
                SELECT b.knowledge_base_id FROM workspace_agent_knowledge_base b
                JOIN workspace_knowledge_base kb ON kb.knowledge_base_id = b.knowledge_base_id
                WHERE b.agent_id = ? AND b.status = 1 AND kb.status = 1
                ORDER BY b.sequence, b.knowledge_base_id
                """, String.class, agentId);
    }

    @Transactional
    public KnowledgeBase create(KnowledgeBaseInput input) {
        KnowledgeBaseInput normalized = validate(input);
        String knowledgeBaseId = "kb-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        LocalDateTime now = LocalDateTime.now();
        jdbcTemplate.update("""
                        INSERT INTO workspace_knowledge_base
                        (knowledge_base_id, knowledge_base_name, description, status, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                knowledgeBaseId, normalized.knowledgeBaseName(), normalized.description(), normalized.status(),
                Timestamp.valueOf(now), Timestamp.valueOf(now));
        return find(knowledgeBaseId);
    }

    @Transactional
    public KnowledgeBase update(String knowledgeBaseId, KnowledgeBaseInput input) {
        validateId(knowledgeBaseId, "knowledgeBaseId");
        KnowledgeBaseInput normalized = validate(input);
        int updated = jdbcTemplate.update("""
                        UPDATE workspace_knowledge_base
                        SET knowledge_base_name = ?, description = ?, status = ?, updated_at = ?
                        WHERE knowledge_base_id = ?
                        """,
                normalized.knowledgeBaseName(), normalized.description(), normalized.status(),
                Timestamp.valueOf(LocalDateTime.now()), knowledgeBaseId);
        if (updated == 0) throw new IllegalArgumentException("Knowledge base not found: " + knowledgeBaseId);
        return find(knowledgeBaseId);
    }

    @Transactional
    public void delete(String knowledgeBaseId) {
        validateId(knowledgeBaseId, "knowledgeBaseId");
        Integer chunks = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM workspace_chunk WHERE workspace_id = ?", Integer.class, knowledgeBaseId);
        if (chunks != null && chunks > 0) {
            throw new IllegalStateException("Delete all knowledge sources before deleting the knowledge base");
        }
        int deleted = jdbcTemplate.update("DELETE FROM workspace_knowledge_base WHERE knowledge_base_id = ?", knowledgeBaseId);
        if (deleted == 0) throw new IllegalArgumentException("Knowledge base not found: " + knowledgeBaseId);
    }

    @Transactional
    public KnowledgeBase bind(String knowledgeBaseId, String agentId, int sequence) {
        validateId(knowledgeBaseId, "knowledgeBaseId");
        validateId(agentId, "agentId");
        find(knowledgeBaseId);
        Integer agentCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM ai_agent WHERE agent_id = ? AND status = 1", Integer.class, agentId);
        if (agentCount == null || agentCount == 0) throw new IllegalArgumentException("Active Agent not found: " + agentId);
        jdbcTemplate.update("""
                        INSERT INTO workspace_agent_knowledge_base (agent_id, knowledge_base_id, sequence, status, created_at)
                        VALUES (?, ?, ?, 1, ?)
                        ON CONFLICT (agent_id, knowledge_base_id) DO UPDATE SET sequence = EXCLUDED.sequence, status = 1
                        """, agentId, knowledgeBaseId, Math.max(0, sequence), Timestamp.valueOf(LocalDateTime.now()));
        return find(knowledgeBaseId);
    }

    @Transactional
    public KnowledgeBase unbind(String knowledgeBaseId, String agentId) {
        validateId(knowledgeBaseId, "knowledgeBaseId");
        validateId(agentId, "agentId");
        jdbcTemplate.update("DELETE FROM workspace_agent_knowledge_base WHERE knowledge_base_id = ? AND agent_id = ?",
                knowledgeBaseId, agentId);
        return find(knowledgeBaseId);
    }

    private KnowledgeBase find(String knowledgeBaseId) {
        return list().stream().filter(item -> item.knowledgeBaseId().equals(knowledgeBaseId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Knowledge base not found: " + knowledgeBaseId));
    }

    private void registerExistingStores() {
        LocalDateTime now = LocalDateTime.now();
        jdbcTemplate.update("""
                INSERT INTO workspace_knowledge_base
                    (knowledge_base_id, knowledge_base_name, description, status, created_at, updated_at)
                SELECT DISTINCT c.workspace_id, c.workspace_id, '从现有 RAG 索引自动登记的知识库。',
                                1, CAST(? AS TIMESTAMP), CAST(? AS TIMESTAMP)
                FROM workspace_chunk c
                ON CONFLICT (knowledge_base_id) DO NOTHING
                """, Timestamp.valueOf(now), Timestamp.valueOf(now));
    }

    private Map<String, List<String>> bindingsByKnowledgeBase() {
        Map<String, List<String>> bindings = new LinkedHashMap<>();
        List<Map<String, Object>> rows = jdbcTemplate.queryForList("""
                SELECT knowledge_base_id, agent_id FROM workspace_agent_knowledge_base
                WHERE status = 1 ORDER BY sequence, agent_id
                """);
        rows.forEach(row -> bindings.computeIfAbsent(String.valueOf(row.get("knowledge_base_id")), ignored -> new ArrayList<>())
                .add(String.valueOf(row.get("agent_id"))));
        return bindings;
    }

    private KnowledgeBaseInput validate(KnowledgeBaseInput input) {
        if (input == null || !StringUtils.hasText(input.knowledgeBaseName())) {
            throw new IllegalArgumentException("knowledgeBaseName is required");
        }
        String name = input.knowledgeBaseName().trim();
        String description = input.description() == null ? "" : input.description().trim();
        if (name.length() > 128) throw new IllegalArgumentException("knowledgeBaseName exceeds 128 characters");
        if (description.length() > 512) throw new IllegalArgumentException("description exceeds 512 characters");
        return new KnowledgeBaseInput(name, description, input.status() == 0 ? 0 : 1);
    }

    private void validateId(String value, String name) {
        if (value == null || !RESOURCE_ID.matcher(value).matches()) {
            throw new IllegalArgumentException(name + " may only contain letters, numbers, underscores, and hyphens");
        }
    }

    private record KnowledgeBaseRow(String knowledgeBaseId, String knowledgeBaseName, String description,
                                    int status, int sourceCount, int chunkCount, int vectorCount,
                                    LocalDateTime createdAt, LocalDateTime updatedAt) {
    }

    public record KnowledgeBaseInput(String knowledgeBaseName, String description, int status) {
    }

    public record KnowledgeBase(String knowledgeBaseId, String knowledgeBaseName, String description,
                                int status, int sourceCount, int chunkCount, int vectorCount,
                                List<String> agentIds, LocalDateTime createdAt, LocalDateTime updatedAt) {
    }

    public record AgentOption(String agentId, String agentName, String description, int status) {
    }
}

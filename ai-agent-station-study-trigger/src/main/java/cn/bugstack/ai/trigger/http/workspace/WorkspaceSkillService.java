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
public class WorkspaceSkillService {

    private static final Pattern RESOURCE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private final JdbcTemplate jdbcTemplate;

    public WorkspaceSkillService(@Qualifier("workspaceJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initializeSchema() {
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS workspace_skill (
                    skill_id VARCHAR(64) PRIMARY KEY,
                    workspace_id VARCHAR(64) NOT NULL,
                    skill_name VARCHAR(128) NOT NULL,
                    description VARCHAR(512) NOT NULL DEFAULT '',
                    instructions TEXT NOT NULL,
                    category VARCHAR(64) NOT NULL DEFAULT 'GENERAL',
                    status SMALLINT NOT NULL DEFAULT 1,
                    created_at TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP NOT NULL,
                    CONSTRAINT uk_workspace_skill_name UNIQUE (workspace_id, skill_name)
                )
                """);
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS workspace_agent_skill (
                    agent_id VARCHAR(64) NOT NULL,
                    skill_id VARCHAR(64) NOT NULL,
                    sequence INT NOT NULL DEFAULT 0,
                    status SMALLINT NOT NULL DEFAULT 1,
                    created_at TIMESTAMP NOT NULL,
                    PRIMARY KEY (agent_id, skill_id),
                    CONSTRAINT fk_workspace_agent_skill
                        FOREIGN KEY (skill_id) REFERENCES workspace_skill(skill_id) ON DELETE CASCADE
                )
                """);
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_workspace_skill_workspace ON workspace_skill(workspace_id, status)");
        jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_workspace_agent_skill_agent ON workspace_agent_skill(agent_id, status, sequence)");
    }

    public List<Skill> list(String workspaceId) {
        validateId(workspaceId, "workspaceId");
        List<SkillRow> rows = jdbcTemplate.query("""
                        SELECT skill_id, workspace_id, skill_name, description, instructions, category,
                               status, created_at, updated_at
                        FROM workspace_skill WHERE workspace_id = ? ORDER BY updated_at DESC
                        """,
                (rs, rowNum) -> new SkillRow(rs.getString("skill_id"), rs.getString("workspace_id"),
                        rs.getString("skill_name"), rs.getString("description"), rs.getString("instructions"),
                        rs.getString("category"), rs.getInt("status"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getTimestamp("updated_at").toLocalDateTime()),
                workspaceId);
        Map<String, List<String>> bindings = new LinkedHashMap<>();
        List<Map<String, Object>> bindingRows = jdbcTemplate.queryForList("""
                SELECT b.skill_id, b.agent_id FROM workspace_agent_skill b
                JOIN workspace_skill s ON s.skill_id = b.skill_id
                WHERE s.workspace_id = ? AND b.status = 1 ORDER BY b.sequence, b.agent_id
                """, workspaceId);
        bindingRows.forEach(row -> bindings.computeIfAbsent(String.valueOf(row.get("skill_id")), ignored -> new ArrayList<>())
                .add(String.valueOf(row.get("agent_id"))));
        return rows.stream().map(row -> new Skill(row.skillId(), row.workspaceId(), row.skillName(),
                row.description(), row.instructions(), row.category(), row.status(),
                bindings.getOrDefault(row.skillId(), List.of()), row.createdAt(), row.updatedAt())).toList();
    }

    public List<AgentOption> availableAgents() {
        return jdbcTemplate.query("""
                        SELECT agent_id, agent_name, description, status FROM ai_agent
                        WHERE status = 1 ORDER BY agent_name, agent_id
                        """,
                (rs, rowNum) -> new AgentOption(rs.getString("agent_id"), rs.getString("agent_name"),
                        rs.getString("description"), rs.getInt("status")));
    }

    @Transactional
    public Skill create(String workspaceId, SkillInput input) {
        validateId(workspaceId, "workspaceId");
        SkillInput normalized = validate(input);
        String skillId = "skill-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        LocalDateTime now = LocalDateTime.now();
        jdbcTemplate.update("""
                        INSERT INTO workspace_skill
                        (skill_id, workspace_id, skill_name, description, instructions, category, status, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                skillId, workspaceId, normalized.skillName(), normalized.description(), normalized.instructions(),
                normalized.category(), normalized.status(), Timestamp.valueOf(now), Timestamp.valueOf(now));
        return find(workspaceId, skillId);
    }

    @Transactional
    public Skill update(String workspaceId, String skillId, SkillInput input) {
        validateId(workspaceId, "workspaceId");
        validateId(skillId, "skillId");
        SkillInput normalized = validate(input);
        int updated = jdbcTemplate.update("""
                        UPDATE workspace_skill SET skill_name = ?, description = ?, instructions = ?,
                            category = ?, status = ?, updated_at = ?
                        WHERE workspace_id = ? AND skill_id = ?
                        """,
                normalized.skillName(), normalized.description(), normalized.instructions(), normalized.category(),
                normalized.status(), Timestamp.valueOf(LocalDateTime.now()), workspaceId, skillId);
        if (updated == 0) throw new IllegalArgumentException("Skill not found: " + skillId);
        return find(workspaceId, skillId);
    }

    @Transactional
    public void delete(String workspaceId, String skillId) {
        validateId(workspaceId, "workspaceId");
        validateId(skillId, "skillId");
        int deleted = jdbcTemplate.update("DELETE FROM workspace_skill WHERE workspace_id = ? AND skill_id = ?",
                workspaceId, skillId);
        if (deleted == 0) throw new IllegalArgumentException("Skill not found: " + skillId);
    }

    @Transactional
    public Skill bind(String workspaceId, String skillId, String agentId, int sequence) {
        validateId(workspaceId, "workspaceId");
        validateId(skillId, "skillId");
        validateId(agentId, "agentId");
        find(workspaceId, skillId);
        Integer agentCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ai_agent WHERE agent_id = ? AND status = 1",
                Integer.class, agentId);
        if (agentCount == null || agentCount == 0) throw new IllegalArgumentException("Active Agent not found: " + agentId);
        jdbcTemplate.update("""
                        INSERT INTO workspace_agent_skill (agent_id, skill_id, sequence, status, created_at)
                        VALUES (?, ?, ?, 1, ?)
                        ON CONFLICT (agent_id, skill_id) DO UPDATE SET sequence = EXCLUDED.sequence, status = 1
                        """, agentId, skillId, Math.max(0, sequence), Timestamp.valueOf(LocalDateTime.now()));
        return find(workspaceId, skillId);
    }

    @Transactional
    public Skill unbind(String workspaceId, String skillId, String agentId) {
        validateId(workspaceId, "workspaceId");
        validateId(skillId, "skillId");
        validateId(agentId, "agentId");
        jdbcTemplate.update("DELETE FROM workspace_agent_skill WHERE skill_id = ? AND agent_id = ?", skillId, agentId);
        return find(workspaceId, skillId);
    }

    private Skill find(String workspaceId, String skillId) {
        return list(workspaceId).stream().filter(skill -> skill.skillId().equals(skillId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + skillId));
    }

    private SkillInput validate(SkillInput input) {
        if (input == null || !StringUtils.hasText(input.skillName())) throw new IllegalArgumentException("skillName is required");
        if (!StringUtils.hasText(input.instructions())) throw new IllegalArgumentException("instructions are required");
        String name = input.skillName().trim();
        String instructions = input.instructions().trim();
        if (name.length() > 128) throw new IllegalArgumentException("skillName exceeds 128 characters");
        if (instructions.length() > 12000) throw new IllegalArgumentException("instructions exceed 12000 characters");
        String description = input.description() == null ? "" : input.description().trim();
        String category = StringUtils.hasText(input.category()) ? input.category().trim().toUpperCase() : "GENERAL";
        return new SkillInput(name, description, instructions, category, input.status() == 0 ? 0 : 1);
    }

    private void validateId(String value, String name) {
        if (value == null || !RESOURCE_ID.matcher(value).matches()) {
            throw new IllegalArgumentException(name + " may only contain letters, numbers, underscores, and hyphens");
        }
    }

    private record SkillRow(String skillId, String workspaceId, String skillName, String description,
                            String instructions, String category, int status,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
    }

    public record SkillInput(String skillName, String description, String instructions, String category, int status) {
    }

    public record Skill(String skillId, String workspaceId, String skillName, String description,
                        String instructions, String category, int status, List<String> agentIds,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
    }

    public record AgentOption(String agentId, String agentName, String description, int status) {
    }
}

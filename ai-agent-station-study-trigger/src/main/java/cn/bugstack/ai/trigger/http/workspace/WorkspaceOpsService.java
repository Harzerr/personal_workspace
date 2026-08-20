package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.spec.McpSchema;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class WorkspaceOpsService {

    private static final Pattern SAFE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final Set<String> INSPECTION_MODES = Set.of("QUICK", "STANDARD", "DIAGNOSTIC");
    private static final Set<String> HEALTH_STATUSES = Set.of("HEALTHY", "ATTENTION", "FAULT", "UNKNOWN");

    private final WorkspaceAgentClientResolver clientResolver;
    private final ObjectMapper objectMapper;
    private final String opsAgentId;

    public WorkspaceOpsService(WorkspaceAgentClientResolver clientResolver,
                               ObjectMapper objectMapper,
                               @Value("${workspace.workflow.ops-agent-id:71908740}") String opsAgentId) {
        this.clientResolver = clientResolver;
        this.objectMapper = objectMapper;
        this.opsAgentId = requiredId(opsAgentId, "opsAgentId");
    }

    public OpsCatalog catalog(String workspaceId) {
        String actualWorkspaceId = requiredId(workspaceId, "workspaceId");
        JsonNode payload = call("list_targets", Map.of("workspace_id", actualWorkspaceId));
        JsonNode targetNodes = payload.path("targets");
        if (!targetNodes.isArray()) {
            throw new IllegalStateException("Operations MCP did not return a targets array");
        }
        List<OpsTarget> targets = new ArrayList<>();
        for (JsonNode targetNode : targetNodes) {
            String targetId = targetNode.path("targetId").asText("");
            String displayName = targetNode.path("displayName").asText("");
            if (!SAFE_ID.matcher(targetId).matches() || !StringUtils.hasText(displayName)) {
                continue;
            }
            List<OpsProject> projects = new ArrayList<>();
            JsonNode projectNodes = targetNode.path("projects");
            if (projectNodes.isArray()) {
                for (JsonNode projectNode : projectNodes) {
                    String projectId = projectNode.path("projectId").asText("");
                    String projectName = projectNode.path("displayName").asText("");
                    if (SAFE_ID.matcher(projectId).matches() && StringUtils.hasText(projectName)) {
                        projects.add(new OpsProject(projectId, projectName));
                    }
                }
            }
            targets.add(new OpsTarget(targetId, displayName, List.copyOf(projects)));
        }
        if (targets.isEmpty()) {
            throw new IllegalStateException("No operations targets are configured for this workspace");
        }
        return new OpsCatalog(List.copyOf(targets));
    }

    public OpsSnapshot collect(String workspaceId, OpsCollectionRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Operations collection request is required");
        }
        String actualWorkspaceId = requiredId(workspaceId, "workspaceId");
        String targetId = requiredId(request.targetId(), "targetId");
        int lookbackMinutes = inRange(request.lookbackMinutes(), 60, 15, 1440, "lookbackMinutes");
        String inspectionMode = StringUtils.hasText(request.inspectionMode())
                ? request.inspectionMode().trim().toUpperCase(Locale.ROOT) : "STANDARD";
        if (!INSPECTION_MODES.contains(inspectionMode)) {
            throw new IllegalArgumentException("inspectionMode must be QUICK, STANDARD, or DIAGNOSTIC");
        }
        boolean includeLogs = request.includeLogs() == null || request.includeLogs();
        List<String> projectIds = normalizeProjectIds(targetId, request.projectIds());

        Map<String, Object> arguments = new LinkedHashMap<>();
        arguments.put("workspace_id", actualWorkspaceId);
        arguments.put("target_id", targetId);
        arguments.put("project_ids", projectIds);
        arguments.put("lookback_minutes", lookbackMinutes);
        arguments.put("inspection_mode", inspectionMode);
        arguments.put("include_logs", includeLogs);
        JsonNode payload = call("collect_ops_snapshot", arguments);

        String snapshotId = payload.path("snapshotId").asText("");
        String collectedAtText = payload.path("collectedAt").asText("");
        String collectedTargetId = payload.path("targetId").asText("");
        if (!StringUtils.hasText(snapshotId) || !targetId.equals(collectedTargetId)) {
            throw new IllegalStateException("Operations MCP returned an invalid snapshot identity");
        }
        Instant collectedAt;
        try {
            collectedAt = Instant.parse(collectedAtText);
        } catch (DateTimeParseException e) {
            throw new IllegalStateException("Operations MCP returned an invalid collection timestamp", e);
        }
        Duration snapshotAge = Duration.between(collectedAt, Instant.now());
        if (snapshotAge.isNegative() && snapshotAge.abs().compareTo(Duration.ofMinutes(1)) > 0
                || snapshotAge.compareTo(Duration.ofMinutes(15)) > 0) {
            throw new IllegalStateException("Operations MCP returned a stale collection timestamp");
        }
        if (!payload.path("projects").isArray() || payload.path("projects").isEmpty()) {
            throw new IllegalStateException("Operations MCP returned no project snapshots");
        }

        List<String> projectNames = new ArrayList<>();
        payload.path("projects").forEach(project -> {
            String name = project.path("displayName").asText("");
            if (StringUtils.hasText(name)) {
                projectNames.add(name);
            }
        });
        String displayName = payload.path("targetName").asText(targetId);
        String overallStatus = payload.path("overallStatus").asText("UNKNOWN");
        double completeness = payload.path("completeness").asDouble(0);
        if (!HEALTH_STATUSES.contains(overallStatus) || completeness < 0 || completeness > 1) {
            throw new IllegalStateException("Operations MCP returned an invalid health summary");
        }
        List<String> evidenceIds = evidenceIds(payload, false);
        List<String> abnormalEvidenceIds = evidenceIds(payload, true);
        if (evidenceIds.isEmpty()) {
            throw new IllegalStateException("Operations MCP returned no evidence IDs");
        }

        Map<String, Object> metadata = new LinkedHashMap<>();
        metadata.put("connectorMode", "READ_ONLY_MCP");
        metadata.put("snapshotId", snapshotId);
        metadata.put("collectedAt", collectedAt.toString());
        metadata.put("targetId", targetId);
        metadata.put("targetName", displayName);
        metadata.put("projectNames", List.copyOf(projectNames));
        metadata.put("projectCount", projectNames.size());
        metadata.put("overallStatus", overallStatus);
        metadata.put("completeness", completeness);
        metadata.put("evidenceIds", evidenceIds);
        metadata.put("abnormalEvidenceIds", abnormalEvidenceIds);
        metadata.put("lookbackMinutes", lookbackMinutes);
        metadata.put("inspectionMode", inspectionMode);
        metadata.put("includeLogs", includeLogs);

        try {
            return new OpsSnapshot(snapshotId, collectedAt, targetId, displayName, overallStatus,
                    completeness, List.copyOf(projectNames),
                    objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(payload), Map.copyOf(metadata));
        } catch (Exception e) {
            throw new IllegalStateException("Unable to encode operations snapshot", e);
        }
    }

    private JsonNode call(String toolName, Map<String, Object> arguments) {
        McpSyncClient client = clientResolver.resolveMcpClientForAgent(opsAgentId, "TASK_ANALYZER_CLIENT");
        McpSchema.CallToolResult result = client.callTool(new McpSchema.CallToolRequest(toolName, arguments));
        if (Boolean.TRUE.equals(result.isError())) {
            throw new IllegalStateException("Operations MCP returned an error: " + text(result));
        }
        String content = text(result);
        if (!StringUtils.hasText(content)) {
            throw new IllegalStateException("Operations MCP returned an empty response");
        }
        try {
            JsonNode payload = objectMapper.readTree(content);
            if (payload.isTextual()) {
                payload = objectMapper.readTree(payload.asText());
            }
            if (!payload.isObject()) {
                throw new IllegalStateException("Operations MCP response must be a JSON object");
            }
            return payload;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Unable to parse operations MCP response", e);
        }
    }

    private String text(McpSchema.CallToolResult result) {
        StringBuilder value = new StringBuilder();
        for (McpSchema.Content content : result.content()) {
            if (content instanceof McpSchema.TextContent text) {
                value.append(text.text());
            }
        }
        return value.toString();
    }

    private List<String> evidenceIds(JsonNode payload, boolean abnormalOnly) {
        LinkedHashSet<String> values = new LinkedHashSet<>();
        payload.findParents("evidenceId").forEach(parent -> {
            String evidenceId = parent.path("evidenceId").asText("");
            String status = parent.path("status").asText("UNKNOWN");
            if (StringUtils.hasText(evidenceId) && (!abnormalOnly || !"HEALTHY".equals(status))) {
                values.add(evidenceId);
            }
        });
        return List.copyOf(values);
    }

    private List<String> normalizeProjectIds(String targetId, List<String> requested) {
        if (requested == null || requested.isEmpty() || requested.contains("*")) {
            return List.of("*");
        }
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String raw : requested) {
            if (!StringUtils.hasText(raw)) {
                continue;
            }
            String value = raw.trim();
            int separator = value.indexOf("::");
            if (separator >= 0) {
                String optionTarget = value.substring(0, separator);
                if (!targetId.equals(optionTarget)) {
                    throw new IllegalArgumentException("Selected project does not belong to target " + targetId);
                }
                value = value.substring(separator + 2);
            }
            normalized.add(requiredId(value, "projectId"));
        }
        return normalized.isEmpty() ? List.of("*") : List.copyOf(normalized);
    }

    private int inRange(Integer value, int fallback, int minimum, int maximum, String name) {
        int actual = value == null ? fallback : value;
        if (actual < minimum || actual > maximum) {
            throw new IllegalArgumentException(name + " must be between " + minimum + " and " + maximum);
        }
        return actual;
    }

    private String requiredId(String value, String name) {
        if (!StringUtils.hasText(value) || !SAFE_ID.matcher(value.trim()).matches()) {
            throw new IllegalArgumentException(name + " is invalid");
        }
        return value.trim();
    }

    public record OpsCatalog(List<OpsTarget> targets) {
    }

    public record OpsTarget(String targetId, String displayName, List<OpsProject> projects) {
    }

    public record OpsProject(String projectId, String displayName) {
    }

    public record OpsCollectionRequest(String targetId, List<String> projectIds, Integer lookbackMinutes,
                                       String inspectionMode, Boolean includeLogs) {
    }

    public record OpsSnapshot(String snapshotId, Instant collectedAt, String targetId, String targetName,
                              String overallStatus, double completeness, List<String> projectNames,
                              String evidence, Map<String, Object> metadata) {
    }
}

package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.spec.McpSchema;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WorkspaceOpsServiceTest {

    @Test
    void readsTargetCatalogFromMcp() {
        McpSyncClient mcpClient = mock(McpSyncClient.class);
        WorkspaceAgentClientResolver resolver = resolver(mcpClient);
        when(mcpClient.callTool(org.mockito.ArgumentMatchers.any())).thenReturn(result("""
                {"targets":[{"targetId":"prod-main","displayName":"主生产服务器","projects":[
                  {"projectId":"chatbot","displayName":"面面通"}
                ]}]}
                """));
        WorkspaceOpsService service = new WorkspaceOpsService(resolver, new ObjectMapper(), "71908740");

        WorkspaceOpsService.OpsCatalog catalog = service.catalog("demo");

        assertEquals("prod-main", catalog.targets().get(0).targetId());
        assertEquals("chatbot", catalog.targets().get(0).projects().get(0).projectId());
    }

    @Test
    void validatesAndNormalizesCollectionArguments() {
        McpSyncClient mcpClient = mock(McpSyncClient.class);
        WorkspaceAgentClientResolver resolver = resolver(mcpClient);
        when(mcpClient.callTool(org.mockito.ArgumentMatchers.any())).thenReturn(result("""
                {"snapshotId":"snapshot-1","collectedAt":"%s",
                 "targetId":"prod-main","targetName":"主生产服务器","overallStatus":"HEALTHY",
                 "completeness":1.0,"projects":[{"projectId":"chatbot","displayName":"面面通",
                 "checks":[{"evidenceId":"EV-0001","status":"HEALTHY"}]}]}
                """.formatted(Instant.now())));
        WorkspaceOpsService service = new WorkspaceOpsService(resolver, new ObjectMapper(), "71908740");

        WorkspaceOpsService.OpsSnapshot snapshot = service.collect("demo",
                new WorkspaceOpsService.OpsCollectionRequest(
                        "prod-main", List.of("prod-main::chatbot"), 60, "standard", true));

        assertEquals("snapshot-1", snapshot.snapshotId());
        assertEquals(List.of("面面通"), snapshot.projectNames());
        ArgumentCaptor<McpSchema.CallToolRequest> request = ArgumentCaptor.forClass(McpSchema.CallToolRequest.class);
        org.mockito.Mockito.verify(mcpClient).callTool(request.capture());
        assertEquals("collect_ops_snapshot", request.getValue().name());
        assertEquals(List.of("chatbot"), request.getValue().arguments().get("project_ids"));
        assertEquals("STANDARD", request.getValue().arguments().get("inspection_mode"));
    }

    @Test
    void rejectsProjectFromAnotherTargetBeforeCallingMcp() {
        WorkspaceOpsService service = new WorkspaceOpsService(mock(WorkspaceAgentClientResolver.class),
                new ObjectMapper(), "71908740");

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> service.collect("demo",
                new WorkspaceOpsService.OpsCollectionRequest(
                        "prod-main", List.of("staging::chatbot"), 60, "STANDARD", true)));

        assertTrue(error.getMessage().contains("does not belong"));
    }

    @Test
    void rejectsSnapshotWithNoProjects() {
        McpSyncClient mcpClient = mock(McpSyncClient.class);
        WorkspaceAgentClientResolver resolver = resolver(mcpClient);
        when(mcpClient.callTool(org.mockito.ArgumentMatchers.any())).thenReturn(result("""
                {"snapshotId":"snapshot-1","collectedAt":"%s",
                 "targetId":"prod-main","projects":[]}
                """.formatted(Instant.now())));
        WorkspaceOpsService service = new WorkspaceOpsService(resolver, new ObjectMapper(), "71908740");

        IllegalStateException error = assertThrows(IllegalStateException.class, () -> service.collect("demo",
                new WorkspaceOpsService.OpsCollectionRequest("prod-main", List.of("*"), 60, "STANDARD", true)));

        assertTrue(error.getMessage().contains("no project snapshots"));
    }

    private WorkspaceAgentClientResolver resolver(McpSyncClient mcpClient) {
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        when(resolver.resolveMcpClientForAgent("71908740", "TASK_ANALYZER_CLIENT")).thenReturn(mcpClient);
        return resolver;
    }

    private McpSchema.CallToolResult result(String json) {
        return new McpSchema.CallToolResult(List.of(new McpSchema.TextContent(json)), false);
    }
}

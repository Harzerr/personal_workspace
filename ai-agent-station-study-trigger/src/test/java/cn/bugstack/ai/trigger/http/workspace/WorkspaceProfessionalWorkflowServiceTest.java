package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.ai.chat.client.ChatClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class WorkspaceProfessionalWorkflowServiceTest {

    @TempDir
    Path storageDirectory;

    @Test
    void exposesACompleteRenderSchemaForEveryWorkflow() {
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class),
                mock(WorkspaceAgentClientResolver.class));

        List<WorkspaceProfessionalWorkflowService.WorkflowDefinition> definitions = service.definitions();

        assertEquals(3, definitions.size());
        assertTrue(definitions.stream().allMatch(definition -> !definition.tabLabel().isBlank()));
        assertTrue(definitions.stream().allMatch(definition -> !definition.actionLabel().isBlank()));
        assertTrue(definitions.stream().allMatch(definition -> !definition.inputs().isEmpty()));
        assertFalse(definitions.stream()
                .anyMatch(definition -> definition.type() == WorkspaceProfessionalWorkflowService.WorkflowType.CODE_REVIEW));
    }

    @Test
    void buildsOpsFieldsFromTheRegisteredMcpCatalog() {
        WorkspaceOpsService opsService = mock(WorkspaceOpsService.class);
        when(opsService.catalog("demo")).thenReturn(new WorkspaceOpsService.OpsCatalog(List.of(
                new WorkspaceOpsService.OpsTarget("prod-main", "主生产服务器", List.of(
                        new WorkspaceOpsService.OpsProject("chatbot", "面面通"),
                        new WorkspaceOpsService.OpsProject("personal-ai-workspace", "Personal AI Workspace"))))));
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class),
                mock(WorkspaceAgentClientResolver.class), mock(WorkspaceKnowledgeService.class), opsService);

        WorkspaceProfessionalWorkflowService.WorkflowDefinition definition = service.definitions("demo").stream()
                .filter(value -> value.type() == WorkspaceProfessionalWorkflowService.WorkflowType.OPS_REPORT)
                .findFirst().orElseThrow();

        assertTrue(definition.ready());
        assertEquals("服务器项目运维报告 Agent", definition.name());
        assertTrue(definition.inputs().stream().anyMatch(field -> field.name().equals("projectIds")
                && field.type() == WorkspaceProfessionalWorkflowService.InputType.MULTISELECT
                && field.options().stream().anyMatch(option -> option.value().equals("prod-main::chatbot"))));
        assertTrue(definition.inputs().stream().anyMatch(field -> field.name().equals("includeLogs")
                && field.type() == WorkspaceProfessionalWorkflowService.InputType.TOGGLE));
    }

    @Test
    void marksOnlyOpsWorkflowUnavailableWhenItsMcpCatalogFails() {
        WorkspaceOpsService opsService = mock(WorkspaceOpsService.class);
        when(opsService.catalog("demo")).thenThrow(new IllegalStateException("Operations MCP unavailable"));
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class),
                mock(WorkspaceAgentClientResolver.class), mock(WorkspaceKnowledgeService.class), opsService);

        List<WorkspaceProfessionalWorkflowService.WorkflowDefinition> definitions = service.definitions("demo");

        assertTrue(definitions.stream().filter(value -> value.type() != WorkspaceProfessionalWorkflowService.WorkflowType.OPS_REPORT)
                .allMatch(WorkspaceProfessionalWorkflowService.WorkflowDefinition::ready));
        WorkspaceProfessionalWorkflowService.WorkflowDefinition ops = definitions.stream()
                .filter(value -> value.type() == WorkspaceProfessionalWorkflowService.WorkflowType.OPS_REPORT)
                .findFirst().orElseThrow();
        assertFalse(ops.ready());
        assertTrue(ops.readiness().contains("Operations MCP unavailable"));
    }

    @Test
    void rejectsResearchReportThatDropsExactUrlAndTimestampAfterRevision() {
        WorkspaceAiNewsService newsService = mock(WorkspaceAiNewsService.class);
        WorkspaceAiNewsService.NewsEvent event = new WorkspaceAiNewsService.NewsEvent(
                "Qwen release", "https://example.com/qwen-release", Instant.parse("2026-08-17T02:30:00Z"),
                "Example AI", "A verified release summary");
        when(newsService.collectAndSelect("AI models", 3, 72, "71908730"))
                .thenReturn(new WorkspaceAiNewsService.NewsSelection(List.of(event, event, event), 3, List.of(), Instant.now()));

        ChatClient writer = chat("# AI models\n\nSummary without source metadata.",
                "# AI models\n\nRevised, but still missing exact metadata.");
        ChatClient inspector = chat(approvedInspection(), approvedInspection());
        WorkspaceProfessionalWorkflowService service = service(newsService, resolver(null, writer, inspector));

        WorkspaceProfessionalWorkflowService.WorkflowRun run = service.runResearchReport("demo",
                new WorkspaceProfessionalWorkflowService.ResearchReportRequest("AI models", 3, 72));

        assertEquals(WorkspaceProfessionalWorkflowService.WorkflowStatus.REJECTED, run.status());
        assertEquals(2, run.reviews().size());
        assertTrue(run.reviews().get(0).issues().stream().anyMatch(issue -> issue.contains("exact URL")));
        assertTrue(run.reviews().get(0).issues().stream().anyMatch(issue -> issue.contains("publication timestamp")));
        assertFalse(Files.exists(storageDirectory.resolve("demo/research-report/" + run.runId() + ".md")));
    }

    @Test
    void rejectsResearchReportThatChangesTopicToAiNews() {
        WorkspaceAiNewsService newsService = mock(WorkspaceAiNewsService.class);
        WorkspaceAiNewsService.NewsEvent event = new WorkspaceAiNewsService.NewsEvent(
                "黄金期货行情", "https://example.com/gold", Instant.parse("2026-08-18T02:30:00Z"),
                "Example Finance", "COMEX 黄金期货价格出现波动");
        when(newsService.collectAndSelect("黄金期货现状与趋势", 3, 72, "71908730"))
                .thenReturn(new WorkspaceAiNewsService.NewsSelection(List.of(event, event, event), 3, List.of(), Instant.now()));
        String wrongReport = """
                # 专题调研：人工智能算力投资、商业转型与产业链整合现状分析

                所供证据不涵盖黄金或大宗商品数据，以下讨论人工智能算力投资。
                AI 云基础设施正在扩张，企业并购活动增加。

                https://example.com/gold
                2026-08-18T02:30:00Z
                """;
        ChatClient writer = chat(wrongReport, wrongReport);
        ChatClient inspector = chat(approvedInspection(), approvedInspection());
        WorkspaceProfessionalWorkflowService service = service(newsService, resolver(null, writer, inspector));

        WorkspaceProfessionalWorkflowService.WorkflowRun run = service.runResearchReport("demo",
                new WorkspaceProfessionalWorkflowService.ResearchReportRequest("黄金期货现状与趋势", 3, 72));

        assertEquals(WorkspaceProfessionalWorkflowService.WorkflowStatus.REJECTED, run.status());
        assertEquals(2, run.reviews().size());
        assertTrue(run.reviews().get(1).issues().stream().anyMatch(issue -> issue.contains("research title")));
        assertTrue(run.reviews().get(1).issues().stream().anyMatch(issue -> issue.contains("requested topic")));
    }

    @Test
    void persistsOpsFailureWhenReadOnlyMcpCollectionFails() {
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        WorkspaceOpsService opsService = mock(WorkspaceOpsService.class);
        when(opsService.collect(eq("demo"), org.mockito.ArgumentMatchers.any()))
                .thenThrow(new IllegalStateException("Operations MCP unavailable"));
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class), resolver,
                mock(WorkspaceKnowledgeService.class), opsService);

        WorkspaceProfessionalWorkflowService.WorkflowRun run = service.runOpsReport("demo",
                new WorkspaceProfessionalWorkflowService.OpsReportRequest(
                        "prod-main", List.of("*"), 60, "STANDARD", true, "health"));

        assertEquals(WorkspaceProfessionalWorkflowService.WorkflowStatus.FAILED, run.status());
        assertTrue(run.error().contains("Operations MCP unavailable"));
        assertEquals(run.runId(), service.listRuns("demo", WorkspaceProfessionalWorkflowService.WorkflowType.OPS_REPORT)
                .get(0).runId());
        assertNotNull(service.getRun("demo", run.runId()));
        verifyNoInteractions(resolver);
    }

    @Test
    void generatesOpsReportFromAutomaticSnapshot() {
        Instant collectedAt = Instant.parse("2026-08-19T04:00:00Z");
        Map<String, Object> metadata = Map.of(
                "connectorMode", "READ_ONLY_MCP", "snapshotId", "snapshot-1",
                "collectedAt", collectedAt.toString(), "targetId", "prod-main",
                "targetName", "主生产服务器", "projectNames", List.of("面面通"),
                "overallStatus", "ATTENTION", "completeness", 1.0);
        WorkspaceOpsService opsService = mock(WorkspaceOpsService.class);
        when(opsService.collect(eq("demo"), org.mockito.ArgumentMatchers.any()))
                .thenReturn(new WorkspaceOpsService.OpsSnapshot("snapshot-1", collectedAt, "prod-main",
                        "主生产服务器", "ATTENTION", 1.0, List.of("面面通"),
                        "{\"projects\":[{\"displayName\":\"面面通\",\"status\":\"ATTENTION\",\"evidenceId\":\"EV-0001\"}]}", metadata));
        String report = "# 服务器项目运维报告\n\n采集时间：2026-08-19T04:00:00Z\n\n"
                + "snapshot-1 / 主生产服务器 / 面面通 / ATTENTION / EV-0001";
        WorkspaceAgentClientResolver resolver = resolver(chat("analysis"), chat(report), chat(approvedInspection()));
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class), resolver,
                mock(WorkspaceKnowledgeService.class), opsService);

        WorkspaceProfessionalWorkflowService.WorkflowRun run = service.runOpsReport("demo",
                new WorkspaceProfessionalWorkflowService.OpsReportRequest(
                        "prod-main", List.of("prod-main::chatbot"), 60, "STANDARD", true, "检查入口"));

        assertEquals(WorkspaceProfessionalWorkflowService.WorkflowStatus.COMPLETED, run.status());
        assertEquals("snapshot-1", run.metadata().get("snapshotId"));
        assertTrue(Files.exists(storageDirectory.resolve("demo/ops-report/" + run.runId() + ".md")));
        verify(opsService).collect(eq("demo"), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void rejectsOpsReportThatDropsDeterministicSnapshotFields() {
        Instant collectedAt = Instant.parse("2026-08-19T04:00:00Z");
        Map<String, Object> metadata = Map.of(
                "connectorMode", "READ_ONLY_MCP", "snapshotId", "snapshot-1",
                "collectedAt", collectedAt.toString(), "targetId", "prod-main",
                "targetName", "主生产服务器", "projectNames", List.of("面面通"),
                "overallStatus", "FAULT", "completeness", 1.0);
        WorkspaceOpsService opsService = mock(WorkspaceOpsService.class);
        when(opsService.collect(eq("demo"), org.mockito.ArgumentMatchers.any()))
                .thenReturn(new WorkspaceOpsService.OpsSnapshot("snapshot-1", collectedAt, "prod-main",
                        "主生产服务器", "FAULT", 1.0, List.of("面面通"), "{}", metadata));
        WorkspaceAgentClientResolver resolver = resolver(chat("analysis"),
                chat("# 运维报告\n\n一切正常。", "# 运维报告\n\n已执行重启，问题解决。"),
                chat(approvedInspection(), approvedInspection()));
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class), resolver,
                mock(WorkspaceKnowledgeService.class), opsService);

        WorkspaceProfessionalWorkflowService.WorkflowRun run = service.runOpsReport("demo",
                new WorkspaceProfessionalWorkflowService.OpsReportRequest(
                        "prod-main", List.of("*"), 60, "STANDARD", true, null));

        assertEquals(WorkspaceProfessionalWorkflowService.WorkflowStatus.REJECTED, run.status());
        assertEquals(2, run.reviews().size());
        assertTrue(run.reviews().get(1).issues().stream()
                .anyMatch(issue -> issue.contains("read-only workflow")));
        assertFalse(Files.exists(storageDirectory.resolve("demo/ops-report/" + run.runId() + ".md")));
    }

    @Test
    void rejectsLegacyCodeReviewExecution() {
        WorkspaceProfessionalWorkflowService service = service(mock(WorkspaceAiNewsService.class),
                mock(WorkspaceAgentClientResolver.class));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> service.run("demo",
                new WorkspaceProfessionalWorkflowService.WorkflowExecutionRequest(
                        WorkspaceProfessionalWorkflowService.WorkflowType.CODE_REVIEW, java.util.Map.of())));

        assertEquals("Code review workflow has been removed", error.getMessage());
    }

    private WorkspaceProfessionalWorkflowService service(WorkspaceAiNewsService newsService,
                                                          WorkspaceAgentClientResolver resolver) {
        return service(newsService, resolver, mock(WorkspaceKnowledgeService.class));
    }

    private WorkspaceProfessionalWorkflowService service(WorkspaceAiNewsService newsService,
                                                          WorkspaceAgentClientResolver resolver,
                                                          WorkspaceKnowledgeService knowledgeService) {
        return service(newsService, resolver, knowledgeService, mock(WorkspaceOpsService.class));
    }

    private WorkspaceProfessionalWorkflowService service(WorkspaceAiNewsService newsService,
                                                          WorkspaceAgentClientResolver resolver,
                                                          WorkspaceKnowledgeService knowledgeService,
                                                          WorkspaceOpsService opsService) {
        return new WorkspaceProfessionalWorkflowService(knowledgeService, mock(WorkspaceKnowledgeBaseService.class),
                newsService, opsService, resolver,
                new ObjectMapper().findAndRegisterModules(), storageDirectory.toString(), 80,
                "71908720", "71908730", "71908740");
    }

    private WorkspaceAgentClientResolver resolver(ChatClient analyzer, ChatClient writer, ChatClient inspector) {
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        if (analyzer != null) {
            when(resolver.resolveClientForAgent(anyString(), eq("TASK_ANALYZER_CLIENT")))
                    .thenReturn(new WorkspaceAgentClientResolver.ResolvedClient(analyzer, null,
                            "TASK_ANALYZER_CLIENT", "analyzer"));
        }
        when(resolver.resolveClientForAgent(anyString(), eq("PRECISION_EXECUTOR_CLIENT")))
                .thenReturn(new WorkspaceAgentClientResolver.ResolvedClient(writer, null,
                        "PRECISION_EXECUTOR_CLIENT", "writer"));
        when(resolver.resolveClientForAgent(anyString(), eq("QUALITY_SUPERVISOR_CLIENT")))
                .thenReturn(new WorkspaceAgentClientResolver.ResolvedClient(inspector, null,
                        "QUALITY_SUPERVISOR_CLIENT", "inspector"));
        return resolver;
    }

    private ChatClient chat(String first, String... remaining) {
        ChatClient client = mock(ChatClient.class, RETURNS_DEEP_STUBS);
        String[] subsequent = remaining == null ? new String[0] : remaining;
        when(client.prompt().system(anyString()).user(anyString()).call().content()).thenReturn(first, subsequent);
        return client;
    }

    private String approvedInspection() {
        return "{\"approved\":true,\"score\":95,\"issues\":[],\"revisionInstructions\":\"\"}";
    }
}

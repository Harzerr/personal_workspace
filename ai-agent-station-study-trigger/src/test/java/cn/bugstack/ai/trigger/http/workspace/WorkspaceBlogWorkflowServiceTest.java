package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class WorkspaceBlogWorkflowServiceTest {

    @TempDir
    Path storageDirectory;

    @Test
    void revisesFailedDraftThenPublishesAfterInspectorApproval() {
        WorkspaceBlogPublisher publisher = publisher();
        WorkspaceKnowledgeService knowledge = mock(WorkspaceKnowledgeService.class);
        when(knowledge.hybridSearch("demo", "Agent workflow", 8)).thenReturn(List.of());
        WorkspaceBlogWriter writer = new WorkspaceBlogWriter() {
            @Override
            public String write(WriteRequest request) {
                return "# Agent workflow\n\nTODO";
            }

            @Override
            public String revise(RevisionRequest request) {
                return "# Agent workflow\n\nA complete and checked article.";
            }
        };
        AtomicInteger inspections = new AtomicInteger();
        WorkspaceBlogInspector inspector = request -> inspections.getAndIncrement() == 0
                ? new WorkspaceBlogInspector.Inspection(false, 55, List.of("Contains a placeholder"), "Remove TODO")
                : new WorkspaceBlogInspector.Inspection(true, 92, List.of(), "");
        WorkspaceBlogWorkflowService workflow = workflow(knowledge, writer, inspector, List.of(publisher));

        WorkspaceBlogWorkflowService.WorkflowResult result = workflow.run("demo", request(2));

        assertEquals(WorkspaceBlogWorkflowService.WorkflowStatus.COMPLETED, result.workflow().status());
        assertEquals(2, result.workflow().reviews().size());
        assertEquals(WorkspaceBlogService.BlogStatus.PUBLISHED, result.post().status());
        assertTrue(result.post().content().contains("complete and checked"));
        assertTrue(Files.isRegularFile(storageDirectory.resolve("demo").resolve("workflows")
                .resolve(result.workflow().runId() + ".json")));
        verify(publisher).publish(any());
    }

    @Test
    void keepsDraftAndBlocksPublishingWhenInspectorStillRejectsIt() {
        WorkspaceBlogPublisher publisher = publisher();
        WorkspaceKnowledgeService knowledge = mock(WorkspaceKnowledgeService.class);
        when(knowledge.hybridSearch("demo", "Agent workflow", 8)).thenReturn(List.of());
        WorkspaceBlogWriter writer = request -> "# Agent workflow\n\nUnverified claim.";
        WorkspaceBlogInspector inspector = request -> new WorkspaceBlogInspector.Inspection(
                false, 40, List.of("Unsupported claim"), "Add evidence");
        WorkspaceBlogWorkflowService workflow = workflow(knowledge, writer, inspector, List.of(publisher));

        WorkspaceBlogWorkflowService.WorkflowResult result = workflow.run("demo", request(1));

        assertEquals(WorkspaceBlogWorkflowService.WorkflowStatus.REJECTED, result.workflow().status());
        assertEquals(2, result.workflow().reviews().size());
        assertEquals(WorkspaceBlogService.BlogStatus.DRAFT, result.post().status());
        verify(publisher, never()).publish(any());
    }

    private WorkspaceBlogWorkflowService workflow(WorkspaceKnowledgeService knowledge,
                                                   WorkspaceBlogWriter writer,
                                                   WorkspaceBlogInspector inspector,
                                                   List<WorkspaceBlogPublisher> publishers) {
        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
        WorkspaceBlogService blogService = new WorkspaceBlogService(knowledge, writer, publishers, objectMapper,
                storageDirectory.toString());
        return new WorkspaceBlogWorkflowService(blogService, writer, inspector, objectMapper,
                storageDirectory.toString());
    }

    private WorkspaceBlogPublisher publisher() {
        WorkspaceBlogPublisher publisher = mock(WorkspaceBlogPublisher.class);
        when(publisher.target()).thenReturn("CSDN");
        when(publisher.isConfigured()).thenReturn(true);
        when(publisher.publish(any())).thenReturn(new WorkspaceBlogPublisher.Publication(
                "CSDN", "DRAFT", "123", "https://example.invalid/123", Instant.now()));
        return publisher;
    }

    private WorkspaceBlogWorkflowService.RunRequest request(int maxRevisions) {
        return new WorkspaceBlogWorkflowService.RunRequest("Agent workflow", "Java developers", "Technical",
                800, "Agent workflow", List.of("Agent"), "CSDN", "AI", "DRAFT", maxRevisions);
    }
}

package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

class AiWorkspaceBlogInspectorTest {

    @Test
    void rejectsNewsArticleWhenExactSourceMetadataIsMissingBeforeCallingTheModel() {
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        AiWorkspaceBlogInspector inspector = new AiWorkspaceBlogInspector(resolver, new ObjectMapper(), 80);
        WorkspaceBlogService.SourceReference source = WorkspaceBlogService.SourceReference.external(
                "Original story", "https://example.com/original", Instant.parse("2026-08-17T02:30:00Z"),
                "Verified summary");

        WorkspaceBlogInspector.Inspection result = inspector.inspect(new WorkspaceBlogInspector.InspectionRequest(
                "AI daily", "# AI daily\n\nA rewritten link and no timestamp.", List.of(source),
                "Developers", "Objective"));

        assertFalse(result.approved());
        assertTrue(result.issues().stream().anyMatch(issue -> issue.contains("original URL")));
        assertTrue(result.issues().stream().anyMatch(issue -> issue.contains("publication timestamp")));
        verifyNoInteractions(resolver);
    }
}

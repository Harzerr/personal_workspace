package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class WorkspaceBlogServiceTest {

    @TempDir
    Path storageDirectory;

    @Test
    void generatesPersistsAndPublishesAnEvidenceBackedDraft() throws Exception {
        WorkspaceKnowledgeService knowledgeService = mock(WorkspaceKnowledgeService.class);
        when(knowledgeService.hybridSearch("demo", "RRF retrieval", 8)).thenReturn(List.of(
                new WorkspaceKnowledgeService.SearchResult("1", "SearchService.java", "java", "method", 10, 20,
                        "RRF combines lexical and semantic rankings.", 0.03, "rrf", 1, 2)));
        WorkspaceBlogWriter writer = request -> "# RRF Retrieval\n\nThe service combines two rankings.[1]";
        WorkspaceBlogService service = service(knowledgeService, writer);

        WorkspaceBlogService.BlogPost draft = service.generate("demo",
                new WorkspaceBlogService.GenerateRequest("RRF retrieval", null, null, 900,
                        "RRF retrieval", List.of("RAG", "search")));

        assertEquals(WorkspaceBlogService.BlogStatus.DRAFT, draft.status());
        assertEquals(1, draft.sources().size());
        assertEquals(draft.id(), service.list("demo", null).get(0).id());

        WorkspaceBlogService.BlogPost published = service.publish("demo", draft.id());
        assertEquals(WorkspaceBlogService.BlogStatus.PUBLISHED, published.status());
        Path artifact = storageDirectory.resolve("demo").resolve(published.publishArtifact());
        assertTrue(Files.readString(artifact).contains("The service combines two rankings.[1]"));
        assertTrue(Files.readString(artifact).startsWith("---"));
    }

    @Test
    void createsAndUpdatesAManualDraft() {
        WorkspaceBlogService service = service(mock(WorkspaceKnowledgeService.class), request -> "unused");
        WorkspaceBlogService.BlogPost draft = service.create("demo",
                new WorkspaceBlogService.CreateRequest("First post", null, "Initial body", List.of("Java")));

        WorkspaceBlogService.BlogPost updated = service.update("demo", draft.id(),
                new WorkspaceBlogService.UpdateRequest("Updated post", "Summary", "Updated body", List.of("Java")));

        assertEquals("Updated post", updated.title());
        assertEquals("Updated body", service.get("demo", draft.id()).content());
    }

    @Test
    void preservesExternalNewsEvidenceWithoutSearchingTheWorkspace() {
        WorkspaceKnowledgeService knowledgeService = mock(WorkspaceKnowledgeService.class);
        AtomicReference<WorkspaceBlogWriter.WriteRequest> captured = new AtomicReference<>();
        WorkspaceBlogWriter writer = request -> {
            captured.set(request);
            return "# AI news\n\nhttps://example.com/news\n\n2026-08-17T02:30:00Z";
        };
        WorkspaceBlogService service = service(knowledgeService, writer);
        Instant publishedAt = Instant.parse("2026-08-17T02:30:00Z");
        WorkspaceBlogService.SourceReference source = WorkspaceBlogService.SourceReference.external(
                "Original story", "https://example.com/news", publishedAt, "Verified summary");

        WorkspaceBlogService.BlogPost post = service.generate("demo",
                new WorkspaceBlogService.GenerateRequest("AI daily", null, null, 900, "ignored",
                        List.of("AI"), List.of(source)));

        verify(knowledgeService, never()).hybridSearch(org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyInt());
        assertEquals("https://example.com/news", post.sources().get(0).sourceUrl());
        assertEquals(publishedAt, post.sources().get(0).publishedAt());
        assertTrue(captured.get().evidence().contains("Original URL: https://example.com/news"));
        assertTrue(captured.get().evidence().contains("Published at: 2026-08-17T02:30:00Z"));
    }

    @Test
    void preventsPublishedPostsFromBeingMutated() {
        WorkspaceBlogService service = service(mock(WorkspaceKnowledgeService.class), request -> "unused");
        WorkspaceBlogService.BlogPost draft = service.create("demo",
                new WorkspaceBlogService.CreateRequest("Stable post", null, "Body", List.of()));
        service.publish("demo", draft.id());

        assertThrows(IllegalStateException.class, () -> service.update("demo", draft.id(),
                new WorkspaceBlogService.UpdateRequest("Changed", null, "Changed body", List.of())));
        assertThrows(IllegalStateException.class, () -> service.deleteDraft("demo", draft.id()));
    }

    @Test
    void publishesToCsdnAsADraftAndKeepsALocalArchive() throws Exception {
        WorkspaceBlogPublisher publisher = mock(WorkspaceBlogPublisher.class);
        when(publisher.target()).thenReturn("CSDN");
        when(publisher.isConfigured()).thenReturn(true);
        when(publisher.publish(org.mockito.ArgumentMatchers.any())).thenReturn(
                new WorkspaceBlogPublisher.Publication("CSDN", "DRAFT", "123",
                        "https://blog.csdn.net/demo/article/details/123", java.time.Instant.now()));
        WorkspaceBlogService service = service(mock(WorkspaceKnowledgeService.class), request -> "unused", List.of(publisher));
        WorkspaceBlogService.BlogPost draft = service.create("demo",
                new WorkspaceBlogService.CreateRequest("CSDN post", "Summary", "# Body", List.of("AI")));

        WorkspaceBlogService.BlogPost published = service.publish("demo", draft.id(),
                new WorkspaceBlogService.PublishRequest("CSDN", "人工智能"));

        assertEquals("CSDN", published.publication().target());
        assertEquals("DRAFT", published.publication().mode());
        assertTrue(Files.isRegularFile(storageDirectory.resolve("demo").resolve(published.publishArtifact())));
        verify(publisher).publish(org.mockito.ArgumentMatchers.any());
    }

    private WorkspaceBlogService service(WorkspaceKnowledgeService knowledgeService, WorkspaceBlogWriter writer) {
        return service(knowledgeService, writer, List.of());
    }

    private WorkspaceBlogService service(WorkspaceKnowledgeService knowledgeService, WorkspaceBlogWriter writer,
                                         List<WorkspaceBlogPublisher> publishers) {
        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
        return new WorkspaceBlogService(knowledgeService, writer, publishers, objectMapper, storageDirectory.toString());
    }
}

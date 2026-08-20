package cn.bugstack.ai.trigger.http.workspace;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class WorkspaceKnowledgeChatServiceTest {

    @Test
    void keepsFirstQuestionUnchangedAndStoresItAfterRetrieval() {
        WorkspaceKnowledgeService knowledge = mock(WorkspaceKnowledgeService.class);
        WorkspaceMemoryService memory = mock(WorkspaceMemoryService.class);
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        when(memory.load("kb-1", "chat-1")).thenReturn(emptyMemory());
        when(knowledge.hybridSearch("kb-1", "Where is retry configured?", 8)).thenReturn(List.of(reference()));

        WorkspaceKnowledgeChatService.ChatPreparation result =
                new WorkspaceKnowledgeChatService(knowledge, memory, resolver)
                        .prepare("kb-1", "71908750", "chat-1", "Where is retry configured?", 8);

        assertEquals("Where is retry configured?", result.rewrittenQuery());
        assertEquals(1, result.references().size());
        assertTrue(result.agentMessage().contains("[1] RetryConfig.java:10-24"));
        verify(memory).remember("kb-1", "chat-1", "user", "Where is retry configured?");
        verify(resolver, never()).resolveClientForAgent(anyString(), anyString());
    }

    @Test
    void rewritesFollowUpWithConfiguredAnalyzerAndIncludesMemory() {
        WorkspaceKnowledgeService knowledge = mock(WorkspaceKnowledgeService.class);
        WorkspaceMemoryService memory = mock(WorkspaceMemoryService.class);
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        ChatClient chat = mock(ChatClient.class, RETURNS_DEEP_STUBS);
        WorkspaceMemoryService.SessionMemory existing = new WorkspaceMemoryService.SessionMemory(
                "kb-1", "chat-1", true, "The previous topic was retry policy.",
                List.of(new WorkspaceMemoryService.MemoryMessage("user", "Where is retry configured?"),
                        new WorkspaceMemoryService.MemoryMessage("assistant", "It is in RetryConfig.")),
                List.of("Production retries are capped at three."));
        when(memory.load("kb-1", "chat-1")).thenReturn(existing);
        when(resolver.resolveClientForAgent("71908750", "TASK_ANALYZER_CLIENT"))
                .thenReturn(new WorkspaceAgentClientResolver.ResolvedClient(chat, "", "TASK_ANALYZER_CLIENT", "71908751"));
        when(chat.prompt().system(anyString()).user(anyString()).call().content())
                .thenReturn("RetryConfig production retry delay configuration");
        when(knowledge.hybridSearch("kb-1", "RetryConfig production retry delay configuration", 8))
                .thenReturn(List.of(reference()));

        WorkspaceKnowledgeChatService.ChatPreparation result =
                new WorkspaceKnowledgeChatService(knowledge, memory, resolver)
                        .prepare("kb-1", "71908750", "chat-1", "What about its delay?", 8);

        assertEquals("RetryConfig production retry delay configuration", result.rewrittenQuery());
        assertEquals(2, result.recentMessageCount());
        assertEquals(1, result.longTermFactCount());
        assertTrue(result.hasSummary());
        assertTrue(result.agentMessage().contains("Production retries are capped at three."));
    }

    @Test
    void fallsBackToPreviousQuestionWhenRewriteModelFails() {
        WorkspaceKnowledgeService knowledge = mock(WorkspaceKnowledgeService.class);
        WorkspaceMemoryService memory = mock(WorkspaceMemoryService.class);
        WorkspaceAgentClientResolver resolver = mock(WorkspaceAgentClientResolver.class);
        WorkspaceMemoryService.SessionMemory existing = new WorkspaceMemoryService.SessionMemory(
                "kb-1", "chat-1", true, "",
                List.of(new WorkspaceMemoryService.MemoryMessage("user", "Explain the payment callback")), List.of());
        when(memory.load("kb-1", "chat-1")).thenReturn(existing);
        when(resolver.resolveClientForAgent("71908750", "TASK_ANALYZER_CLIENT"))
                .thenThrow(new IllegalStateException("model unavailable"));
        when(knowledge.hybridSearch("kb-1", "Explain the payment callback Does it retry?", 8))
                .thenReturn(List.of());

        WorkspaceKnowledgeChatService.ChatPreparation result =
                new WorkspaceKnowledgeChatService(knowledge, memory, resolver)
                        .prepare("kb-1", "71908750", "chat-1", "Does it retry?", null);

        assertEquals("Explain the payment callback Does it retry?", result.rewrittenQuery());
        assertTrue(result.references().isEmpty());
    }

    private WorkspaceMemoryService.SessionMemory emptyMemory() {
        return new WorkspaceMemoryService.SessionMemory("kb-1", "chat-1", true, "", List.of(), List.of());
    }

    private WorkspaceKnowledgeService.SearchResult reference() {
        return new WorkspaceKnowledgeService.SearchResult("chunk-1", "RetryConfig.java", "java", "class",
                10, 24, "class RetryConfig {}", 0.032, "rrf", 1, 2);
    }
}

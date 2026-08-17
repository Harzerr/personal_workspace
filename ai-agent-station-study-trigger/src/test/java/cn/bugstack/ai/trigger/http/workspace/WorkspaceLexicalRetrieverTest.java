package cn.bugstack.ai.trigger.http.workspace;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class WorkspaceLexicalRetrieverTest {

    @Test
    void ranksTheChunkContainingTheExactCodeTermFirst() {
        WorkspaceChunk authentication = chunk("1", "AuthenticationService validates JWT tokens before requests.");
        WorkspaceChunk cache = chunk("2", "Redis stores the current conversation summary.");

        List<WorkspaceLexicalRetriever.ScoredChunk> results = new WorkspaceLexicalRetriever()
                .search("JWT validation", List.of(cache, authentication), 2);

        assertEquals("1", results.get(0).chunk().id());
    }

    private WorkspaceChunk chunk(String id, String content) {
        return new WorkspaceChunk(id, "resume-demo", id + ".java", "java", "test", 1, 1, content, id, LocalDateTime.now());
    }
}

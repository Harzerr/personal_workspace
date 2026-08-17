package cn.bugstack.ai.trigger.http.workspace;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class WorkspaceChunkerTest {

    private final WorkspaceChunker chunker = new WorkspaceChunker();

    @Test
    void chunksJavaByAstMembers() {
        String source = "package demo;\npublic class Sample {\n  private int total;\n  public int add(int value) { return total + value; }\n}";

        List<WorkspaceChunker.ChunkDraft> chunks = chunker.chunk("Sample.java", source);

        assertEquals(2, chunks.size());
        assertTrue(chunks.stream().allMatch(chunk -> chunk.chunkType().startsWith("java-member:Sample")));
        assertTrue(chunks.stream().anyMatch(chunk -> chunk.content().contains("add(int value)")));
    }

    @Test
    void chunksMarkdownByHeading() {
        String source = "# Overview\nIntro\n## Retrieval\nRRF combines rankings.\n# Memory\nSession summary.";

        List<WorkspaceChunker.ChunkDraft> chunks = chunker.chunk("design.md", source);

        assertEquals(3, chunks.size());
        assertTrue(chunks.get(1).chunkType().contains("Overview > Retrieval"));
        assertTrue(chunks.get(2).content().contains("Session summary"));
    }
}

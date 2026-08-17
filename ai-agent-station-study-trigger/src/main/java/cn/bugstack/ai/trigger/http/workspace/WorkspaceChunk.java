package cn.bugstack.ai.trigger.http.workspace;

import java.time.LocalDateTime;

public record WorkspaceChunk(
        String id,
        String workspaceId,
        String sourcePath,
        String language,
        String chunkType,
        int startLine,
        int endLine,
        String content,
        String contentHash,
        LocalDateTime createdAt
) {
}

package cn.bugstack.ai.trigger.http.workspace;

@FunctionalInterface
public interface WorkspaceBlogWriter {

    String write(WriteRequest request);

    default String revise(RevisionRequest request) {
        return write(new WriteRequest(request.topic(), request.audience(), request.tone(),
                request.targetLength(), request.evidence() + "\n\nExisting draft:\n" + request.currentContent()
                        + "\n\nInspector feedback:\n" + request.feedback()));
    }

    record WriteRequest(String topic, String audience, String tone, int targetLength, String evidence) {
    }

    record RevisionRequest(String topic, String audience, String tone, int targetLength, String evidence,
                           String currentContent, String feedback) {
    }
}

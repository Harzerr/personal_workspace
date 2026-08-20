package cn.bugstack.ai.trigger.http.workspace;

import java.time.Instant;
import java.util.List;

public interface WorkspaceBlogPublisher {

    String target();

    boolean isConfigured();

    Publication publish(PublishRequest request);

    record PublishRequest(String title, String summary, String markdown, List<String> tags, String category,
                          String mode) {
    }

    record Publication(String target, String mode, String externalId, String externalUrl, Instant publishedAt) {
    }
}

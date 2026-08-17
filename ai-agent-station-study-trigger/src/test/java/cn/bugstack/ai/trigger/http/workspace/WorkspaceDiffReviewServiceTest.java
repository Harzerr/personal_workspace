package cn.bugstack.ai.trigger.http.workspace;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class WorkspaceDiffReviewServiceTest {

    private final WorkspaceDiffReviewService service = new WorkspaceDiffReviewService();

    @Test
    void blocksACommittedSecret() {
        var result = service.review(null, "+++ b/src/main/java/App.java\n+String apiKey = \"abcdefghijklmnop\";");

        assertTrue(result.blockCommit());
        assertTrue(result.findings().stream().anyMatch(finding -> "secret-assignment".equals(finding.rule())));
    }

    @Test
    void allowsARegularChange() {
        var result = service.review(null, "+++ b/src/main/java/App.java\n+return service.findById(id);");

        assertFalse(result.blockCommit());
    }
}

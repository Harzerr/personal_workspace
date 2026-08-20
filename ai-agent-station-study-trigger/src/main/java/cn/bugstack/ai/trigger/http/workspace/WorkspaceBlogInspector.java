package cn.bugstack.ai.trigger.http.workspace;

import java.util.List;

public interface WorkspaceBlogInspector {

    Inspection inspect(InspectionRequest request);

    record InspectionRequest(String title, String content, List<WorkspaceBlogService.SourceReference> sources,
                             String audience, String tone) {
    }

    record Inspection(boolean approved, int score, List<String> issues, String revisionInstructions) {
        public Inspection {
            score = Math.max(0, Math.min(100, score));
            issues = issues == null ? List.of() : List.copyOf(issues);
            revisionInstructions = revisionInstructions == null ? "" : revisionInstructions.trim();
        }
    }
}

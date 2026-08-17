package cn.bugstack.ai.trigger.http.workspace;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class WorkspaceDiffReviewService {

    private static final int MAX_DIFF_SIZE = 512 * 1024;
    private static final Pattern SECRET_ASSIGNMENT = Pattern.compile("(?i)(api[_-]?key|access[_-]?token|secret|password)\\s*[=:]\\s*[\\\"']?[A-Za-z0-9_./+=-]{12,}");
    private static final Pattern DANGEROUS_PROCESS = Pattern.compile("Runtime\\.getRuntime\\(\\)\\.exec|ProcessBuilder\\s*\\(");
    private static final Pattern DISABLED_TEST = Pattern.compile("@Disabled|skipTests\\s*</|maven\\.test\\.skip");
    private static final Pattern WRITE_WITHOUT_WHERE = Pattern.compile("(?i)^(UPDATE|DELETE\\s+FROM)\\s+.+(?!\\bWHERE\\b)");
    private static final Pattern EMPTY_CATCH = Pattern.compile("catch\\s*\\([^)]*\\)\\s*\\{\\s*\\}");

    public DiffReviewResult review(String diffBase64, String rawDiff) {
        String diff = decodeDiff(diffBase64, rawDiff);
        if (diff.length() > MAX_DIFF_SIZE) {
            throw new IllegalArgumentException("Staged diff exceeds the 512 KB review limit");
        }

        List<Finding> findings = new ArrayList<>();
        String currentFile = "unknown";
        String[] lines = diff.split("\\R", -1);
        for (int index = 0; index < lines.length; index++) {
            String line = lines[index];
            if (line.startsWith("+++ b/")) {
                currentFile = line.substring(6);
                continue;
            }
            if (!line.startsWith("+") || line.startsWith("+++")) {
                continue;
            }

            String added = line.substring(1);
            if (SECRET_ASSIGNMENT.matcher(added).find()) {
                findings.add(new Finding("critical", "secret-assignment", currentFile, index + 1,
                        "Possible credential committed in source", excerpt(added)));
            }
            if (DANGEROUS_PROCESS.matcher(added).find()) {
                findings.add(new Finding("high", "process-execution", currentFile, index + 1,
                        "New process execution requires explicit allowlist review", excerpt(added)));
            }
            if (DISABLED_TEST.matcher(added).find()) {
                findings.add(new Finding("medium", "test-disabled", currentFile, index + 1,
                        "A test is disabled or test execution is skipped", excerpt(added)));
            }
            if (WRITE_WITHOUT_WHERE.matcher(added.trim()).find()) {
                findings.add(new Finding("high", "unsafe-sql-write", currentFile, index + 1,
                        "Potential UPDATE or DELETE statement without a WHERE clause", excerpt(added)));
            }
            if (EMPTY_CATCH.matcher(added).find()) {
                findings.add(new Finding("medium", "swallowed-exception", currentFile, index + 1,
                        "Exception is caught and discarded", excerpt(added)));
            }
        }

        boolean blockCommit = findings.stream().anyMatch(finding -> "critical".equals(finding.severity()) || "high".equals(finding.severity()));
        int riskScore = findings.stream().mapToInt(finding -> switch (finding.severity()) {
            case "critical" -> 40;
            case "high" -> 20;
            default -> 8;
        }).sum();
        return new DiffReviewResult(Math.min(riskScore, 100), blockCommit, findings);
    }

    private String decodeDiff(String diffBase64, String rawDiff) {
        if (diffBase64 != null && !diffBase64.isBlank()) {
            try {
                return new String(Base64.getDecoder().decode(diffBase64), StandardCharsets.UTF_8);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("diffBase64 is not valid Base64", e);
            }
        }
        if (rawDiff == null || rawDiff.isBlank()) {
            throw new IllegalArgumentException("A staged diff is required");
        }
        return rawDiff;
    }

    private String excerpt(String value) {
        return value.length() <= 180 ? value : value.substring(0, 177) + "...";
    }

    public record DiffReviewResult(int riskScore, boolean blockCommit, List<Finding> findings) {
    }

    public record Finding(String severity, String rule, String file, int diffLine, String message, String excerpt) {
    }
}

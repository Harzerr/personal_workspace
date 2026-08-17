package cn.bugstack.ai.trigger.http.workspace;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class WorkspaceMemoryService {

    private static final Logger log = LoggerFactory.getLogger(WorkspaceMemoryService.class);
    private static final Pattern ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final int SHORT_TERM_WINDOW = 12;
    private static final int MAX_MESSAGE_LENGTH = 4_000;
    private static final int MAX_FACT_LENGTH = 500;
    private static final int MAX_SUMMARY_LENGTH = 6_000;
    private static final Duration TTL = Duration.ofDays(30);

    private final StringRedisTemplate redisTemplate;

    public WorkspaceMemoryService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public SessionMemory load(String workspaceId, String sessionId) {
        validateIds(workspaceId, sessionId);
        try {
            return read(workspaceId, sessionId, true);
        } catch (DataAccessException e) {
            return unavailable(workspaceId, sessionId, e);
        }
    }

    public SessionMemory remember(String workspaceId, String sessionId, String role, String content) {
        validateIds(workspaceId, sessionId);
        String normalizedRole = normalizeRole(role);
        String normalizedContent = normalizeContent(content, MAX_MESSAGE_LENGTH, "Message");
        try {
            String messageKey = messageKey(workspaceId, sessionId);
            redisTemplate.opsForList().rightPush(messageKey, encode(normalizedRole, normalizedContent));
            Long size = redisTemplate.opsForList().size(messageKey);
            if (size != null && size > SHORT_TERM_WINDOW) {
                int archivedCount = Math.toIntExact(size - SHORT_TERM_WINDOW);
                List<String> archived = redisTemplate.opsForList().range(messageKey, 0, archivedCount - 1);
                appendSummary(workspaceId, sessionId, decodeAll(archived));
                redisTemplate.opsForList().trim(messageKey, archivedCount, -1);
            }
            refreshTtl(workspaceId, sessionId);
            return read(workspaceId, sessionId, true);
        } catch (DataAccessException e) {
            return unavailable(workspaceId, sessionId, e);
        }
    }

    public SessionMemory addFacts(String workspaceId, String sessionId, List<String> facts) {
        validateIds(workspaceId, sessionId);
        if (facts == null || facts.isEmpty()) {
            throw new IllegalArgumentException("At least one long-term fact is required");
        }
        try {
            List<String> accepted = facts.stream()
                    .filter(StringUtils::hasText)
                    .map(fact -> normalizeContent(fact, MAX_FACT_LENGTH, "Fact"))
                    .distinct()
                    .limit(20)
                    .toList();
            if (accepted.isEmpty()) {
                throw new IllegalArgumentException("At least one long-term fact is required");
            }
            redisTemplate.opsForSet().add(factKey(workspaceId, sessionId), accepted.toArray(String[]::new));
            refreshTtl(workspaceId, sessionId);
            return read(workspaceId, sessionId, true);
        } catch (DataAccessException e) {
            return unavailable(workspaceId, sessionId, e);
        }
    }

    private SessionMemory read(String workspaceId, String sessionId, boolean available) {
        List<MemoryMessage> recent = decodeAll(redisTemplate.opsForList().range(messageKey(workspaceId, sessionId), 0, -1));
        String summary = redisTemplate.opsForValue().get(summaryKey(workspaceId, sessionId));
        List<String> facts = new ArrayList<>(redisTemplate.opsForSet().members(factKey(workspaceId, sessionId)));
        return new SessionMemory(workspaceId, sessionId, available, summary == null ? "" : summary, recent, facts);
    }

    private void appendSummary(String workspaceId, String sessionId, List<MemoryMessage> archived) {
        if (archived.isEmpty()) {
            return;
        }
        String existing = redisTemplate.opsForValue().get(summaryKey(workspaceId, sessionId));
        StringBuilder summary = new StringBuilder(existing == null ? "" : existing);
        for (MemoryMessage message : archived) {
            if (!summary.isEmpty()) {
                summary.append('\n');
            }
            String excerpt = message.content().replaceAll("\\s+", " ").trim();
            summary.append(message.role()).append(": ")
                    .append(excerpt, 0, Math.min(excerpt.length(), 240));
        }
        String compacted = summary.length() > MAX_SUMMARY_LENGTH
                ? summary.substring(summary.length() - MAX_SUMMARY_LENGTH)
                : summary.toString();
        redisTemplate.opsForValue().set(summaryKey(workspaceId, sessionId), compacted);
    }

    private void refreshTtl(String workspaceId, String sessionId) {
        redisTemplate.expire(messageKey(workspaceId, sessionId), TTL);
        redisTemplate.expire(summaryKey(workspaceId, sessionId), TTL);
        redisTemplate.expire(factKey(workspaceId, sessionId), TTL);
    }

    private List<MemoryMessage> decodeAll(List<String> values) {
        if (values == null) {
            return List.of();
        }
        return values.stream().map(this::decode).toList();
    }

    private String encode(String role, String content) {
        return role + "|" + Base64.getUrlEncoder().withoutPadding().encodeToString(content.getBytes(StandardCharsets.UTF_8));
    }

    private MemoryMessage decode(String encoded) {
        int separator = encoded.indexOf('|');
        if (separator <= 0) {
            return new MemoryMessage("unknown", "");
        }
        try {
            String content = new String(Base64.getUrlDecoder().decode(encoded.substring(separator + 1)), StandardCharsets.UTF_8);
            return new MemoryMessage(encoded.substring(0, separator), content);
        } catch (IllegalArgumentException e) {
            return new MemoryMessage("unknown", "");
        }
    }

    private String normalizeRole(String role) {
        if (!StringUtils.hasText(role)) {
            throw new IllegalArgumentException("Message role is required");
        }
        String normalized = role.trim().toLowerCase(Locale.ROOT);
        if (!normalized.equals("user") && !normalized.equals("assistant") && !normalized.equals("system")) {
            throw new IllegalArgumentException("Message role must be user, assistant, or system");
        }
        return normalized;
    }

    private String normalizeContent(String value, int maximumLength, String label) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(label + " content is required");
        }
        String normalized = value.trim();
        if (normalized.length() > maximumLength) {
            throw new IllegalArgumentException(label + " exceeds the " + maximumLength + " character limit");
        }
        return normalized;
    }

    private void validateIds(String workspaceId, String sessionId) {
        if (workspaceId == null || !ID.matcher(workspaceId).matches() || sessionId == null || !ID.matcher(sessionId).matches()) {
            throw new IllegalArgumentException("workspaceId and sessionId may only contain letters, numbers, underscores, and hyphens");
        }
    }

    private String messageKey(String workspaceId, String sessionId) {
        return "personal-ai:workspace:" + workspaceId + ":session:" + sessionId + ":recent";
    }

    private String summaryKey(String workspaceId, String sessionId) {
        return "personal-ai:workspace:" + workspaceId + ":session:" + sessionId + ":summary";
    }

    private String factKey(String workspaceId, String sessionId) {
        return "personal-ai:workspace:" + workspaceId + ":session:" + sessionId + ":facts";
    }

    private SessionMemory unavailable(String workspaceId, String sessionId, DataAccessException e) {
        log.warn("Workspace memory is temporarily unavailable for {}/{}: {}", workspaceId, sessionId, e.getMostSpecificCause().getMessage());
        return new SessionMemory(workspaceId, sessionId, false, "", List.of(), List.of());
    }

    public record MemoryMessage(String role, String content) {
    }

    public record SessionMemory(String workspaceId, String sessionId, boolean available, String summary,
                                List<MemoryMessage> recentMessages, List<String> longTermFacts) {
    }
}

package cn.bugstack.ai.trigger.http.workspace;

import cn.bugstack.ai.domain.agent.model.valobj.AiAgentTaskScheduleVO;
import cn.bugstack.ai.domain.agent.service.ITaskService;
import cn.bugstack.ai.infrastructure.dao.IAiAgentTaskScheduleDao;
import cn.bugstack.ai.infrastructure.dao.po.AiAgentTaskSchedule;
import cn.bugstack.ai.types.job.model.TaskScheduleVO;
import cn.bugstack.ai.types.job.provider.ITaskDataProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class WorkspaceAiNewsAutomationService implements ITaskDataProvider {

    public static final String TASK_TYPE = "AI_NEWS_BLOG";
    private static final String TASK_NAME_PREFIX = "daily-ai-news-blog:";
    private static final Pattern SAFE_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");
    private static final ZoneId SHANGHAI = ZoneId.of("Asia/Shanghai");

    private final ITaskService taskService;
    private final IAiAgentTaskScheduleDao taskScheduleDao;
    private final WorkspaceAiNewsService newsService;
    private final WorkspaceBlogWorkflowService workflowService;
    private final ObjectMapper objectMapper;
    private final Path storageRoot;
    private final String workflowAgentId;
    private final Map<String, Object> workspaceLocks = new ConcurrentHashMap<>();

    public WorkspaceAiNewsAutomationService(ITaskService taskService,
                                            IAiAgentTaskScheduleDao taskScheduleDao,
                                            WorkspaceAiNewsService newsService,
                                            WorkspaceBlogWorkflowService workflowService,
                                            ObjectMapper objectMapper,
                                            @Value("${workspace.blog.storage-dir:./data/blog}") String storageDirectory,
                                            @Value("${workspace.blog.workflow-agent-id:}") String workflowAgentId) {
        this.taskService = taskService;
        this.taskScheduleDao = taskScheduleDao;
        this.newsService = newsService;
        this.workflowService = workflowService;
        this.objectMapper = objectMapper;
        this.storageRoot = Path.of(storageDirectory).toAbsolutePath().normalize();
        this.workflowAgentId = workflowAgentId;
    }

    public AutomationConfig getConfig(String workspaceId) {
        validateWorkspaceId(workspaceId);
        AiAgentTaskSchedule schedule = taskScheduleDao.queryByTaskName(taskName(workspaceId));
        if (schedule == null) {
            return defaults(workspaceId, null);
        }
        AutomationParameters parameters = parseParameters(schedule.getTaskParam());
        return new AutomationConfig(schedule.getId(), workspaceId, schedule.getStatus() == 1,
                timeFromCron(schedule.getCronExpression()), parameters.publishMode(), parameters.eventCount(),
                parameters.lookbackHours(), parameters.maxRetries(), parameters.retryDelayMinutes(),
                parameters.targetLength(), schedule.getCronExpression(), schedule.getAgentId());
    }

    public AutomationConfig configure(String workspaceId, AutomationConfigRequest request) {
        validateWorkspaceId(workspaceId);
        if (request == null) {
            throw new IllegalArgumentException("Automation configuration is required");
        }
        LocalTime time = LocalTime.parse(defaultText(request.time(), "09:00"), DateTimeFormatter.ofPattern("HH:mm"));
        String mode = defaultText(request.publishMode(), "PUBLIC").toUpperCase(Locale.ROOT);
        if (!List.of("PUBLIC", "DRAFT").contains(mode)) {
            throw new IllegalArgumentException("publishMode must be PUBLIC or DRAFT");
        }
        int eventCount = inRange(request.eventCount(), 5, 1, 10, "eventCount");
        int lookbackHours = inRange(request.lookbackHours(), 72, 12, 168, "lookbackHours");
        int maxRetries = inRange(request.maxRetries(), 3, 0, 10, "maxRetries");
        int retryDelayMinutes = inRange(request.retryDelayMinutes(), 30, 1, 1440, "retryDelayMinutes");
        int targetLength = inRange(request.targetLength(), 1800, 800, 4000, "targetLength");
        AutomationParameters parameters = new AutomationParameters(TASK_TYPE, workspaceId, mode, eventCount,
                lookbackHours, maxRetries, retryDelayMinutes, targetLength);
        String cron = "0 %d %d * * ?".formatted(time.getMinute(), time.getHour());

        AiAgentTaskSchedule existing = taskScheduleDao.queryByTaskName(taskName(workspaceId));
        AiAgentTaskSchedule schedule = AiAgentTaskSchedule.builder()
                .id(existing == null ? null : existing.getId())
                .agentId(requiredAgentId())
                .taskName(taskName(workspaceId))
                .description("每天自动汇总5个AI行业热点并发布")
                .cronExpression(cron)
                .taskParam(write(parameters))
                .status(Boolean.FALSE.equals(request.enabled()) ? 0 : 1)
                .createTime(existing == null ? LocalDateTime.now() : existing.getCreateTime())
                .updateTime(LocalDateTime.now())
                .build();
        if (existing == null) {
            taskScheduleDao.insert(schedule);
        } else {
            taskScheduleDao.updateById(schedule);
        }
        return getConfig(workspaceId);
    }

    public AutomationRun runNow(String workspaceId, String mode) {
        AutomationConfig config = getConfig(workspaceId);
        AutomationParameters parameters = new AutomationParameters(TASK_TYPE, workspaceId,
                defaultText(mode, config.publishMode()).toUpperCase(Locale.ROOT), config.eventCount(),
                config.lookbackHours(), config.maxRetries(), config.retryDelayMinutes(), config.targetLength());
        if (!List.of("PUBLIC", "DRAFT", "LOCAL").contains(parameters.publishMode())) {
            throw new IllegalArgumentException("mode must be PUBLIC, DRAFT, or LOCAL");
        }
        return start(parameters, LocalDate.now(SHANGHAI), true);
    }

    public List<AutomationRun> listRuns(String workspaceId) {
        validateWorkspaceId(workspaceId);
        Path directory = runsDirectory(workspaceId);
        if (!Files.isDirectory(directory)) {
            return List.of();
        }
        try (var files = Files.list(directory)) {
            return files.filter(path -> path.getFileName().toString().endsWith(".json"))
                    .map(this::readRun)
                    .sorted(Comparator.comparing(AutomationRun::createdAt).reversed())
                    .toList();
        } catch (IOException e) {
            throw new IllegalStateException("Unable to list AI news automation runs", e);
        }
    }

    @Override
    public List<TaskScheduleVO> queryAllValidTaskSchedule() {
        List<TaskScheduleVO> result = new ArrayList<>();
        for (AiAgentTaskScheduleVO schedule : taskService.queryAllValidTaskSchedule()) {
            if (!isAutomationTask(schedule.getTaskParam())) {
                continue;
            }
            TaskScheduleVO task = new TaskScheduleVO();
            task.setId(schedule.getId());
            task.setDescription(schedule.getDescription());
            task.setCronExpression(schedule.getCronExpression());
            task.setTaskParam(schedule.getTaskParam());
            task.setTaskLogic((taskId, taskParam) -> executeScheduled(parseParameters(taskParam)));
            result.add(task);
        }
        return result;
    }

    @Override
    public List<Long> queryAllInvalidTaskScheduleIds() {
        return List.of();
    }

    public boolean isAutomationTask(String taskParam) {
        try {
            return TASK_TYPE.equals(objectMapper.readTree(taskParam).path("taskType").asText());
        } catch (Exception e) {
            return false;
        }
    }

    @Scheduled(fixedDelayString = "${workspace.blog.automation.retry-scan-interval:60000}")
    public void retryPendingRuns() {
        if (!Files.isDirectory(storageRoot)) {
            return;
        }
        try (var paths = Files.walk(storageRoot, 5)) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".json"))
                    .filter(path -> path.getParent() != null && "runs".equals(path.getParent().getFileName().toString()))
                    .map(this::readRun)
                    .filter(run -> run.status() == AutomationStatus.RETRY_WAITING)
                    .filter(run -> run.nextAttemptAt() != null && !run.nextAttemptAt().isAfter(Instant.now()))
                    .forEach(this::attempt);
        } catch (Exception ignored) {
            // Individual run failures are persisted by attempt; the next scan will retry unreadable directories.
        }
    }

    private void executeScheduled(AutomationParameters parameters) {
        start(parameters, LocalDate.now(SHANGHAI), false);
    }

    private AutomationRun start(AutomationParameters parameters, LocalDate businessDate, boolean manual) {
        validateWorkspaceId(parameters.workspaceId());
        String runId = manual
                ? businessDate + "-manual-" + UUID.randomUUID().toString().substring(0, 8)
                : businessDate.toString();
        Object lock = workspaceLocks.computeIfAbsent(parameters.workspaceId(), ignored -> new Object());
        synchronized (lock) {
            Path path = runPath(parameters.workspaceId(), runId);
            if (Files.isRegularFile(path)) {
                AutomationRun existing = readRun(path);
                if (existing.status() != AutomationStatus.RETRY_WAITING
                        || existing.nextAttemptAt() == null || existing.nextAttemptAt().isAfter(Instant.now())) {
                    return existing;
                }
                return attempt(existing);
            }
            Instant now = Instant.now();
            AutomationRun created = new AutomationRun(runId, parameters.workspaceId(), businessDate,
                    AutomationStatus.RUNNING, 0, parameters.maxRetries() + 1, null, parameters, List.of(), null,
                    null, null, now, now);
            persist(created);
            return attempt(created);
        }
    }

    private AutomationRun attempt(AutomationRun current) {
        Object lock = workspaceLocks.computeIfAbsent(current.workspaceId(), ignored -> new Object());
        synchronized (lock) {
            int attempt = current.attempt() + 1;
            AutomationRun running = replace(current, AutomationStatus.RUNNING, attempt, null,
                    current.events(), current.workflowRunId(), current.blogId(), null);
            persist(running);
            try {
                List<WorkspaceAiNewsService.NewsEvent> events = running.events();
                if (events.isEmpty()) {
                    events = newsService.collectAndSelect(running.parameters().eventCount(),
                            running.parameters().lookbackHours()).events();
                    running = replace(running, AutomationStatus.RUNNING, attempt, null, events,
                            null, null, null);
                    persist(running);
                }

                List<WorkspaceBlogService.SourceReference> sources = events.stream()
                        .map(event -> WorkspaceBlogService.SourceReference.external(event.title(), event.originalUrl(),
                                event.publishedAt(), "Publisher: " + event.publisher() + "\n" + event.summary()))
                        .toList();
                String topic = "AI行业日报｜" + running.businessDate() + "：5个热点事件";
                WorkspaceBlogWorkflowService.WorkflowResult result = workflowService.run(running.workspaceId(),
                        new WorkspaceBlogWorkflowService.RunRequest(topic, "AI从业者与软件开发者", "客观、简洁、技术导向",
                                running.parameters().targetLength(), "", List.of("AI", "行业动态", "技术趋势"),
                                "LOCAL".equals(running.parameters().publishMode()) ? "LOCAL" : "CSDN", "人工智能",
                                running.parameters().publishMode(), 2, sources));
                AutomationRun completed = replace(running, AutomationStatus.COMPLETED, attempt, null, events,
                        result.workflow().runId(), result.post().id(), null);
                persist(completed);
                return completed;
            } catch (RuntimeException e) {
                boolean exhausted = attempt >= running.maxAttempts();
                Instant nextAttempt = exhausted ? null
                        : Instant.now().plus(Duration.ofMinutes(running.parameters().retryDelayMinutes()));
                AutomationRun failed = replace(running,
                        exhausted ? AutomationStatus.FAILED : AutomationStatus.RETRY_WAITING,
                        attempt, nextAttempt, running.events(), running.workflowRunId(), running.blogId(),
                        concise(e.getMessage(), 600));
                persist(failed);
                return failed;
            }
        }
    }

    private AutomationRun replace(AutomationRun run, AutomationStatus status, int attempt, Instant nextAttemptAt,
                                  List<WorkspaceAiNewsService.NewsEvent> events, String workflowRunId, String blogId,
                                  String error) {
        return new AutomationRun(run.runId(), run.workspaceId(), run.businessDate(), status, attempt,
                run.maxAttempts(), nextAttemptAt, run.parameters(), List.copyOf(events), workflowRunId, blogId,
                error, run.createdAt(), Instant.now());
    }

    private AutomationParameters parseParameters(String json) {
        try {
            AutomationParameters parameters = objectMapper.readValue(json, AutomationParameters.class);
            if (!TASK_TYPE.equals(parameters.taskType())) {
                throw new IllegalArgumentException("Unsupported scheduled task type");
            }
            return parameters;
        } catch (Exception e) {
            throw new IllegalStateException("Invalid AI news automation task parameters", e);
        }
    }

    private AutomationConfig defaults(String workspaceId, Long taskId) {
        return new AutomationConfig(taskId, workspaceId, false, "09:00", "PUBLIC", 5, 72, 3, 30,
                1800, "0 0 9 * * ?", requiredAgentId());
    }

    private String requiredAgentId() {
        if (!StringUtils.hasText(workflowAgentId)) {
            throw new IllegalStateException("workspace.blog.workflow-agent-id is required for AI news automation");
        }
        return workflowAgentId.trim();
    }

    private String taskName(String workspaceId) {
        return TASK_NAME_PREFIX + workspaceId;
    }

    private String timeFromCron(String cron) {
        if (!StringUtils.hasText(cron)) {
            return "09:00";
        }
        String[] parts = cron.trim().split("\\s+");
        if (parts.length < 3) {
            return "09:00";
        }
        return "%02d:%02d".formatted(Integer.parseInt(parts[2]), Integer.parseInt(parts[1]));
    }

    private int inRange(Integer value, int defaultValue, int minimum, int maximum, String field) {
        int actual = value == null ? defaultValue : value;
        if (actual < minimum || actual > maximum) {
            throw new IllegalArgumentException(field + " must be between " + minimum + " and " + maximum);
        }
        return actual;
    }

    private String defaultText(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim() : fallback;
    }

    private String write(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to encode automation configuration", e);
        }
    }

    private Path runsDirectory(String workspaceId) {
        validateWorkspaceId(workspaceId);
        return storageRoot.resolve(workspaceId).resolve("automation").resolve("runs").normalize();
    }

    private Path runPath(String workspaceId, String runId) {
        if (!runId.matches("[A-Za-z0-9_-]{1,64}")) {
            throw new IllegalArgumentException("Invalid automation run ID");
        }
        Path directory = runsDirectory(workspaceId);
        Path path = directory.resolve(runId + ".json").normalize();
        if (!path.startsWith(directory)) {
            throw new IllegalArgumentException("Invalid automation run path");
        }
        return path;
    }

    private void persist(AutomationRun run) {
        Path path = runPath(run.workspaceId(), run.runId());
        try {
            Files.createDirectories(path.getParent());
            Path temporary = Files.createTempFile(path.getParent(), run.runId(), ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(temporary.toFile(), run);
            try {
                Files.move(temporary, path, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException e) {
                Files.move(temporary, path, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Unable to persist AI news automation run", e);
        }
    }

    private AutomationRun readRun(Path path) {
        try {
            return objectMapper.readValue(path.toFile(), AutomationRun.class);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read AI news automation run", e);
        }
    }

    private void validateWorkspaceId(String workspaceId) {
        if (workspaceId == null || !SAFE_ID.matcher(workspaceId).matches()) {
            throw new IllegalArgumentException("Invalid workspaceId");
        }
    }

    private String concise(String value, int maximumLength) {
        if (value == null) {
            return "Unknown automation error";
        }
        String clean = value.replaceAll("\\s+", " ").trim();
        return clean.length() <= maximumLength ? clean : clean.substring(0, maximumLength - 3) + "...";
    }

    public enum AutomationStatus { RUNNING, RETRY_WAITING, COMPLETED, FAILED }

    public record AutomationConfigRequest(Boolean enabled, String time, String publishMode, Integer eventCount,
                                          Integer lookbackHours, Integer maxRetries, Integer retryDelayMinutes,
                                          Integer targetLength) {
    }

    public record AutomationConfig(Long taskId, String workspaceId, boolean enabled, String time,
                                   String publishMode, int eventCount, int lookbackHours, int maxRetries,
                                   int retryDelayMinutes, int targetLength, String cronExpression, String agentId) {
    }

    public record AutomationParameters(String taskType, String workspaceId, String publishMode, int eventCount,
                                       int lookbackHours, int maxRetries, int retryDelayMinutes, int targetLength) {
    }

    public record AutomationRun(String runId, String workspaceId, LocalDate businessDate, AutomationStatus status,
                                int attempt, int maxAttempts, Instant nextAttemptAt,
                                AutomationParameters parameters, List<WorkspaceAiNewsService.NewsEvent> events,
                                String workflowRunId, String blogId, String error, Instant createdAt,
                                Instant updatedAt) {
        public AutomationRun {
            events = events == null ? List.of() : List.copyOf(events);
        }
    }
}

package cn.bugstack.ai.trigger.http.workspace;

import cn.bugstack.ai.api.response.Response;
import cn.bugstack.ai.types.enums.ResponseCode;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/workspace/{workspaceId}/blogs")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {})
public class WorkspaceBlogController {

    private final WorkspaceBlogService blogService;
    private final WorkspaceBlogWorkflowService workflowService;
    private final WorkspaceAiNewsAutomationService automationService;

    public WorkspaceBlogController(WorkspaceBlogService blogService,
                                   WorkspaceBlogWorkflowService workflowService,
                                   WorkspaceAiNewsAutomationService automationService) {
        this.blogService = blogService;
        this.workflowService = workflowService;
        this.automationService = automationService;
    }

    @PostMapping("/generate")
    public Response<WorkspaceBlogService.BlogPost> generate(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceBlogService.GenerateRequest request) {
        return success(blogService.generate(workspaceId, request));
    }

    @PostMapping
    public Response<WorkspaceBlogService.BlogPost> create(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceBlogService.CreateRequest request) {
        return success(blogService.create(workspaceId, request));
    }

    @GetMapping
    public Response<List<WorkspaceBlogService.BlogPost>> list(
            @PathVariable("workspaceId") String workspaceId,
            @RequestParam(value = "status", required = false) WorkspaceBlogService.BlogStatus status) {
        return success(blogService.list(workspaceId, status));
    }

    @GetMapping("/publish-targets")
    public Response<List<WorkspaceBlogService.PublishTarget>> publishTargets() {
        return success(blogService.publishTargets());
    }

    @GetMapping("/automation")
    public Response<WorkspaceAiNewsAutomationService.AutomationConfig> getAutomation(
            @PathVariable("workspaceId") String workspaceId) {
        return success(automationService.getConfig(workspaceId));
    }

    @PutMapping("/automation")
    public Response<WorkspaceAiNewsAutomationService.AutomationConfig> configureAutomation(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceAiNewsAutomationService.AutomationConfigRequest request) {
        return success(automationService.configure(workspaceId, request));
    }

    @PostMapping("/automation/run")
    public Response<WorkspaceAiNewsAutomationService.AutomationRun> runAutomation(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody(required = false) AutomationRunRequest request) {
        return success(automationService.runNow(workspaceId, request == null ? null : request.mode()));
    }

    @GetMapping("/automation/runs")
    public Response<List<WorkspaceAiNewsAutomationService.AutomationRun>> listAutomationRuns(
            @PathVariable("workspaceId") String workspaceId) {
        return success(automationService.listRuns(workspaceId));
    }

    @PostMapping("/workflow/run")
    public Response<WorkspaceBlogWorkflowService.WorkflowResult> runWorkflow(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceBlogWorkflowService.RunRequest request) {
        return success(workflowService.run(workspaceId, request));
    }

    @GetMapping("/workflow")
    public Response<List<WorkspaceBlogWorkflowService.WorkflowRun>> listWorkflowRuns(
            @PathVariable("workspaceId") String workspaceId) {
        return success(workflowService.list(workspaceId));
    }

    @GetMapping("/workflow/{runId}")
    public Response<WorkspaceBlogWorkflowService.WorkflowRun> getWorkflowRun(
            @PathVariable("workspaceId") String workspaceId,
            @PathVariable("runId") String runId) {
        return success(workflowService.get(workspaceId, runId));
    }

    @GetMapping("/{blogId}")
    public Response<WorkspaceBlogService.BlogPost> get(
            @PathVariable("workspaceId") String workspaceId,
            @PathVariable("blogId") String blogId) {
        return success(blogService.get(workspaceId, blogId));
    }

    @PutMapping("/{blogId}")
    public Response<WorkspaceBlogService.BlogPost> update(
            @PathVariable("workspaceId") String workspaceId,
            @PathVariable("blogId") String blogId,
            @RequestBody WorkspaceBlogService.UpdateRequest request) {
        return success(blogService.update(workspaceId, blogId, request));
    }

    @PostMapping("/{blogId}/publish")
    public Response<WorkspaceBlogService.BlogPost> publish(
            @PathVariable("workspaceId") String workspaceId,
            @PathVariable("blogId") String blogId,
            @RequestBody(required = false) WorkspaceBlogService.PublishRequest request) {
        return success(blogService.publish(workspaceId, blogId, request));
    }

    @DeleteMapping("/{blogId}")
    public Response<Map<String, String>> deleteDraft(
            @PathVariable("workspaceId") String workspaceId,
            @PathVariable("blogId") String blogId) {
        blogService.deleteDraft(workspaceId, blogId);
        return success(Map.of("deleted", blogId));
    }

    private <T> Response<T> success(T data) {
        return Response.<T>builder()
                .code(ResponseCode.SUCCESS.getCode())
                .info(ResponseCode.SUCCESS.getInfo())
                .data(data)
                .build();
    }

    public record AutomationRunRequest(String mode) {
    }
}

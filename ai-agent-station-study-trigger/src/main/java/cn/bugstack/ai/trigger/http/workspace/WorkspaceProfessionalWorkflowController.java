package cn.bugstack.ai.trigger.http.workspace;

import cn.bugstack.ai.api.response.Response;
import cn.bugstack.ai.types.enums.ResponseCode;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workspace/{workspaceId}/professional-workflows")
public class WorkspaceProfessionalWorkflowController {

    private final WorkspaceProfessionalWorkflowService workflowService;

    public WorkspaceProfessionalWorkflowController(WorkspaceProfessionalWorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public Response<List<WorkspaceProfessionalWorkflowService.WorkflowDefinition>> definitions(
            @PathVariable("workspaceId") String workspaceId) {
        return success(workflowService.definitions(workspaceId));
    }

    @PostMapping("/run")
    public Response<WorkspaceProfessionalWorkflowService.WorkflowRun> runWorkflow(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceProfessionalWorkflowService.WorkflowExecutionRequest request) {
        return success(workflowService.run(workspaceId, request));
    }

    @PostMapping("/knowledge-organizer/run")
    public Response<WorkspaceProfessionalWorkflowService.WorkflowRun> knowledgeOrganizer(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody(required = false) WorkspaceProfessionalWorkflowService.KnowledgeOrganizerRequest request) {
        return success(workflowService.runKnowledgeOrganizer(workspaceId, request));
    }

    @PostMapping("/research-report/run")
    public Response<WorkspaceProfessionalWorkflowService.WorkflowRun> researchReport(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceProfessionalWorkflowService.ResearchReportRequest request) {
        return success(workflowService.runResearchReport(workspaceId, request));
    }

    @PostMapping("/ops-report/run")
    public Response<WorkspaceProfessionalWorkflowService.WorkflowRun> opsReport(
            @PathVariable("workspaceId") String workspaceId,
            @RequestBody WorkspaceProfessionalWorkflowService.OpsReportRequest request) {
        return success(workflowService.runOpsReport(workspaceId, request));
    }

    @GetMapping("/runs")
    public Response<List<WorkspaceProfessionalWorkflowService.WorkflowRun>> runs(
            @PathVariable("workspaceId") String workspaceId,
            @RequestParam(value = "type", required = false)
            WorkspaceProfessionalWorkflowService.WorkflowType type) {
        return success(workflowService.listRuns(workspaceId, type));
    }

    @GetMapping("/runs/{runId}")
    public Response<WorkspaceProfessionalWorkflowService.WorkflowRun> run(
            @PathVariable("workspaceId") String workspaceId,
            @PathVariable("runId") String runId) {
        return success(workflowService.getRun(workspaceId, runId));
    }

    private <T> Response<T> success(T data) {
        return Response.<T>builder()
                .code(ResponseCode.SUCCESS.getCode())
                .info(ResponseCode.SUCCESS.getInfo())
                .data(data)
                .build();
    }
}

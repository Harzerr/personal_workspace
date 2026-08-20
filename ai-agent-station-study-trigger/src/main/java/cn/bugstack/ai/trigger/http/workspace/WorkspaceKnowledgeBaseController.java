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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workspace/knowledge-bases")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WorkspaceKnowledgeBaseController {

    private final WorkspaceKnowledgeBaseService knowledgeBaseService;

    public WorkspaceKnowledgeBaseController(WorkspaceKnowledgeBaseService knowledgeBaseService) {
        this.knowledgeBaseService = knowledgeBaseService;
    }

    @GetMapping
    public Response<List<WorkspaceKnowledgeBaseService.KnowledgeBase>> list() {
        return success(knowledgeBaseService.list());
    }

    @GetMapping("/agents")
    public Response<List<WorkspaceKnowledgeBaseService.AgentOption>> agents() {
        return success(knowledgeBaseService.availableAgents());
    }

    @PostMapping
    public Response<WorkspaceKnowledgeBaseService.KnowledgeBase> create(
            @RequestBody WorkspaceKnowledgeBaseService.KnowledgeBaseInput input) {
        return success(knowledgeBaseService.create(input));
    }

    @PutMapping("/{knowledgeBaseId}")
    public Response<WorkspaceKnowledgeBaseService.KnowledgeBase> update(
            @PathVariable("knowledgeBaseId") String knowledgeBaseId,
            @RequestBody WorkspaceKnowledgeBaseService.KnowledgeBaseInput input) {
        return success(knowledgeBaseService.update(knowledgeBaseId, input));
    }

    @DeleteMapping("/{knowledgeBaseId}")
    public Response<Boolean> delete(@PathVariable("knowledgeBaseId") String knowledgeBaseId) {
        knowledgeBaseService.delete(knowledgeBaseId);
        return success(true);
    }

    @PostMapping("/{knowledgeBaseId}/bindings/{agentId}")
    public Response<WorkspaceKnowledgeBaseService.KnowledgeBase> bind(
            @PathVariable("knowledgeBaseId") String knowledgeBaseId,
            @PathVariable("agentId") String agentId,
            @RequestBody(required = false) BindingInput input) {
        return success(knowledgeBaseService.bind(knowledgeBaseId, agentId, input == null ? 0 : input.sequence()));
    }

    @DeleteMapping("/{knowledgeBaseId}/bindings/{agentId}")
    public Response<WorkspaceKnowledgeBaseService.KnowledgeBase> unbind(
            @PathVariable("knowledgeBaseId") String knowledgeBaseId,
            @PathVariable("agentId") String agentId) {
        return success(knowledgeBaseService.unbind(knowledgeBaseId, agentId));
    }

    private <T> Response<T> success(T data) {
        return Response.<T>builder().code(ResponseCode.SUCCESS.getCode())
                .info(ResponseCode.SUCCESS.getInfo()).data(data).build();
    }

    public record BindingInput(int sequence) {
    }
}

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
@RequestMapping("/api/v1/workspace")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WorkspaceSkillController {

    private final WorkspaceSkillService skillService;

    public WorkspaceSkillController(WorkspaceSkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/{workspaceId}/skills")
    public Response<List<WorkspaceSkillService.Skill>> list(@PathVariable("workspaceId") String workspaceId) {
        return success(skillService.list(workspaceId));
    }

    @GetMapping("/{workspaceId}/skills/agents")
    public Response<List<WorkspaceSkillService.AgentOption>> agents(@PathVariable("workspaceId") String workspaceId) {
        return success(skillService.availableAgents());
    }

    @PostMapping("/{workspaceId}/skills")
    public Response<WorkspaceSkillService.Skill> create(@PathVariable("workspaceId") String workspaceId,
                                                         @RequestBody WorkspaceSkillService.SkillInput input) {
        return success(skillService.create(workspaceId, input));
    }

    @PutMapping("/{workspaceId}/skills/{skillId}")
    public Response<WorkspaceSkillService.Skill> update(@PathVariable("workspaceId") String workspaceId,
                                                         @PathVariable("skillId") String skillId,
                                                         @RequestBody WorkspaceSkillService.SkillInput input) {
        return success(skillService.update(workspaceId, skillId, input));
    }

    @DeleteMapping("/{workspaceId}/skills/{skillId}")
    public Response<Boolean> delete(@PathVariable("workspaceId") String workspaceId,
                                    @PathVariable("skillId") String skillId) {
        skillService.delete(workspaceId, skillId);
        return success(true);
    }

    @PostMapping("/{workspaceId}/skills/{skillId}/bindings/{agentId}")
    public Response<WorkspaceSkillService.Skill> bind(@PathVariable("workspaceId") String workspaceId,
                                                       @PathVariable("skillId") String skillId,
                                                       @PathVariable("agentId") String agentId,
                                                       @RequestBody(required = false) BindingInput input) {
        return success(skillService.bind(workspaceId, skillId, agentId, input == null ? 0 : input.sequence()));
    }

    @DeleteMapping("/{workspaceId}/skills/{skillId}/bindings/{agentId}")
    public Response<WorkspaceSkillService.Skill> unbind(@PathVariable("workspaceId") String workspaceId,
                                                         @PathVariable("skillId") String skillId,
                                                         @PathVariable("agentId") String agentId) {
        return success(skillService.unbind(workspaceId, skillId, agentId));
    }

    private <T> Response<T> success(T data) {
        return Response.<T>builder().code(ResponseCode.SUCCESS.getCode())
                .info(ResponseCode.SUCCESS.getInfo()).data(data).build();
    }

    public record BindingInput(int sequence) {
    }
}

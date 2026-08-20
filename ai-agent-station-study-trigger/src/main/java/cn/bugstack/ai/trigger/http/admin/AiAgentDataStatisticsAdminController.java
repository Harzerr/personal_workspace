package cn.bugstack.ai.trigger.http.admin;

import cn.bugstack.ai.api.IAiAgentDataStatisticsAdminService;
import cn.bugstack.ai.api.dto.DataStatisticsResponseDTO;
import cn.bugstack.ai.api.response.Response;
import cn.bugstack.ai.infrastructure.dao.*;
import cn.bugstack.ai.trigger.http.workspace.WorkspaceAiNewsAutomationService;
import cn.bugstack.ai.trigger.http.workspace.WorkspaceProfessionalWorkflowService;
import cn.bugstack.ai.types.enums.ResponseCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

/**
 * 数据统计
 *
 * @author xiaofuge
 * 2025/10/4 10:33
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/data/statistics")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AiAgentDataStatisticsAdminController implements IAiAgentDataStatisticsAdminService {

    private static final ZoneId DASHBOARD_ZONE = ZoneId.of("Asia/Shanghai");

    @Resource
    private IAiAgentDao aiAgentDao;
    @Resource
    private IAiAgentDrawConfigDao aiAgentDrawConfigDao;
    @Resource
    private IAiAgentFlowConfigDao aiAgentFlowConfigDao;
    @Resource
    private IAiAgentTaskScheduleDao aiAgentTaskScheduleDao;
    @Resource
    private IAiClientAdvisorDao aiClientAdvisorDao;
    @Resource
    private IAiClientApiDao aiClientApiDao;
    @Resource
    private IAiClientConfigDao aiClientConfigDao;
    @Resource
    private IAiClientDao aiClientDao;
    @Resource
    private IAiClientModelDao aiClientModelDao;
    @Resource
    private IAiClientRagOrderDao aiClientRagOrderDao;
    @Resource
    private IAiClientSystemPromptDao aiClientSystemPromptDao;
    @Resource
    private IAiClientToolMcpDao aiClientToolMcpDao;
    @Resource
    private WorkspaceProfessionalWorkflowService professionalWorkflowService;
    @Resource
    private WorkspaceAiNewsAutomationService aiNewsAutomationService;

    @Override
    @GetMapping("/get-data-statistics")
    public Response<DataStatisticsResponseDTO> getDataStatistics(
            @RequestParam(value = "workspaceId", defaultValue = "personal-workspace") String workspaceId) {
        try {
            log.info("开始获取系统数据统计，workspaceId={}", workspaceId);
            
            long agentCount = aiAgentDao.queryEnabledAgents().size();
            long clientCount = aiClientDao.queryEnabledClients().size();
            long mcpToolCount = aiClientToolMcpDao.queryByStatus(1).size();
            long systemPromptCount = aiClientSystemPromptDao.queryEnabledPrompts().size();
            long ragOrderCount = aiClientRagOrderDao.queryAll().stream()
                    .filter(item -> Integer.valueOf(1).equals(item.getStatus()))
                    .count();
            long advisorCount = aiClientAdvisorDao.queryByStatus(1).size();
            long modelCount = aiClientModelDao.queryEnabledModels().size();
            long clientApiCount = aiClientApiDao.queryEnabledApis().size();
            long workflowConfigCount = aiAgentDrawConfigDao.queryEnabledConfigs().size();
            long scheduledTaskCount = aiAgentTaskScheduleDao.queryEnabledTasks().size();

            List<WorkspaceProfessionalWorkflowService.WorkflowRun> workflowRuns =
                    professionalWorkflowService.listRuns(workspaceId, null);
            List<WorkspaceAiNewsAutomationService.AutomationRun> automationRuns =
                    aiNewsAutomationService.listRuns(workspaceId);
            LocalDate today = LocalDate.now(DASHBOARD_ZONE);
            long todayRequestCount = workflowRuns.stream().map(WorkspaceProfessionalWorkflowService.WorkflowRun::createdAt)
                    .filter(createdAt -> isToday(createdAt, today)).count()
                    + automationRuns.stream().map(WorkspaceAiNewsAutomationService.AutomationRun::createdAt)
                    .filter(createdAt -> isToday(createdAt, today)).count();
            long runningTaskCount = workflowRuns.stream()
                    .filter(run -> run.status() == WorkspaceProfessionalWorkflowService.WorkflowStatus.RUNNING).count()
                    + automationRuns.stream().filter(run ->
                            run.status() == WorkspaceAiNewsAutomationService.AutomationStatus.RUNNING
                                    || run.status() == WorkspaceAiNewsAutomationService.AutomationStatus.RETRY_WAITING).count();
            long completedCount = workflowRuns.stream()
                    .filter(run -> run.status() == WorkspaceProfessionalWorkflowService.WorkflowStatus.COMPLETED).count()
                    + automationRuns.stream()
                    .filter(run -> run.status() == WorkspaceAiNewsAutomationService.AutomationStatus.COMPLETED).count();
            long terminalCount = workflowRuns.stream()
                    .filter(run -> run.status() != WorkspaceProfessionalWorkflowService.WorkflowStatus.RUNNING).count()
                    + automationRuns.stream().filter(run ->
                            run.status() == WorkspaceAiNewsAutomationService.AutomationStatus.COMPLETED
                                    || run.status() == WorkspaceAiNewsAutomationService.AutomationStatus.FAILED).count();
            double successRate = terminalCount == 0 ? 0.0 : completedCount * 100.0 / terminalCount;
            
            // 构建响应数据
            DataStatisticsResponseDTO responseDTO = DataStatisticsResponseDTO.builder()
                    .activeAgentCount(agentCount)
                    .clientCount(clientCount)
                    .mcpToolCount(mcpToolCount)
                    .systemPromptCount(systemPromptCount)
                    .ragOrderCount(ragOrderCount)
                    .advisorCount(advisorCount)
                    .modelCount(modelCount)
                    .clientApiCount(clientApiCount)
                    .workflowConfigCount(workflowConfigCount)
                    .scheduledTaskCount(scheduledTaskCount)
                    .todayRequestCount(todayRequestCount)
                    .successRate(successRate)
                    .runningTaskCount(runningTaskCount)
                    .build();
            
            log.info("系统数据统计获取成功：智能体数量={}, 客户端数量={}, MCP工具数量={}, 系统提示数量={}, 知识库数量={}, 顾问数量={}, 模型数量={}", 
                    agentCount, clientCount, mcpToolCount, systemPromptCount, ragOrderCount, advisorCount, modelCount);
            
            return Response.<DataStatisticsResponseDTO>builder()
                    .code(ResponseCode.SUCCESS.getCode())
                    .info(ResponseCode.SUCCESS.getInfo())
                    .data(responseDTO)
                    .build();
                    
        } catch (Exception e) {
            log.error("获取系统数据统计失败", e);
            return Response.<DataStatisticsResponseDTO>builder()
                    .code(ResponseCode.UN_ERROR.getCode())
                    .info(ResponseCode.UN_ERROR.getInfo())
                    .data(null)
                    .build();
        }
    }

    private boolean isToday(Instant value, LocalDate today) {
        return value != null && value.atZone(DASHBOARD_ZONE).toLocalDate().equals(today);
    }

}

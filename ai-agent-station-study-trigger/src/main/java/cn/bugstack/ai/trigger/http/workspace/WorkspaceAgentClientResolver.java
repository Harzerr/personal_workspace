package cn.bugstack.ai.trigger.http.workspace;

import cn.bugstack.ai.domain.agent.adapter.repository.IAgentRepository;
import cn.bugstack.ai.domain.agent.model.valobj.AiAgentClientFlowConfigVO;
import cn.bugstack.ai.domain.agent.model.valobj.AiClientToolMcpVO;
import cn.bugstack.ai.domain.agent.model.valobj.enums.AiAgentEnumVO;
import cn.bugstack.ai.domain.agent.service.IArmoryService;
import io.modelcontextprotocol.client.McpSyncClient;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class WorkspaceAgentClientResolver {

    private final IAgentRepository repository;
    private final IArmoryService armoryService;
    private final ListableBeanFactory beanFactory;
    private final String workflowAgentId;
    private final String modelBeanName;
    private final String apiId;

    public WorkspaceAgentClientResolver(IAgentRepository repository,
                                        IArmoryService armoryService,
                                        ListableBeanFactory beanFactory,
                                        @Value("${workspace.blog.workflow-agent-id:}") String workflowAgentId,
                                        @Value("${workspace.blog.model-bean:}") String modelBeanName,
                                        @Value("${workspace.blog.api-id:}") String apiId) {
        this.repository = repository;
        this.armoryService = armoryService;
        this.beanFactory = beanFactory;
        this.workflowAgentId = workflowAgentId;
        this.modelBeanName = modelBeanName;
        this.apiId = apiId;
    }

    public ChatClient resolve(String... preferredClientTypes) {
        return resolveClient(preferredClientTypes).chatClient();
    }

    public ResolvedClient resolveClient(String... preferredClientTypes) {
        if (!StringUtils.hasText(workflowAgentId)) {
            return new ResolvedClient(ChatClient.create(resolveModel()), null, null, null);
        }

        return resolveClientForAgent(workflowAgentId.trim(), preferredClientTypes);
    }

    public ResolvedClient resolveClientForAgent(String agentId, String... preferredClientTypes) {
        if (!StringUtils.hasText(agentId)) {
            throw new IllegalArgumentException("agentId is required");
        }

        agentId = agentId.trim();
        Map<String, AiAgentClientFlowConfigVO> flow = repository.queryAiAgentClientFlowConfig(agentId);
        if (flow.isEmpty()) {
            throw new IllegalStateException("Workspace agent has no client flow configuration: " + agentId);
        }

        AiAgentClientFlowConfigVO config = Arrays.stream(preferredClientTypes)
                .map(flow::get)
                .filter(candidate -> candidate != null && StringUtils.hasText(candidate.getClientId()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Workspace agent is missing a required client type: "
                                + String.join(", ", preferredClientTypes)));

        String beanName = AiAgentEnumVO.AI_CLIENT.getBeanName(config.getClientId());
        if (!beanFactory.containsBean(beanName)) {
            armoryService.acceptArmoryAgent(agentId);
        }
        if (!beanFactory.containsBean(beanName)) {
            throw new IllegalStateException("Configured workspace client is not assembled: " + config.getClientId());
        }
        return new ResolvedClient(beanFactory.getBean(beanName, ChatClient.class), config.getStepPrompt(),
                config.getClientType(), config.getClientId());
    }

    public McpSyncClient resolveMcpClientForAgent(String agentId, String... preferredClientTypes) {
        if (!StringUtils.hasText(agentId)) {
            throw new IllegalArgumentException("agentId is required");
        }
        agentId = agentId.trim();
        Map<String, AiAgentClientFlowConfigVO> flow = repository.queryAiAgentClientFlowConfig(agentId);
        AiAgentClientFlowConfigVO config = Arrays.stream(preferredClientTypes)
                .map(flow::get)
                .filter(candidate -> candidate != null && StringUtils.hasText(candidate.getClientId()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Workspace agent is missing an MCP-enabled client type: "
                                + String.join(", ", preferredClientTypes)));
        List<AiClientToolMcpVO> tools = repository.AiClientToolMcpVOByClientIds(List.of(config.getClientId()));
        if (tools.isEmpty()) {
            throw new IllegalStateException("Workspace agent client has no MCP tool configured: " + config.getClientId());
        }
        String beanName = AiAgentEnumVO.AI_CLIENT_TOOL_MCP.getBeanName(tools.get(0).getMcpId());
        if (!beanFactory.containsBean(beanName)) {
            armoryService.acceptArmoryAgent(agentId);
        }
        if (!beanFactory.containsBean(beanName)) {
            throw new IllegalStateException("Configured MCP tool is not assembled: " + tools.get(0).getMcpId());
        }
        return beanFactory.getBean(beanName, McpSyncClient.class);
    }

    private synchronized ChatModel resolveModel() {
        if (StringUtils.hasText(modelBeanName)) {
            if (!beanFactory.containsBean(modelBeanName.trim()) && StringUtils.hasText(apiId)) {
                armoryService.acceptArmoryAgentClientModelApi(apiId.trim());
            }
            if (!beanFactory.containsBean(modelBeanName.trim())) {
                throw new IllegalStateException("Configured workspace blog model bean is not available");
            }
            return beanFactory.getBean(modelBeanName.trim(), ChatModel.class);
        }
        Map<String, ChatModel> models = beanFactory.getBeansOfType(ChatModel.class);
        ChatModel dynamicModel = models.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith("ai_client_model_"))
                .sorted(Map.Entry.<String, ChatModel>comparingByKey(Comparator.reverseOrder()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
        if (dynamicModel != null) {
            return dynamicModel;
        }
        ChatModel workspaceModel = models.get("openAiChatModel");
        if (workspaceModel == null) {
            throw new IllegalStateException("No chat model is configured for the blog workflow");
        }
        return workspaceModel;
    }

    public record ResolvedClient(ChatClient chatClient, String stepPrompt, String clientType, String clientId) {

        public String systemPromptOr(String fallback) {
            return StringUtils.hasText(stepPrompt) ? stepPrompt.trim() : fallback;
        }
    }
}

package cn.bugstack.ai.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * 数据统计响应 DTO
 *
 * @author xiaofuge
 * @description 数据统计响应数据传输对象
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DataStatisticsResponseDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 活跃代理数量
     */
    private Long activeAgentCount;

    /**
     * 客户端数量
     */
    private Long clientCount;

    /**
     * MCP工具数量
     */
    private Long mcpToolCount;

    /**
     * 系统提示词数量
     */
    private Long systemPromptCount;

    /**
     * 知识库数量
     */
    private Long ragOrderCount;

    /**
     * 顾问配置数量
     */
    private Long advisorCount;

    /**
     * 模型配置数量
     */
    private Long modelCount;

    /**
     * 启用的模型 API 数量
     */
    private Long clientApiCount;

    /**
     * 启用的 Agent 流程装配数量
     */
    private Long workflowConfigCount;

    /**
     * 启用的定时任务数量
     */
    private Long scheduledTaskCount;

    /**
     * 当前工作空间今日执行数量
     */
    private Long todayRequestCount;

    /**
     * 当前工作空间已结束执行的成功率
     */
    private Double successRate;

    /**
     * 当前工作空间运行中或等待重试的任务数量
     */
    private Long runningTaskCount;
}

package cn.bugstack.ai.types.job.config;

import cn.bugstack.ai.types.job.TaskJob;
import cn.bugstack.ai.types.job.provider.ITaskDataProvider;
import cn.bugstack.ai.types.job.service.ITaskJobService;
import cn.bugstack.ai.types.job.service.TaskJobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.List;

/**
 * 任务调度器自动配置类
 *
 * @author xiaofuge
 */
@Configuration
@EnableScheduling
@EnableConfigurationProperties(TaskJobAutoProperties.class)
@ConditionalOnProperty(prefix = "workspace.task.job", name = "enabled", havingValue = "true", matchIfMissing = true)
public class TaskJobAutoConfig {

    private final Logger log = LoggerFactory.getLogger(TaskJobAutoConfig.class);

    /**
     * 创建线程池任务调度器实例，用于执行定时任务和异步任务调度
     */
    @Bean("workspaceTaskScheduler")
    public TaskScheduler taskScheduler(TaskJobAutoProperties properties) {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(properties.getPoolSize());
        scheduler.setThreadNamePrefix(properties.getThreadNamePrefix());
        scheduler.setWaitForTasksToCompleteOnShutdown(properties.isWaitForTasksToCompleteOnShutdown());
        scheduler.setAwaitTerminationSeconds(properties.getAwaitTerminationSeconds());
        scheduler.initialize();
        
        log.info("Workspace task scheduler initialized. Pool size: {}, thread prefix: {}",
                properties.getPoolSize(), properties.getThreadNamePrefix());
        
        return scheduler;
    }

    @Bean
    public ITaskJobService taskJobService(TaskScheduler workspaceTaskScheduler, List<ITaskDataProvider> taskDataProviders) {
        // 实例化任务并初始化调度
        TaskJobService taskJobService = new TaskJobService(workspaceTaskScheduler, taskDataProviders);
        taskJobService.initializeTasks();

        return taskJobService;
    }

    /**
     * 自动检测任务
     */
    @Bean
    public TaskJob taskJob(TaskJobAutoProperties properties, ITaskJobService taskJobService) {
        log.info("Workspace task jobs initialized. Refresh interval: {} ms, cleanup cron: {}",
                properties.getRefreshInterval(), properties.getCleanInvalidTasksCron());
        return new TaskJob(properties, taskJobService);
    }

}

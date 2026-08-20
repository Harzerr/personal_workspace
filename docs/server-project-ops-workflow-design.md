# 服务器项目运维报告工作流设计

## 1. 目标

将现有“运维报告”改为“服务器项目运维报告”。用户选择服务器、项目和时间范围后，工作流自动读取只读运行数据，生成项目级健康报告，不再要求手工粘贴 metrics 和 logs。

核心原则：

- 项目、服务、端点和阈值来自项目注册表，不写死在 Java 或前端。
- 数据采集使用结构化只读 MCP 工具，不允许模型生成或执行任意 Shell。
- 健康状态由确定性规则计算，模型负责归纳、解释和成稿。
- 所有结论必须带采集时间、目标、证据编号和数据完整性状态。
- 默认只报告，不自动修复；任何变更操作应作为独立、需确认的后续工作流。

## 2. 用户交互

工作流目录中的名称改为“服务器项目运维报告”，表单由后端定义动态渲染：

| 字段 | 控件 | 说明 |
| --- | --- | --- |
| 服务器 | 单选下拉框 | 仅展示当前 Workspace 有权访问的服务器 |
| 项目范围 | 多选菜单 | 默认全部项目，可选择面面通、Personal AI Workspace 等 |
| 时间范围 | 分段选择 | 最近 15 分钟、1 小时、6 小时、24 小时 |
| 巡检深度 | 分段选择 | 快速巡检、标准巡检、故障诊断 |
| 包含近期日志 | 开关 | 默认开启，仅采集告警及错误摘要 |
| 分析目标 | 文本框 | 可选，例如“重点检查登录入口和模型调用链” |

运行结果页面分为五块：

1. 总体状态：健康、需关注、故障、数据不足。
2. 项目矩阵：每个项目的服务、接口、依赖、资源和日志状态。
3. 服务器资源：CPU、内存、Swap、磁盘、负载和容器概况。
4. 风险与建议：按 P0/P1/P2 排序，区分立即处理和持续观察。
5. 证据抽屉：展示采集时间、检查项、原始状态与脱敏日志摘要。

保留“复制报告”和“导出 .md”，增加“按项目筛选”和“仅看异常”。

## 3. 项目注册表

建议新增 `workspace_ops_target` 和 `workspace_ops_project`，或先使用等价 JSON 配置。注册表只保存定位信息和检查规则，不保存私钥、Token 或密码。

服务器目标字段：

| 字段 | 示例 | 说明 |
| --- | --- | --- |
| targetId | `prod-main` | 稳定标识 |
| workspaceId | `85374287` | 权限边界 |
| displayName | `主生产服务器` | 前端名称 |
| environment | `production` | 环境标签 |
| connectionProfileId | `local-ops-reader` | 引用安全连接配置 |
| enabled | `true` | 是否可选 |

项目字段：

| 字段 | 说明 |
| --- | --- |
| projectId / displayName | 项目标识和名称 |
| targetId | 所属服务器 |
| serviceUnits | 需要检查的 systemd 单元白名单 |
| containerNames | 需要检查的容器白名单 |
| endpoints | HTTP 健康检查及期望状态 |
| dependencies | Redis、Qdrant、外部 API 等依赖检查 |
| logSources | 允许读取的日志源和最大行数 |
| thresholds | 项目级资源、延迟、重启次数阈值 |
| owner / runbookUrl | 负责人和处置手册 |

首批注册数据：

- 面面通：FastAPI 后端、评估 Worker、简历 Worker、搜索/抓取 MCP、Redis、Qdrant、登录页、Judge0、LiveKit。
- Personal AI Workspace：Java 服务、Nginx 路由、pgvector、工作流 API。
- 共享基础设施：Nginx、Docker、主机 CPU/内存/Swap/磁盘、失败的 systemd 单元。

这些内容仅作为初始数据库记录，后续可在“项目资源管理”界面增加或修改。

## 4. 只读运维 MCP

新增“服务器运维只读 MCP”，建议与被监控服务同机部署。MCP 只暴露结构化工具：

| 工具 | 返回内容 |
| --- | --- |
| `list_targets` | 当前 Workspace 可访问的服务器和项目 |
| `collect_host_snapshot` | uptime、load、CPU、内存、Swap、磁盘、inode、失败单元 |
| `collect_project_snapshot` | systemd、容器、版本、重启次数和资源占用 |
| `check_project_endpoints` | HTTP 状态、延迟、TLS 和响应校验 |
| `check_project_dependencies` | 注册表中声明的内部与外部依赖 |
| `read_recent_events` | 指定白名单日志源的错误/告警摘要 |

安全边界：

- 不提供 `exec`、任意命令、任意路径读取或服务重启工具。
- targetId、projectId、unit、container 和 endpoint 必须命中注册表白名单。
- 使用 root 管理的采集包装器输出 JSON；MCP 进程使用低权限账户。
- 不授予 Docker Socket 的直接写权限，不返回环境变量和配置文件内容。
- 日志在采集层完成 Token、Cookie、Authorization、密码和个人信息脱敏。
- 每次工具调用记录 runId、调用者、目标、耗时和结果摘要。

多服务器阶段使用 `connectionProfileId` 引用密钥管理系统，禁止把 SSH 私钥写入数据库或工作流配置。

## 5. 工作流与模型装配

推荐链路：

```text
触发 -> 目标解析 -> 只读 MCP 采集 -> 确定性健康判定
     -> 运维信号分析员 -> 运维报告执行员 -> 运维安全检察员
     -> 确定性质检 -> 报告存储与可视化
```

装配建议：

| 节点 | 职责 | 模型/MCP |
| --- | --- | --- |
| 目标解析与采集器 | 根据注册表调用固定 MCP 工具，生成快照 | 无需 LLM；绑定运维只读 MCP |
| 运维信号分析员 `71908741` | 关联异常、影响和可能原因 | 可配置分析模型，默认 `8001` |
| 运维报告执行员 `71908742` | 生成中文 Markdown 报告 | 可配置写作模型，默认 `8001` |
| 运维安全检察员 `71908743` | 检查证据、风险、回滚和脱敏 | 可配置质检模型，默认 `8001` |
| 确定性质检器 | 检查覆盖率、证据引用、数据新鲜度 | 代码规则，不使用模型 |

采集器不经过模型选择命令。模型装配仍保留在可视化编排中，但只连接分析、写作和质检 Client；运维 MCP 只连接采集器。

建议新增 `WorkspaceOpsSnapshotService`，职责是：

1. 校验 Workspace、targetId 和 projectIds。
2. 读取注册表并构造允许的采集计划。
3. 调用 MCP 并验证返回 JSON Schema。
4. 计算确定性健康状态与证据编号。
5. 将结构化快照交给现有三段 Agent 链。

## 6. 请求与快照契约

运行请求：

```json
{
  "targetId": "prod-main",
  "projectIds": ["chatbot", "personal-ai-workspace"],
  "lookbackMinutes": 60,
  "inspectionMode": "STANDARD",
  "includeLogs": true,
  "question": "重点检查用户入口和核心依赖"
}
```

采集快照必须包含：

- `snapshotId`、`collectedAt`、`targetId`、`durationMs`。
- 主机资源与失败单元。
- 每个项目的服务、容器、端点、依赖和日志摘要。
- 每项检查的 `status`、`observedValue`、`evidenceId` 和 `error`。
- `completeness` 与缺失检查项，防止把“未采集”写成“健康”。

## 7. 健康判定

状态由代码规则决定，阈值来自项目注册表：

- `FAULT`：必要服务停止、必要端点失败、容器 unhealthy、出现 OOM 或磁盘超过故障阈值。
- `ATTENTION`：资源超过预警阈值、发生重启、依赖降级、延迟明显偏离基线。
- `UNKNOWN`：快照过期、检查失败或必要证据缺失。
- `HEALTHY`：所有必要检查成功且数据新鲜，不能仅凭“没有错误日志”判定。

总体状态取项目最严重状态；报告可以给出 0-100 健康分，但状态优先于分数。

确定性质检至少检查：

- 项目覆盖率 100%，或明确列出未覆盖项目。
- 每个故障/预警结论至少引用一条 evidenceId。
- 报告项目名称必须来自注册表。
- 采集时间距报告生成时间不超过配置阈值。
- 报告中不存在敏感信息和未经确认的自动修复结果。

## 8. 报告结构

```text
# 服务器项目运维报告
## 执行摘要
## 服务器资源概况
## 项目健康矩阵
## 异常与影响
## 可能原因与置信度
## 建议动作（P0/P1/P2）
## 验证与回滚要求
## 数据缺口
## 证据与采集信息
```

建议动作只描述安全步骤和验证条件。工作流不得声称已执行重启、清理、部署或数据库操作。

## 9. 实施顺序

### MVP

- 建立项目注册表和首批三类项目配置。
- 实现同机只读运维 MCP 与 `WorkspaceOpsSnapshotService`。
- 将 OPS_REPORT 表单改为服务器、项目、时间范围和巡检深度。
- 接入现有分析、写作、质检 Agent，并增加确定性质检。
- 实现状态矩阵、证据抽屉、复制和 Markdown 导出。

### 第二阶段

- 支持每天/每周定时报告、历史基线和趋势比较。
- 增加失败通知和连续异常合并，避免重复告警。
- 增加目标与项目的可视化配置页面。

### 第三阶段

- 支持多服务器连接配置、Prometheus/Grafana 和 Elasticsearch。
- 将“建议动作”扩展为独立的人工确认修复工作流，保持巡检工作流只读。

## 10. 验收标准

- 不填写 metrics/logs 也能生成真实服务器项目报告。
- 新增项目只需注册配置，无需修改 Java 或前端代码。
- MCP 无法执行任意命令，所有采集目标均经过白名单校验。
- 任一必要数据缺失时状态为 UNKNOWN，而不是 HEALTHY。
- 报告中的每个异常都有证据编号和采集时间。
- 面面通和 Personal AI Workspace 的入口、服务、依赖与资源状态均能单独查看。

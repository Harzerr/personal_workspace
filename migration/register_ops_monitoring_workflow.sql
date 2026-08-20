BEGIN;

INSERT INTO ai_client_tool_mcp
    (mcp_id, mcp_name, transport_type, transport_config, request_timeout, status, create_time, update_time)
VALUES
    ('71908760', '服务器运维只读 MCP', 'sse',
     '{"baseUri":"http://127.0.0.1:7862","sseEndpoint":"/sse"}', 60, 1,
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (mcp_id) DO UPDATE SET
    mcp_name = EXCLUDED.mcp_name,
    transport_type = EXCLUDED.transport_type,
    transport_config = EXCLUDED.transport_config,
    request_timeout = EXCLUDED.request_timeout,
    status = EXCLUDED.status,
    update_time = CURRENT_TIMESTAMP;

INSERT INTO ai_client_model
    (model_id, api_id, model_usage, model_name, model_type, status, create_time, update_time)
SELECT '8004', api_id, '服务器运维快照分析与只读采集', model_name, model_type, 1,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM ai_client_model
WHERE model_id = '8001'
ON CONFLICT (model_id) DO UPDATE SET
    api_id = EXCLUDED.api_id,
    model_usage = EXCLUDED.model_usage,
    model_name = EXCLUDED.model_name,
    model_type = EXCLUDED.model_type,
    status = EXCLUDED.status,
    update_time = CURRENT_TIMESTAMP;

DELETE FROM ai_client_config
WHERE source_type = 'client'
  AND source_id IN ('71908741', '71908742', '71908743')
  AND target_type = 'model';

INSERT INTO ai_client_config (source_type, source_id, target_type, target_id, ext_param, status)
VALUES
    ('client', '71908741', 'model', '8004', '{"configId":"workspace_ops_report_v1"}', 1),
    ('client', '71908742', 'model', '8001', '{"configId":"workspace_ops_report_v1"}', 1),
    ('client', '71908743', 'model', '8001', '{"configId":"workspace_ops_report_v1"}', 1);

DELETE FROM ai_client_config
WHERE source_type = 'model' AND source_id = '8004' AND target_type = 'tool_mcp';

INSERT INTO ai_client_config (source_type, source_id, target_type, target_id, ext_param, status)
VALUES ('model', '8004', 'tool_mcp', '71908760',
        '{"purpose":"read_only_server_project_operations"}', 1);

UPDATE ai_agent
SET agent_name = '服务器项目运维报告 Agent',
    description = '通过注册表和只读 MCP 自动巡检服务器资源、项目服务、接口、依赖与近期异常，生成带证据的运维报告。',
    update_time = CURRENT_TIMESTAMP
WHERE agent_id = '71908740';

UPDATE ai_client
SET client_name = '运维快照分析员',
    description = '分析确定性运维快照，区分事实、影响、可能原因和数据缺口。',
    update_time = CURRENT_TIMESTAMP
WHERE client_id = '71908741';

UPDATE ai_agent_flow_config
SET client_name = '运维快照分析员',
    step_prompt = 'You are an SRE signal analyst. Analyze only the supplied structured read-only snapshot. Preserve the exact collection timestamp, registered target and project names, deterministic statuses, completeness and evidenceId values. Separate observations from hypotheses, rank impact and uncertainty, and never claim that remediation was executed.'
WHERE agent_id = '71908740' AND client_id = '71908741';

UPDATE ai_agent_flow_config
SET step_prompt = 'You are an SRE report writer. Write a Chinese Markdown server-project operations report using only the supplied structured snapshot. Preserve exact collection time, target, registered project names, deterministic statuses and evidenceId values. Include execution summary, host resources, project health matrix, anomalies and impact, possible causes with confidence, P0/P1/P2 recommendations, validation and rollback requirements, data gaps, and evidence. Never claim restart, cleanup, deployment or database changes were executed.'
WHERE agent_id = '71908740' AND client_id = '71908742';

UPDATE ai_agent_flow_config
SET step_prompt = 'You are an independent SRE safety supervisor. Compare the report with the complete read-only snapshot. Reject missing collection time, target or project names, changed deterministic status, missing evidence IDs for abnormalities, invented topology or measurements, hidden missing data, sensitive values, unsafe actions, or any claim that remediation was executed. Return exactly one JSON object: {"approved":true,"score":90,"issues":[],"revisionInstructions":""}.'
WHERE agent_id = '71908740' AND client_id = '71908743';

UPDATE ai_agent_draw_config
SET config_name = '服务器项目运维报告 Agent',
    description = '目标选择、只读 MCP 自动采集、确定性健康判定、分析、报告与独立质检。',
    config_data = jsonb_set(
        jsonb_set(config_data::jsonb, '{nodes}', (
            SELECT jsonb_agg(
                CASE
                    WHEN node->>'id' = 'agent_71908740' THEN
                        jsonb_set(
                            jsonb_set(node, '{data,title}', '"Server_Project_Ops_Report_Agent"'::jsonb),
                            '{data,inputsValues,description}',
                            '[{"key":"","value":{"content":"目标选择、只读 MCP 自动采集、确定性健康判定、分析、报告与独立质检。"}}]'::jsonb)
                    WHEN node->>'id' = 'analyzer_71908740' THEN
                        jsonb_set(
                            jsonb_set(node, '{data,title}', '"Snapshot_Analyzer_Client"'::jsonb),
                            '{data,inputsValues,stepPrompt}',
                            '[{"key":"prompt_a_71908740","value":"You are an SRE signal analyst. Analyze only the supplied structured read-only snapshot. Preserve the exact collection timestamp, registered target and project names, deterministic statuses, completeness and evidenceId values. Separate observations from hypotheses, rank impact and uncertainty, and never claim that remediation was executed."}]'::jsonb)
                    WHEN node->>'id' = 'executor_71908740' THEN
                        jsonb_set(node, '{data,inputsValues,stepPrompt}',
                            '[{"key":"prompt_e_71908740","value":"You are an SRE report writer. Write a Chinese Markdown server-project operations report using only the supplied structured snapshot. Preserve exact collection time, target, registered project names, deterministic statuses and evidenceId values. Never claim remediation was executed."}]'::jsonb)
                    WHEN node->>'id' = 'inspector_71908740' THEN
                        jsonb_set(node, '{data,inputsValues,stepPrompt}',
                            '[{"key":"prompt_i_71908740","value":"You are an independent SRE safety supervisor. Reject missing collection details, changed deterministic status, missing evidence IDs, invented facts, sensitive values, unsafe actions, or executed-remediation claims. Return exactly one JSON object."}]'::jsonb)
                    WHEN node->>'id' = 'model_71908740' THEN
                        jsonb_set(
                            jsonb_set(
                                jsonb_set(node, '{data,title}', '"Ops_Analysis_Model"'::jsonb),
                                '{data,inputsValues,modelName}',
                                '[{"key":"model_71908740","value":"8004"}]'::jsonb),
                            '{meta,position}', '{"x":350,"y":-170}'::jsonb)
                    ELSE node
                END)
            FROM jsonb_array_elements(config_data::jsonb->'nodes') AS node
        )),
        '{metadata}',
        COALESCE(config_data::jsonb->'metadata', '{}'::jsonb) ||
        '{"opsMcp":{"mcpId":"71908760","name":"服务器运维只读 MCP","modelId":"8004","clientId":"71908741","mode":"READ_ONLY"}}'::jsonb
    )::text,
    version = version + 1,
    update_time = CURRENT_TIMESTAMP
WHERE config_id = 'workspace_ops_report_v1';

UPDATE ai_agent_draw_config
SET config_data = jsonb_set(
        config_data::jsonb,
        '{nodes}',
        CASE WHEN EXISTS (
            SELECT 1 FROM jsonb_array_elements(config_data::jsonb->'nodes') AS node
            WHERE node->>'id' = 'tool_mcp_71908760'
        ) THEN config_data::jsonb->'nodes' ELSE (config_data::jsonb->'nodes') ||
            '[{"id":"tool_mcp_71908760","type":"tool_mcp","meta":{"position":{"x":760,"y":-170}},"data":{"title":"Read_Only_Ops_MCP","inputsValues":{"toolMcpName":[{"key":"tool_mcp_select_71908760","value":"71908760"}]},"inputs":{"type":"object","properties":{"toolMcpName":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string"},"value":{"type":"string"}}}}}}}}]'::jsonb
        END)
WHERE config_id = 'workspace_ops_report_v1';

UPDATE ai_agent_draw_config
SET config_data = jsonb_set(
        config_data::jsonb,
        '{nodes}',
        CASE WHEN EXISTS (
            SELECT 1 FROM jsonb_array_elements(config_data::jsonb->'nodes') AS node
            WHERE node->>'id' = 'model_71908740_report'
        ) THEN config_data::jsonb->'nodes' ELSE (config_data::jsonb->'nodes') ||
            '[{"id":"model_71908740_report","type":"model","meta":{"position":{"x":350,"y":300}},"data":{"title":"Ops_Report_Model","inputsValues":{"modelName":[{"key":"model_71908740_report","value":"8001"}]},"inputs":{"type":"object","properties":{"modelName":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string"},"value":{"type":"string"}}}}}}}}]'::jsonb
        END)
WHERE config_id = 'workspace_ops_report_v1';

UPDATE ai_agent_draw_config
SET config_data = jsonb_set(
        config_data::jsonb,
        '{edges}',
        (SELECT COALESCE(jsonb_agg(edge), '[]'::jsonb)
         FROM jsonb_array_elements(config_data::jsonb->'edges') AS edge
         WHERE NOT (
             edge->>'sourceNodeID' IN ('executor_71908740', 'inspector_71908740')
             AND edge->>'targetNodeID' IN ('model_71908740', 'model_71908740_report')
         )) ||
        '[{"sourceNodeID":"executor_71908740","sourcePortID":"client-output","targetNodeID":"model_71908740_report"},{"sourceNodeID":"inspector_71908740","sourcePortID":"client-output","targetNodeID":"model_71908740_report"}]'::jsonb)
WHERE config_id = 'workspace_ops_report_v1';

UPDATE ai_agent_draw_config
SET config_data = jsonb_set(
        config_data::jsonb,
        '{edges}',
        CASE WHEN EXISTS (
            SELECT 1 FROM jsonb_array_elements(config_data::jsonb->'edges') AS edge
            WHERE edge->>'sourceNodeID' = 'model_71908740' AND edge->>'targetNodeID' = 'tool_mcp_71908760'
        ) THEN config_data::jsonb->'edges' ELSE (config_data::jsonb->'edges') ||
            '[{"sourceNodeID":"model_71908740","sourcePortID":"model_71908740","targetNodeID":"tool_mcp_71908760"}]'::jsonb
        END),
    version = version + 1,
    update_time = CURRENT_TIMESTAMP
WHERE config_id = 'workspace_ops_report_v1';

COMMIT;

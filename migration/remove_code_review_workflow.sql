BEGIN;

DELETE FROM ai_agent_task_schedule
WHERE agent_id = '71908710';

DELETE FROM ai_agent_flow_config
WHERE agent_id = '71908710';

DELETE FROM ai_agent_draw_config
WHERE config_id = 'workspace_code_review_v1'
   OR agent_id = '71908710';

DELETE FROM ai_client_config
WHERE (source_type = 'client' AND source_id IN ('71908711', '71908712', '71908713'))
   OR (target_type = 'client' AND target_id IN ('71908711', '71908712', '71908713'))
   OR ext_param LIKE '%workspace_code_review_v1%';

DELETE FROM ai_client
WHERE client_id IN ('71908711', '71908712', '71908713');

DELETE FROM ai_agent
WHERE agent_id = '71908710';

COMMIT;

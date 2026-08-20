#!/usr/bin/env bash
set -euo pipefail

app_jar="/srv/ai-agent-study/ai-agent-station-study-app/target/ai-agent-station-study-app.jar"
frontend_root="/srv/ai-agent-station-front"
ops_deploy_root="/srv/ai-agent-study/deploy"
backup_root="/srv/backups/personal-ai-workspace-ops-$(date -u +%Y%m%dT%H%M%SZ)"
database_container="workspace-pgvector"
database_user="workspace"
database_name="ai-rag-knowledge"
jar_replaced=0

rollback_jar() {
  if [[ "$jar_replaced" == "1" && -f "$backup_root/ai-agent-station-study-app.jar" ]]; then
    cp "$backup_root/ai-agent-station-study-app.jar" "$app_jar"
    sudo systemctl restart personal-ai-workspace.service || true
  fi
}
trap rollback_jar ERR

for staged_file in \
  /tmp/ai-agent-station-study-app.jar \
  /tmp/workflows.html \
  /tmp/workflow-runtime.20260818.js \
  /tmp/workflow-runtime.20260818.css \
  /tmp/workspace_ops_mcp_server.py \
  /tmp/workspace-ops-targets.json \
  /tmp/workspace-ops-mcp.service \
  /tmp/register_ops_monitoring_workflow.sql; do
  test -s "$staged_file"
done

sudo install -d -o ubuntu -g ubuntu -m 0750 "$backup_root"
cp "$app_jar" "$backup_root/ai-agent-station-study-app.jar"
cp "$frontend_root/workflows.html" "$backup_root/workflows.html"
cp "$frontend_root/static/js/workflow-runtime.20260818.js" "$backup_root/workflow-runtime.20260818.js"
cp "$frontend_root/static/css/workflow-runtime.20260818.css" "$backup_root/workflow-runtime.20260818.css"
if sudo test -f /etc/systemd/system/workspace-ops-mcp.service; then
  sudo cp /etc/systemd/system/workspace-ops-mcp.service "$backup_root/workspace-ops-mcp.service"
fi

sudo docker exec "$database_container" pg_dump \
  -U "$database_user" -d "$database_name" --data-only --column-inserts \
  --table=ai_agent \
  --table=ai_client \
  --table=ai_client_config \
  --table=ai_client_model \
  --table=ai_client_tool_mcp \
  --table=ai_agent_flow_config \
  --table=ai_agent_draw_config > "$backup_root/database-before.sql"
test -s "$backup_root/database-before.sql"

install -d -m 0755 "$ops_deploy_root"
install -m 0755 /tmp/workspace_ops_mcp_server.py "$ops_deploy_root/workspace_ops_mcp_server.py"
install -m 0644 /tmp/workspace-ops-targets.json "$ops_deploy_root/workspace-ops-targets.json"
sudo install -m 0644 /tmp/workspace-ops-mcp.service /etc/systemd/system/workspace-ops-mcp.service
sudo systemctl daemon-reload
sudo systemctl enable --now workspace-ops-mcp.service
sudo systemctl is-active --quiet workspace-ops-mcp.service
for _ in $(seq 1 20); do
  if nc -z 127.0.0.1 7862; then
    break
  fi
  sleep 1
done
nc -z 127.0.0.1 7862

probe_status=0
curl -sS -N --max-time 2 http://127.0.0.1:7862/sse > /tmp/workspace-ops-sse-probe.out || probe_status=$?
if [[ "$probe_status" != "0" && "$probe_status" != "28" ]]; then
  exit "$probe_status"
fi
grep -q "event: endpoint" /tmp/workspace-ops-sse-probe.out

sudo docker exec -i "$database_container" psql -v ON_ERROR_STOP=1 \
  -U "$database_user" -d "$database_name" < /tmp/register_ops_monitoring_workflow.sql

install -m 0664 /tmp/ai-agent-station-study-app.jar "$app_jar"
jar_replaced=1
install -m 0664 /tmp/workflows.html "$frontend_root/workflows.html"
install -m 0664 /tmp/workflow-runtime.20260818.js "$frontend_root/static/js/workflow-runtime.20260818.js"
install -m 0664 /tmp/workflow-runtime.20260818.css "$frontend_root/static/css/workflow-runtime.20260818.css"

sudo systemctl restart personal-ai-workspace.service
for _ in $(seq 1 40); do
  if curl -fsS --max-time 5 \
      http://127.0.0.1/ai-agent-study/api/v1/workspace/85374287/professional-workflows \
      > /tmp/workspace-ops-definitions.json; then
    break
  fi
  sleep 2
done
sudo systemctl is-active --quiet personal-ai-workspace.service
test -s /tmp/workspace-ops-definitions.json
grep -q '"type":"OPS_REPORT"' /tmp/workspace-ops-definitions.json
grep -q '"type":"MULTISELECT"' /tmp/workspace-ops-definitions.json
grep -q '"ready":true' /tmp/workspace-ops-definitions.json

jar_replaced=0
trap - ERR
echo "backup=$backup_root"

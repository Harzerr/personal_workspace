#!/usr/bin/env bash
set -euo pipefail

staged_jar="${1:?usage: deploy-knowledge-chat.sh /path/to/staged-app.jar}"
staged_html="/tmp/workflows.knowledge-chat.html"
staged_js="/tmp/workflow-runtime.knowledge-chat.js"
staged_css="/tmp/workflow-runtime.knowledge-chat.css"
smoke_request="/tmp/knowledge-chat-smoke-request.json"
app_jar="/srv/ai-agent-study/ai-agent-station-study-app/target/ai-agent-station-study-app.jar"
frontend_root="/srv/ai-agent-station-front"
backup_root="/srv/backups/personal-ai-workspace-knowledge-chat-$(date -u +%Y%m%dT%H%M%SZ)"

for staged_file in "$staged_jar" "$staged_html" "$staged_js" "$staged_css" "$smoke_request"; do
  test -s "$staged_file"
done

sudo install -d -o ubuntu -g ubuntu -m 0750 "$backup_root"
cp "$app_jar" "$backup_root/ai-agent-station-study-app.jar"
cp "$frontend_root/workflows.html" "$backup_root/workflows.html"
cp "$frontend_root/static/js/workflow-runtime.20260818.js" "$backup_root/workflow-runtime.20260818.js"
cp "$frontend_root/static/css/workflow-runtime.20260818.css" "$backup_root/workflow-runtime.20260818.css"

rollback() {
  sudo systemctl stop personal-ai-workspace.service || true
  install -m 0664 "$backup_root/ai-agent-station-study-app.jar" "$app_jar"
  install -m 0664 "$backup_root/workflows.html" "$frontend_root/workflows.html"
  install -m 0664 "$backup_root/workflow-runtime.20260818.js" "$frontend_root/static/js/workflow-runtime.20260818.js"
  install -m 0664 "$backup_root/workflow-runtime.20260818.css" "$frontend_root/static/css/workflow-runtime.20260818.css"
  sudo systemctl reset-failed personal-ai-workspace.service
  sudo systemctl start personal-ai-workspace.service || true
}
trap rollback ERR

sudo systemctl stop personal-ai-workspace.service
install -m 0664 "$staged_jar" "$app_jar"
install -m 0664 "$staged_html" "$frontend_root/workflows.html"
install -m 0664 "$staged_js" "$frontend_root/static/js/workflow-runtime.20260818.js"
install -m 0664 "$staged_css" "$frontend_root/static/css/workflow-runtime.20260818.css"
sudo systemctl reset-failed personal-ai-workspace.service
sudo systemctl start personal-ai-workspace.service

ready=0
for _ in $(seq 1 45); do
  if curl -fsS --max-time 5 \
      http://127.0.0.1/ai-agent-study/api/v1/workspace/knowledge-bases \
      > /tmp/knowledge-chat-bases.json 2>/dev/null; then
    ready=1
    break
  fi
  sleep 2
done
test "$ready" = "1"
systemctl is-active --quiet personal-ai-workspace.service

curl -fsS --max-time 60 -X POST \
  http://127.0.0.1/ai-agent-study/api/v1/workspace/personal-workspace/knowledge/chat/prepare \
  -H 'Content-Type: application/json' \
  --data-binary "@$smoke_request" \
  > /tmp/knowledge-chat-prepare.json

python3 - /tmp/knowledge-chat-prepare.json <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as source:
    payload = json.load(source)
data = payload.get("data") or {}
assert payload.get("code") == "0000", payload
assert data.get("rewrittenQuery"), data
assert isinstance(data.get("references"), list), data
assert data.get("agentMessage"), data
PY

curl -fsS --max-time 30 \
  http://127.0.0.1/ai-agent-study/api/v1/workspace/85374287/professional-workflows \
  > /tmp/knowledge-chat-workflows.json

python3 - /tmp/knowledge-chat-workflows.json <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as source:
    payload = json.load(source)
definitions = payload.get("data") or []
assert payload.get("code") == "0000", payload
assert all(item.get("type") != "CODE_REVIEW" for item in definitions), definitions
operations = next(item for item in definitions if item.get("type") == "OPS_REPORT")
assert operations.get("ready") is True, operations
fields = {item.get("name") for item in operations.get("inputs") or []}
assert {"targetId", "projectIds"}.issubset(fields), operations
PY

grep -q 'knowledgeChatSession' "$frontend_root/static/js/workflow-runtime.20260818.js"
grep -q 'knowledge-chat-transcript' "$frontend_root/static/css/workflow-runtime.20260818.css"
grep -q '20260819g' "$frontend_root/workflows.html"

rm -f "$staged_html" "$staged_js" "$staged_css" "$smoke_request"
trap - ERR
echo "backup=$backup_root"

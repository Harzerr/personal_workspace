#!/usr/bin/env bash
set -euo pipefail

app_jar=/srv/ai-agent-study/ai-agent-station-study-app/target/ai-agent-station-study-app.jar
staged_jar=/tmp/ai-agent-station-study-app.jar
env_file=/etc/personal-ai-workspace/workspace.env
server_config=/etc/personal-ai-workspace/application-server.yml
backup_root=/home/ubuntu/deploy-backups
timestamp=$(date +%Y%m%d-%H%M%S)
backup_dir="$backup_root/$timestamp/hybrid-retrieval"

if [[ ! -s "$staged_jar" ]]; then
  echo "Staged application JAR is missing: $staged_jar" >&2
  exit 1
fi

api_key=$(sudo docker exec workspace-pgvector sh -lc \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT api_key FROM ai_client_api WHERE api_id = '\''71908565'\'' LIMIT 1"')
if [[ -z "$api_key" ]]; then
  echo "The active model API credential was not found" >&2
  exit 1
fi

mkdir -p "$backup_dir"
cp "$app_jar" "$backup_dir/ai-agent-station-study-app.jar"
sudo cp "$env_file" "$backup_dir/workspace.env"
sudo cp "$server_config" "$backup_dir/application-server.yml"
sudo chown ubuntu:ubuntu "$backup_dir/workspace.env"
sudo chmod 600 "$backup_dir/workspace.env"

tmp_env=$(mktemp)
trap 'rm -f "$tmp_env"' EXIT
sudo awk '!/^WORKSPACE_(KNOWLEDGE_)?EMBEDDING_(BASE_URL|API_KEY|BASEURL|APIKEY|MODEL|DIMENSIONS)=/' "$env_file" > "$tmp_env"
{
  printf 'WORKSPACE_EMBEDDING_BASE_URL=https://openrouter.ai/api\n'
  printf 'WORKSPACE_EMBEDDING_API_KEY=%s\n' "$api_key"
  printf 'WORKSPACE_EMBEDDING_MODEL=qwen/qwen3-embedding-8b\n'
  printf 'WORKSPACE_EMBEDDING_DIMENSIONS=1536\n'
} >> "$tmp_env"
sudo install -o root -g ubuntu -m 640 "$tmp_env" "$env_file"

if ! sudo grep -q '^workspace:$' "$server_config"; then
  sudo tee -a "$server_config" >/dev/null <<'YAML'

workspace:
  knowledge:
    embedding:
      base-url: ${WORKSPACE_EMBEDDING_BASE_URL}
      api-key: ${WORKSPACE_EMBEDDING_API_KEY}
      model: ${WORKSPACE_EMBEDDING_MODEL}
      dimensions: ${WORKSPACE_EMBEDDING_DIMENSIONS}
YAML
fi

install -o ubuntu -g ubuntu -m 664 "$staged_jar" "$app_jar"
sudo systemctl restart personal-ai-workspace.service

for _ in {1..60}; do
  if curl -fsS http://127.0.0.1:8099/api/v1/workspace/personal-workspace/summary >/dev/null; then
    echo "Deployment healthy; backup: $backup_dir"
    exit 0
  fi
  sleep 2
done

echo "Service did not become healthy after deployment" >&2
sudo systemctl status personal-ai-workspace.service --no-pager >&2 || true
exit 1

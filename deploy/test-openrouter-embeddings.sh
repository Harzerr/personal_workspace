#!/usr/bin/env bash
set -euo pipefail

api_key=$(sudo docker exec workspace-pgvector sh -lc \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT api_key FROM ai_client_api ORDER BY id DESC LIMIT 1"')

for model in \
  openai/text-embedding-3-small \
  qwen/qwen3-embedding-8b \
  google/gemini-embedding-001
do
  code=$(curl -sS -o /tmp/openrouter-embedding-test.json -w '%{http_code}' \
    https://openrouter.ai/api/v1/embeddings \
    -H "Authorization: Bearer $api_key" \
    -H 'Content-Type: application/json' \
    -d "{\"model\":\"$model\",\"input\":\"retrieval test\",\"dimensions\":1536}")
  if [[ "$code" == "200" ]]; then
    message="embedding_dimensions=$(jq '.data[0].embedding | length' /tmp/openrouter-embedding-test.json)"
  else
    message=$(tr '\n' ' ' < /tmp/openrouter-embedding-test.json | cut -c1-220)
  fi
  printf '%s HTTP %s %s\n' "$model" "$code" "$message"
done

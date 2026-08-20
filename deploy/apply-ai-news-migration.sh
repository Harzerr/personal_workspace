#!/usr/bin/env bash
set -euo pipefail

backup_directory="${1:?backup directory is required}"
migration_file="${2:?migration file is required}"
container_name="workspace-pgvector"

mkdir -p "$backup_directory"
sudo docker exec "$container_name" sh -c '
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    --data-only --column-inserts \
    --table=ai_agent \
    --table=ai_client \
    --table=ai_client_config \
    --table=ai_agent_flow_config \
    --table=ai_agent_draw_config \
    --table=ai_agent_task_schedule
' > "$backup_directory/database-before.sql"
test -s "$backup_directory/database-before.sql"

sudo docker exec -i "$container_name" sh -c \
  'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < "$migration_file"

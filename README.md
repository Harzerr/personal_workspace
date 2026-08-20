# personal_workspace

Personal AI Workspace is a self-hosted Agent automation and knowledge work
platform built on top of AI Agent Station Study. It brings evidence-backed
knowledge retrieval, configurable professional workflows, content automation,
and runtime resource assembly into one interface.

## Product structure

The frontend has two explicit layers so end-user work and system configuration
do not compete for attention:

- Runtime workspace: one workflow catalog generated from enabled Agent graphs.
  Knowledge assistance and content automation are interaction modes inside the
  workflow runtime rather than separate top-level products.
- System assembly: Agent graphs, execution clients, and models and APIs.

The overview is a runtime dashboard rather than a static demo. It reads live
resource counts, workflow definitions, recent executions, knowledge-index
status, and the daily content schedule from backend APIs.

## Current capabilities

- Import Java, Markdown, and plain-text project files.
- Split Java by AST members and Markdown by heading hierarchy.
- Combine BM25 lexical retrieval and pgvector semantic retrieval with RRF.
- Fall back to lexical retrieval when the embedding provider is unavailable.
- Send retrieved evidence to an agent and stream its answer over SSE.
- Keep 12 recent messages, a compact history summary, and explicit facts in
  Redis with a 30-day TTL.
- Run three professional Agent workflows: knowledge organization, topic
  research, and operations diagnosis.
- Discover enabled Agent graphs automatically in the workflow runtime. The
  frontend joins graph metadata with backend-provided professional form
  definitions, uses graph channels for knowledge and content interactions, and
  gives every other graph a generic streaming Agent interface.
- Generate evidence-backed technical posts through a writer and independent
  inspector graph, automatically revise rejected drafts, and publish to CSDN.
- Collect five recent AI-industry events on a daily schedule while preserving
  each source URL and publication time; failed model or publishing calls enter
  a bounded retry queue.
- Configure the Agent graphs, role-specific execution clients, and model/API
  binding used by the active workflows.

## Custom work in this repository

The upstream project provides the DDD module layout, agent configuration
model, and tree-routing foundation. This repository's substantial additions
are intentionally separated and easy to review:

- `trigger/http/workspace`: AST and Markdown chunking, BM25 plus vector RRF,
  evidence-backed search, Redis memory, Git repository diff acquisition,
  professional workflow execution, AI-news collection, inspected content
  generation, retry scheduling, CSDN publishing, and GitHub webhook handling.
- `migration/migrate_mysql_to_postgresql.py`: verified schema and data
  migration from MySQL to PostgreSQL.
- `application-local.yml`: environment-based PostgreSQL, Redis, model, and
  resource configuration for a small self-hosted deployment.
- `frontend-dist/`: the deployed personal workbench integration and login UI.
- Production deployment work: reverse proxy integration, memory limits,
  database tuning, migration, and service health verification.

## Repository layout

```text
ai-agent-station-study-api/             API contracts and DTOs
ai-agent-station-study-app/             Spring Boot application and config
ai-agent-station-study-domain/          Agent domain and execution logic
ai-agent-station-study-infrastructure/  Persistence adapters and MyBatis DAOs
ai-agent-station-study-trigger/         HTTP endpoints and workspace features
ai-agent-station-study-types/           Shared types
frontend-dist/                          Deployed frontend static distribution
migration/                              MySQL-to-PostgreSQL migration utility
```

The current frontend source project was not available on the deployment
server. `frontend-dist/` therefore contains only the static build that is in
use. Rebuilding the frontend from source requires recovering or recreating
that source project.

## Knowledge retrieval architecture

The personal knowledge assistant uses one retrieval path. Uploaded Java,
Markdown, and text files are stored in `workspace_chunk`, indexed in pgvector,
and queried with BM25 plus vector retrieval and RRF fusion. Retrieved chunks
and Redis-backed conversation memory are assembled as explicit evidence before
the request enters the `Personal Knowledge Assistant` Agent graph.

The upstream `ai_client_rag_order` and `RagAnswer` Advisor mechanism is not
part of this path. It only represented legacy upload batches and vector-only
label filtering, so its unused runtime records and navigation entries were
removed instead of exposing two competing RAG configuration models.

After changing the embedding provider or restoring the database, rebuild the
semantic index from the stored chunks without uploading the source files again:

```bash
curl -X POST http://127.0.0.1:8099/api/v1/workspace/personal-workspace/knowledge/reindex
```

## Requirements

- Java 17
- Maven 3.9+
- PostgreSQL with the pgvector extension
- Redis
- An OpenAI-compatible chat and embedding endpoint

## Configuration

Use `.env.example` as a variable checklist and store real values outside Git.
Spring reads the variables referenced by `application-local.yml`.

Required variables:

```text
WORKSPACE_POSTGRES_USERNAME
WORKSPACE_POSTGRES_PASSWORD
WORKSPACE_POSTGRES_URL
WORKSPACE_OPENAI_API_KEY
WORKSPACE_EMBEDDING_API_KEY
```

Optional blog and model settings:

```text
WORKSPACE_OPENAI_CHAT_MODEL
WORKSPACE_EMBEDDING_BASE_URL
WORKSPACE_EMBEDDING_MODEL
WORKSPACE_EMBEDDING_DIMENSIONS
WORKSPACE_BLOG_STORAGE_DIR
WORKSPACE_CSDN_CREDENTIALS_FILE
WORKSPACE_BLOG_API_ID
WORKSPACE_BLOG_MODEL_BEAN
WORKSPACE_BLOG_WORKFLOW_AGENT_ID
WORKSPACE_BLOG_INSPECTION_MIN_SCORE
```

## Blog workflow

Register the editable writer/inspector Agent graph in PostgreSQL:

```bash
psql "$DATABASE_URL" -f migration/register_blog_agent_workflow.sql
```

Set `WORKSPACE_BLOG_WORKFLOW_AGENT_ID` to the registered Agent ID. The deployed
graph appears under `Agent list`, its writer and inspector appear under
`Client management`, and clicking `Load` reassembles their current model
bindings. The blog runtime reads the client roles, sequence, and step prompts
from this graph.

Generate a draft from workspace evidence:

```bash
curl -X POST http://127.0.0.1:8099/api/v1/workspace/demo/blogs/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"How hybrid retrieval works","sourceQuery":"BM25 vector RRF","targetLength":1200,"tags":["RAG","Java"]}'
```

The content API also supports listing and reading drafts, manual draft
creation, editing, draft deletion, automation configuration, run history, and
publishing through
`POST /api/v1/workspace/{workspaceId}/blogs/{blogId}/publish`. Use a request body
of `{"target":"CSDN","mode":"DRAFT"}` to save the article to the configured
CSDN draft box, or use `mode: "PUBLIC"` for immediate public publication.
Every successful publication also writes a Markdown archive under
`{WORKSPACE_BLOG_STORAGE_DIR}/{workspaceId}/published/`. Published versions are
immutable so that external content and its stored metadata cannot silently diverge.

Do not commit production credentials or database exports.

## Build and test

Build all backend modules:

```bash
mvn clean package -DskipTests
```

Run the focused Workspace tests:

```bash
mvn -pl ai-agent-station-study-trigger -am test -DskipTests=false
```

Run the application after PostgreSQL, pgvector, and Redis are available:

```bash
java -jar ai-agent-station-study-app/target/ai-agent-station-study-app.jar
```

## Security status

This is currently a portfolio prototype, not a hardened multi-user service.
The customized frontend has a single-account login, but the backend does not
yet issue or validate a server-side session token. Run it only behind a
trusted reverse proxy until HTTPS, password hashing, route authorization, and
restricted CORS are implemented.

## Known limitations

- Retrieval benchmark labels are synthetically generated and require periodic human audits.
- Long-term facts are stored in Redis and are not vectorized.
- GitHub review currently supports public repositories; private repository
  cloning needs a short-lived GitHub App installation token.
- CSDN publishing depends on a user session credential and can require
  maintenance when the platform changes its editor or anti-automation checks.
- External operational data still needs a maintained connector before the
  operations workflow can collect telemetry automatically.
- Runtime database contents and production configuration are excluded.

## Upstream and license

This project is derived from **AI Agent Station Study v2.2**. Upstream and
runtime dependency attribution is retained in `NOTICE` and `THIRD_PARTY.md`.
The repository is distributed under the Apache License, Version 2.0; see
`LICENSE` and `NOTICE`.

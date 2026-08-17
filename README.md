# personal_workspace

Personal AI Workspace is a self-hosted AI development workbench built on top
of AI Agent Station Study. It combines project document retrieval, cited AI
answers, lightweight conversation memory, diff risk checks, and configurable
agent execution in one interface.

## Current capabilities

- Import Java, Markdown, and plain-text project files.
- Split Java by AST members and Markdown by heading hierarchy.
- Combine BM25 lexical retrieval and pgvector semantic retrieval with RRF.
- Fall back to lexical retrieval when the embedding provider is unavailable.
- Send retrieved evidence to an agent and stream its answer over SSE.
- Keep 12 recent messages, a compact history summary, and explicit facts in
  Redis with a 30-day TTL.
- Detect five high-risk diff patterns, including possible credentials,
  dangerous process execution, disabled tests, unsafe SQL writes, and empty
  catch blocks.
- Configure agents, models, prompts, advisors, RAG resources, and MCP tools.

The repository intentionally does not claim automated blog, social-media, or
novel publishing. Those workflows and their external connectors are planned,
not complete.

## Custom work in this repository

The upstream project provides the DDD module layout, agent configuration
model, and tree-routing foundation. This repository's substantial additions
are intentionally separated and easy to review:

- `trigger/http/workspace`: AST and Markdown chunking, BM25 plus vector RRF,
  evidence-backed search, Redis memory, and diff risk checks.
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
```

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

- No reproducible retrieval benchmark is included yet.
- Long-term facts are stored in Redis and are not vectorized.
- Diff review is rule-based and is not yet wired to a Git pre-commit hook.
- MCP configurations require separately deployed connector services.
- Content publishing workflows are not implemented end to end.
- Runtime database contents and production configuration are excluded.

## Upstream and license

This project is derived from **AI Agent Station Study v2.2**. Upstream and
runtime dependency attribution is retained in `NOTICE` and `THIRD_PARTY.md`.
The repository is distributed under the Apache License, Version 2.0; see
`LICENSE` and `NOTICE`.

CREATE TABLE IF NOT EXISTS workspace_knowledge_base (
    knowledge_base_id VARCHAR(64) PRIMARY KEY,
    knowledge_base_name VARCHAR(128) NOT NULL,
    description VARCHAR(512) NOT NULL DEFAULT '',
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS workspace_agent_knowledge_base (
    agent_id VARCHAR(64) NOT NULL,
    knowledge_base_id VARCHAR(64) NOT NULL,
    sequence INT NOT NULL DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (agent_id, knowledge_base_id),
    CONSTRAINT fk_workspace_agent_knowledge_base
        FOREIGN KEY (knowledge_base_id) REFERENCES workspace_knowledge_base(knowledge_base_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workspace_agent_kb_agent
    ON workspace_agent_knowledge_base(agent_id, status, sequence);

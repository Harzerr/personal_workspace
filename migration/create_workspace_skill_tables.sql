BEGIN;

CREATE TABLE IF NOT EXISTS workspace_skill (
    skill_id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL,
    skill_name VARCHAR(128) NOT NULL,
    description VARCHAR(512) NOT NULL DEFAULT '',
    instructions TEXT NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'GENERAL',
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_workspace_skill_name UNIQUE (workspace_id, skill_name)
);

CREATE TABLE IF NOT EXISTS workspace_agent_skill (
    agent_id VARCHAR(64) NOT NULL,
    skill_id VARCHAR(64) NOT NULL,
    sequence INT NOT NULL DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (agent_id, skill_id),
    CONSTRAINT fk_workspace_agent_skill
        FOREIGN KEY (skill_id) REFERENCES workspace_skill(skill_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workspace_skill_workspace ON workspace_skill(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_workspace_agent_skill_agent ON workspace_agent_skill(agent_id, status, sequence);

COMMIT;

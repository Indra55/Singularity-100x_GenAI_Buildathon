CREATE TABLE IF NOT EXISTS generated_candidates (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    candidate_data JSONB NOT NULL,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('AI_GENERATED', 'RESUME_PARSED', 'MANUAL_ENTRY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED', 'DELETED'))
);

CREATE INDEX IF NOT EXISTS idx_generated_candidates_user ON generated_candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_candidates_source ON generated_candidates(source_type);
CREATE INDEX IF NOT EXISTS idx_generated_candidates_status ON generated_candidates(status); 
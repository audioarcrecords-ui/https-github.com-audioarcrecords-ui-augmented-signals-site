-- VoidSynth AI training-data collector schema (Cloudflare D1)
--
-- Stores every successful (prompt -> params) generation submitted by
-- installed copies of VoidSynth, so it can later be used to train a
-- fully-local replacement for the Groq/OpenRouter API calls.
--
-- Apply with:
--   npx wrangler d1 execute voidsynth-presets --remote --file=schema/presets.sql

CREATE TABLE IF NOT EXISTS presets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt      TEXT    NOT NULL,
    params      TEXT    NOT NULL,   -- JSON blob, exact shape the AI panel produced
    model       TEXT,               -- e.g. "groq/openai/gpt-oss-20b", "openrouter/..."
    tool        TEXT,               -- "generate" | "vars" | "refine" | tool index
    app_version TEXT,               -- VoidSynth build/version string
    client_id   TEXT,               -- anonymous per-install UUID (not personally identifying)
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_presets_created_at ON presets (created_at);
CREATE INDEX IF NOT EXISTS idx_presets_client_id  ON presets (client_id);

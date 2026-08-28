/**
 * Skema DDL relasional PRD (Section 13) — dibagi agar migrate.mjs dan
 * migrate-test.mjs memakai definisi tunggal (single source of truth).
 * Idempotent & additif terhadap sistem KV legacy.
 */
export const DDL = `
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '{}',
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '{}',
    content TEXT NOT NULL DEFAULT '{}',
    thumbnail TEXT NOT NULL DEFAULT '',
    category_id TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    cover TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'IDEA',
    source_type TEXT NOT NULL DEFAULT 'HUMAN',
    author_id TEXT NOT NULL DEFAULT '',
    seo_title TEXT NOT NULL DEFAULT '{}',
    seo_description TEXT NOT NULL DEFAULT '{}',
    original_topic TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT,
    scheduled_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
  CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
  CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at);

  CREATE TABLE IF NOT EXISTS article_ideas (
    id TEXT PRIMARY KEY,
    raw_idea TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'HUMAN',
    status TEXT NOT NULL DEFAULT 'OPEN',
    linked_article_id TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_ideas_status ON article_ideas(status);

  CREATE TABLE IF NOT EXISTS article_revisions (
    id TEXT PRIMARY KEY,
    article_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '{}',
    content TEXT NOT NULL DEFAULT '{}',
    source_type TEXT NOT NULL DEFAULT '',
    changed_by TEXT NOT NULL DEFAULT '',
    change_summary TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_revisions_article ON article_revisions(article_id);

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_type TEXT NOT NULL,
    actor_id TEXT NOT NULL DEFAULT '',
    action TEXT NOT NULL,
    entity TEXT NOT NULL DEFAULT '',
    entity_id TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at);

  CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS role_permissions (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (role_id, permission_id)
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL DEFAULT '',
    role_id TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS telegram_identities (
    id TEXT PRIMARY KEY,
    telegram_user_id TEXT NOT NULL UNIQUE,
    admin_user_id TEXT NOT NULL DEFAULT '',
    username TEXT NOT NULL DEFAULT '',
    is_whitelisted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tg_userid ON telegram_identities(telegram_user_id);

  CREATE TABLE IF NOT EXISTS media_assets (
    id TEXT PRIMARY KEY,
    storage_key TEXT NOT NULL,
    url TEXT NOT NULL DEFAULT '',
    mime_type TEXT NOT NULL DEFAULT '',
    size INTEGER NOT NULL DEFAULT 0,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS agent_runs (
    id TEXT PRIMARY KEY,
    request TEXT NOT NULL DEFAULT '',
    tool TEXT NOT NULL DEFAULT '',
    result_status TEXT NOT NULL DEFAULT '',
    actor TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS article_pipeline (
    id TEXT PRIMARY KEY,
    article_id TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'AI',
    original_input TEXT NOT NULL DEFAULT '',
    research TEXT NOT NULL DEFAULT '',
    outline TEXT NOT NULL DEFAULT '',
    ai_draft TEXT NOT NULL DEFAULT '',
    final_content TEXT NOT NULL DEFAULT '',
    checklist TEXT NOT NULL DEFAULT '{}',
    ai_feedback TEXT NOT NULL DEFAULT '',
    review_iterations INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_pipeline_article ON article_pipeline(article_id);
`

import { createClient, type Client } from '@libsql/client'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

let _db: Client | null = null
let _useTurso = false

function dataDir() {
  return path.resolve(process.cwd(), '.data')
}

function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL)
}

export function db(): Client {
  if (!_db) {
    if (isTursoConfigured()) {
      _useTurso = true
      const url = process.env.TURSO_DATABASE_URL!
      const authToken = process.env.TURSO_AUTH_TOKEN
      _db = createClient({ url, authToken: authToken || undefined })
    } else {
      _useTurso = false
      throw new Error('TURSO_DATABASE_URL belum diatur. Untuk local dev, gunakan file fallback.')
    }
  }
  return _db
}

export function isUsingTurso() {
  return _useTurso || isTursoConfigured()
}

// ---- Local file fallback ----

const kvFile = path.resolve(dataDir(), 'kv.json')

async function readLocalKv(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await readFile(kvFile, 'utf-8'))
  } catch {
    return {}
  }
}

async function writeLocalKv(data: Record<string, string>) {
  await mkdir(dataDir(), { recursive: true })
  await writeFile(kvFile, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

// ---- Schema (Turso only) ----

let _initialized = false

export async function ensureSchema() {
  if (!isTursoConfigured()) return
  if (_initialized) return
  const client = db()

  // Migrasi ringan untuk database lama HARUS dijalankan lebih dulu,
  // sebelum pembuatan indeks yang mereferensikan kolom baru.
  try {
    await client.execute('ALTER TABLE article_comments ADD COLUMN parent_id TEXT NOT NULL DEFAULT \'\'')
  } catch {
    // kolom sudah ada — aman diabaikan
  }
  try {
    await client.execute('ALTER TABLE articles ADD COLUMN scheduled_at TEXT')
  } catch {
    // kolom sudah ada — aman diabaikan
  }

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      at TEXT NOT NULL,
      path TEXT NOT NULL,
      session TEXT NOT NULL DEFAULT '',
      referrer TEXT NOT NULL DEFAULT '',
      device TEXT NOT NULL DEFAULT 'Desktop',
      browser TEXT NOT NULL DEFAULT 'Lainnya'
    );
    CREATE INDEX IF NOT EXISTS idx_visits_at ON visits(at);
    CREATE INDEX IF NOT EXISTS idx_visits_path ON visits(path);

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      at TEXT NOT NULL,
      replies TEXT NOT NULL DEFAULT '[]'
    );
    CREATE INDEX IF NOT EXISTS idx_messages_at ON messages(at);

    CREATE TABLE IF NOT EXISTS chat_conversations (
      id TEXT PRIMARY KEY,
      visitor_name TEXT NOT NULL DEFAULT '',
      visitor_email TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      unread INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_chat_conv_updated ON chat_conversations(updated_at);

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      at TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_chat_msg_conv ON chat_messages(conversation_id);

    CREATE TABLE IF NOT EXISTS article_comments (
      id TEXT PRIMARY KEY,
      article_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      at TEXT NOT NULL,
      parent_id TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_article_comments_slug ON article_comments(article_slug);
    CREATE INDEX IF NOT EXISTS idx_article_comments_at ON article_comments(at);
    CREATE INDEX IF NOT EXISTS idx_article_comments_parent ON article_comments(parent_id);

    CREATE TABLE IF NOT EXISTS security_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      event TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '{}'
    );

    -- =====================================================================
    -- PRD CHDEV AI ADMIN & CONTENT AGENT — Section 13 (relational tables)
    -- Ditambahkan secara additif; tidak mengubah/menghapus tabel lama.
    -- ID biasa dipakai TEXT (uuid-ish); kolom multi-bahasa (title/excerpt/
    -- content/seo) disimpan sebagai string JSON objek LS {id,en}.
    -- =====================================================================

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
  `)

  _initialized = true
}

// ---- KV operations (dual mode) ----

export async function kvGet(key: string): Promise<string | null> {
  if (isTursoConfigured()) {
    await ensureSchema()
    const result = await db().execute({ sql: 'SELECT value FROM kv WHERE key = ?', args: [key] })
    return result.rows[0]?.value as string | undefined ?? null
  }
  const store = await readLocalKv()
  return store[key] ?? null
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (isTursoConfigured()) {
    await ensureSchema()
    await db().execute({ sql: 'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)', args: [key, value] })
    return
  }
  const store = await readLocalKv()
  store[key] = value
  await writeLocalKv(store)
}

export async function kvGetJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await kvGet(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function kvSetJson(key: string, value: unknown): Promise<void> {
  await kvSet(key, JSON.stringify(value))
}

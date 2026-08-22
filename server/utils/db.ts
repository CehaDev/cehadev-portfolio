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
      at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_article_comments_slug ON article_comments(article_slug);
    CREATE INDEX IF NOT EXISTS idx_article_comments_at ON article_comments(at);

    CREATE TABLE IF NOT EXISTS security_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      event TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '{}'
    );
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

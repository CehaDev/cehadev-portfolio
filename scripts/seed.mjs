#!/usr/bin/env node
import { createClient } from '@libsql/client'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

async function main() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) {
    console.error('TURSO_DATABASE_URL harus diatur')
    process.exit(1)
  }

  const client = createClient({ url, authToken: authToken || undefined })

  console.log('Membuat schema database...')
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
    CREATE TABLE IF NOT EXISTS security_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      event TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '{}'
    );
  `)
  console.log('Schema database selesai.')

  console.log('Import data dari content/*.json...')
  const contentFiles = {
    content_site: 'content/site.json',
    content_skills: 'content/skills.json',
    content_cv: 'content/cv.json'
  }

  for (const [key, file] of Object.entries(contentFiles)) {
    try {
      const data = await readFile(resolve(root, file), 'utf-8')
      JSON.parse(data) // validate JSON
      await client.execute({
        sql: 'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)',
        args: [key, data.trim()]
      })
      console.log(`  ✓ ${key} dari ${file}`)
    } catch (e) {
      console.log(`  ✗ ${key}: ${e.message}`)
    }
  }

  // Projects - collect all project JSON files
  const projectsDir = resolve(root, 'content/projects')
  try {
    const { readdirSync } = await import('node:fs')
    const files = readdirSync(projectsDir).filter(f => f.endsWith('.json'))
    const projects = []
    for (const f of files) {
      const raw = await readFile(resolve(projectsDir, f), 'utf-8')
      projects.push(JSON.parse(raw))
    }
    await client.execute({
      sql: 'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)',
      args: ['content_projects', JSON.stringify(projects)]
    })
    console.log(`  ✓ content_projects (${projects.length} projects)`)
  } catch (e) {
    console.log(`  ✗ content_projects: ${e.message}`)
  }

  // Default values
  await client.execute({
    sql: 'INSERT OR IGNORE INTO kv (key, value) VALUES (?, ?)',
    args: ['chat_enabled', 'true']
  })
  await client.execute({
    sql: 'INSERT OR IGNORE INTO kv (key, value) VALUES (?, ?)',
    args: ['session_epoch', '0']
  })

  console.log('Seed database selesai!')
}

main().catch(e => {
  console.error('Gagal seed database:', e)
  process.exit(1)
})

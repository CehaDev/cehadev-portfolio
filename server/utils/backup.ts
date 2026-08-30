import type { Client } from '@libsql/client'
import { createError } from 'h3'
import { mkdir, readFile, writeFile, readdir, unlink } from 'node:fs/promises'
import { gzipSync, gunzipSync } from 'node:zlib'
import path from 'node:path'
import { db, ensureSchema, isUsingTurso } from './db'

/**
 * Backup & restore (PRD Section 15/17). Semua tabel relasional di-dump ke JSON
 * lalu di-compress gzip.
 *
 * Penyimpanan dipilih otomatis saat runtime:
 *  - Turso (produksi serverless di Vercel): backup disimpan di tabel `backups`
 *    pada database yang sama — persisten dan tidak memerlukan filesystem.
 *  - Filesystem `.data/backups`: fallback untuk dev/test local.
 *
 * Untuk memaksa client tertentu (mis. test), pakai __setBackupDbForTest().
 */

export const BACKUP_TABLES = [
  'articles',
  'article_ideas',
  'article_revisions',
  'activity_logs',
  'media_assets',
  'agent_runs',
  'roles',
  'permissions',
  'role_permissions',
  'admin_users',
  'telegram_identities',
  'article_pipeline'
] as const

export interface BackupMeta {
  created_at: string
  count: number
  bytes: number
}

let _override: Client | null = null

export function __setBackupDbForTest(c: Client | null) {
  _override = c
}

function conn(): Client {
  if (_override) return _override
  return db()
}

function backupDir() {
  return path.resolve(process.cwd(), '.data', 'backups')
}

function fileName(ts: string) {
  return `backup-${ts.replace(/[:.]/g, '-')}.json.gz`
}

function uid() {
  return `bak_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

async function dumpToGz(): Promise<{ payload: { meta: BackupMeta; tables: Record<string, unknown[]> }; gz: Buffer; count: number }> {
  await ensureSchema()
  const c = conn()
  const dump: Record<string, unknown[]> = {}
  for (const table of BACKUP_TABLES) {
    try {
      const res = await c.execute({ sql: `SELECT * FROM "${table}"`, args: [] })
      dump[table] = res.rows as unknown[]
    } catch {
      dump[table] = []
    }
  }
  const created_at = new Date().toISOString()
  const count = Object.keys(dump).length
  const payload = { meta: { created_at, count, bytes: 0 }, tables: dump }
  const json = JSON.stringify(payload)
  const gz = gzipSync(Buffer.from(json, 'utf-8'))
  return { payload: { meta: { created_at, count, bytes: gz.length }, tables: dump }, gz, count }
}

// ---------------------------------------------------------------------------
// createBackup
// ---------------------------------------------------------------------------

export async function createBackup(): Promise<{ file: string; meta: BackupMeta }> {
  const { meta, gz, count } = await dumpToGz()
  if (isUsingTurso()) {
    const name = fileName(meta.created_at)
    const c = conn()
    await c.execute({
      sql: 'INSERT INTO backups (id, name, created_at, bytes, data) VALUES (?, ?, ?, ?, ?)',
      args: [uid(), name, meta.created_at, meta.bytes, new Uint8Array(gz)]
    })
    return { file: name, meta: { created_at: meta.created_at, count, bytes: meta.bytes } }
  }

  const dir = backupDir()
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, fileName(meta.created_at))
  await writeFile(file, gz)
  return { file, meta: { created_at: meta.created_at, count, bytes: meta.bytes } }
}

export interface BackupRecord {
  file: string
  name: string
  created_at: string
  bytes: number
}

function nameToCreatedAt(name: string): string {
  return name
    .replace(/^backup-/, '')
    .replace(/\.json\.gz$/, '')
    .replace(/-/g, ':')
    .replace(/(\d{4}):(\d{2}):(\d{2})T/, '$1-$2-$3T')
    .replace(/(\d{2}):(\d{2}):(\d{2})/, '$1:$2:$3')
}

// ---------------------------------------------------------------------------
// listBackups
// ---------------------------------------------------------------------------

export async function listBackups(limit = 20): Promise<BackupRecord[]> {
  if (isUsingTurso()) {
    const res = await conn().execute({
      sql: 'SELECT name, created_at, bytes FROM backups ORDER BY created_at DESC LIMIT ?',
      args: [limit]
    })
    return res.rows.map((row) => {
      const name = String(row.name ?? '')
      return {
        file: name,
        name,
        created_at: String(row.created_at ?? nameToCreatedAt(name) ?? ''),
        bytes: Number(row.bytes ?? 0)
      }
    })
  }

  const dir = backupDir()
  let files: string[] = []
  try {
    files = await readdir(dir)
  } catch {
    files = []
  }
  const records: BackupRecord[] = []
  for (const name of files) {
    if (!name.endsWith('.json.gz')) continue
    const full = path.join(dir, name)
    let bytes = 0
    try {
      const st = await import('node:fs/promises').then((m) => m.stat(full))
      bytes = st.size
    } catch {}
    records.push({ file: full, name, created_at: nameToCreatedAt(name), bytes })
  }
  records.sort((a, b) => (a.name < b.name ? 1 : -1))
  return records.slice(0, limit)
}

async function readBackupGz(fileOrName: string): Promise<{ meta: BackupMeta; tables: Record<string, unknown[]> }> {
  if (isUsingTurso()) {
    const name = path.basename(fileOrName)
    const res = await conn().execute({
      sql: 'SELECT data FROM backups WHERE name = ?',
      args: [name]
    })
    const row = res.rows[0]
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Backup tidak ditemukan' })
    const raw = (row.data as Uint8Array | string | null) ?? null
    if (raw == null) throw createError({ statusCode: 404, statusMessage: 'Backup tidak ditemukan' })
    const gz = typeof raw === 'string' ? Buffer.from(raw, 'base64') : Buffer.from(raw)
    const json = gunzipSync(gz).toString('utf-8')
    return JSON.parse(json)
  }
  const gz = await readFile(fileOrName)
  const json = gunzipSync(gz).toString('utf-8')
  return JSON.parse(json)
}

/** Mengganti seluruh tabel dari sebuah file backup. */
export async function restoreBackup(file: string): Promise<{ restored: string[] }> {
  const { tables } = await readBackupGz(file)
  const c = conn()
  const restored: string[] = []
  for (const table of Object.keys(tables)) {
    const exists = await c.execute({ sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`, args: [table] })
    if (!exists.rows.length) continue // tabel tak ada di DB target — lewati
    const rows = tables[table]
    await c.execute(`DELETE FROM "${table}"`) // eslint-disable-line @typescript-eslint/no-base-to-string
    for (const row of rows) {
      const cols = Object.keys(row as Record<string, unknown>)
      const vals = cols.map((col) => (row as Record<string, unknown>)[col])
      const placeholders = cols.map(() => '?').join(', ')
      await c.execute({
        sql: `INSERT INTO "${table}" (${cols.map((x) => `"${x}"`).join(', ')}) VALUES (${placeholders})`,
        args: vals
      })
    }
    restored.push(table)
  }
  return { restored }
}

export async function deleteBackup(file: string): Promise<{ ok: true }> {
  if (isUsingTurso()) {
    const name = path.basename(file)
    await conn().execute({ sql: 'DELETE FROM backups WHERE name = ?', args: [name] })
    return { ok: true }
  }
  try {
    await unlink(file)
  } catch {}
  return { ok: true }
}

/** Hapus backup lebih lama dari N hari (retensi). */
export async function pruneBackups(days = 7): Promise<number> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  if (isUsingTurso()) {
    const cutoffIso = new Date(cutoff).toISOString()
    const res = await conn().execute({
      sql: 'DELETE FROM backups WHERE created_at < ?',
      args: [cutoffIso]
    })
    return Number(res.rowsAffected ?? 0)
  }
  let removed = 0
  const files = await listBackups(1000)
  for (const rec of files) {
    const iso = toIso(rec.name)
    if (iso) {
      const t = new Date(iso).getTime()
      if (Number.isFinite(t) && t < cutoff) {
        try {
          await unlink(rec.file)
          removed++
        } catch {}
      }
    }
  }
  return removed
}

function toIso(name: string): string | null {
  // backup-YYYY-MM-DDTHH-MM-SS.json.gz
  const m = name.match(/^backup-(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi, s] = m
  return `${y}-${mo}-${d}T${h}:${mi}:${s}.000Z`
}
import { createError } from 'h3'
import type { Client, Row } from '@libsql/client'
import { db, ensureSchema } from './db'
import { storage, makeStorageKey } from './storage'
import * as identity from './telegram-identity'
import { logActivity } from './article-manager'
import { PERMISSIONS } from './permissions'

export interface MediaRecord {
  id: string
  storage_key: string
  url: string
  mime_type: string
  size: number
  metadata: string
  created_at: string
}

// ---- Validation (PRD Section 8: tipe file, ukuran, permission) -------------

export const ALLOWED_MIME = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['audio/ogg', '.ogg'],
  ['audio/mpeg', '.mp3'],
  ['audio/mp4', '.m4a'],
  ['audio/webm', '.webm']
])

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_AUDIO_BYTES = 50 * 1024 * 1024 // 50 MB

export function isImageMime(mime: string) {
  return mime.startsWith('image/')
}
export function isAudioMime(mime: string) {
  return mime.startsWith('audio/')
}

export function maxBytesFor(mime: string): number {
  return isAudioMime(mime) ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES
}

export function validateMedia(mimeType: string, size: number): { ext: string } | never {
  const ext = ALLOWED_MIME.get(mimeType)
  if (!ext) {
    throw createError({ statusCode: 415, message: `Tipe file tidak diizinkan: ${mimeType}` })
  }
  if (size <= 0) {
    throw createError({ statusCode: 400, message: 'File kosong' })
  }
  const max = maxBytesFor(mimeType)
  if (size > max) {
    throw createError({ statusCode: 413, message: `Ukuran melebihi batas (${Math.round(max / 1024 / 1024)} MB)` })
  }
  return { ext }
}

// ---- db --------------------------------------------------------------------

let _override: Client | null = null

export function __setMediaDbForTest(c: Client | null) {
  _override = c
}

function conn() {
  return _override ?? db()
}

function uid(prefix = 'med') {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now() {
  return new Date().toISOString()
}

// ---- CRUD media_assets -----------------------------------------------------

export async function listMedia(limit = 50): Promise<MediaRecord[]> {
  await ensureSchema()
  const res = await conn().execute({ sql: 'SELECT * FROM media_assets ORDER BY created_at DESC LIMIT ?', args: [limit] })
  return (res.rows as Row[]).map((r) => {
    const row = r as unknown as Record<string, unknown>
    return {
      id: String(row.id ?? ''),
      storage_key: String(row.storage_key ?? ''),
      url: String(row.url ?? ''),
      mime_type: String(row.mime_type ?? ''),
      size: Number(row.size ?? 0),
      metadata: String(row.metadata ?? '{}'),
      created_at: String(row.created_at ?? '')
    }
  })
}

export async function storeMedia(opts: {
  data: Buffer
  mimeType: string
  metadata?: Record<string, unknown>
  actorId?: string
}): Promise<MediaRecord> {
  const { ext } = validateMedia(opts.mimeType, opts.data.length)
  const stored = await storage().put(opts.data, makeStorageKey(opts.data, ext), opts.mimeType)
  await ensureSchema()
  const meta = JSON.stringify(opts.metadata ?? {})
  const row: MediaRecord = {
    id: uid(),
    storage_key: stored.key,
    url: stored.url,
    mime_type: opts.mimeType,
    size: stored.size,
    metadata: meta,
    created_at: now()
  }
  await conn().execute({
    sql: `INSERT INTO media_assets (id, storage_key, url, mime_type, size, metadata, created_at) VALUES (?,?,?,?,?,?,?)`,
    args: [row.id, row.storage_key, row.url, row.mime_type, row.size, row.metadata, row.created_at]
  })
  await identity.logAgentRun?.('media store', 'media.store', 'success', opts.actorId || 'api-user')
  await logActivity('media', opts.actorId || 'api-user', 'media.create', 'media', row.id, `Media ${row.mime_type} disimpan`)
  return row
}

export async function deleteMedia(id: string, actorId = 'api-user'): Promise<{ ok: true }> {
  await ensureSchema()
  const res = await conn().execute({ sql: 'SELECT * FROM media_assets WHERE id = ?', args: [id] })
  const row = res.rows[0] as unknown as Record<string, unknown> | undefined
  if (!row) throw createError({ statusCode: 404, message: 'Media tidak ditemukan' })
  await storage().delete(String(row.storage_key ?? ''))
  await conn().execute({ sql: 'DELETE FROM media_assets WHERE id = ?', args: [id] })
  await logActivity('media', actorId, 'media.delete', 'media', id, 'Media dihapus')
  return { ok: true }
}

export async function getMedia(id: string): Promise<MediaRecord> {
  await ensureSchema()
  const res = await conn().execute({ sql: 'SELECT * FROM media_assets WHERE id = ?', args: [id] })
  const row = res.rows[0] as unknown as Record<string, unknown> | undefined
  if (!row) throw createError({ statusCode: 404, message: 'Media tidak ditemukan' })
  return {
    id: String(row.id ?? ''),
    storage_key: String(row.storage_key ?? ''),
    url: String(row.url ?? ''),
    mime_type: String(row.mime_type ?? ''),
    size: Number(row.size ?? 0),
    metadata: String(row.metadata ?? '{}'),
    created_at: String(row.created_at ?? '')
  }
}

/**
 * Messenger di-whitelist (admin/whitelisted user dengan permission media).
 */
export function assertMediaPermission(ctx?: { ctx?: identity.UserContext }) {
  const u = ctx?.ctx
  if (!u) return
  if (!u.isWhitelisted) throw createError({ statusCode: 403, message: 'Akses ditolak: identity tidak terdaftar' })
  const allow = u.permissions.includes(PERMISSIONS.ARTICLE_WRITE) || u.permissions.includes(PERMISSIONS.ADMIN_READ)
  if (!allow) throw createError({ statusCode: 403, message: 'Akses ditolak: butuh permission artikel/media' })
}

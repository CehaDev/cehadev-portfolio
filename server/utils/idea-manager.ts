import { createError } from 'h3'
import type { Client, Row } from '@libsql/client'
import { db, isUsingTurso } from './db'

export const IDEA_STATUSES = ['OPEN', 'IN_PROGRESS', 'DONE', 'DISCARDED'] as const
export type IdeaStatus = (typeof IDEA_STATUSES)[number]
const VALID_IDEAS = new Set<string>(IDEA_STATUSES)
const VALID_IDEA_SOURCE = new Set<string>(['HUMAN', 'AI', 'HUMAN_AI'])

export interface IdeaRecord {
  id: string
  raw_idea: string
  source_type: string
  status: IdeaStatus
  linked_article_id: string
  created_at: string
  updated_at: string
}

let _override: Client | null = null

/** Hanya untuk test — mengarahkan client ke libSQL lokal/temp. */
export function __setIdeaDbForTest(c: Client | null) {
  _override = c
}

function client(): Client {
  if (_override) return _override
  if (!isUsingTurso()) {
    throw createError({ statusCode: 500, message: 'Relational idea store memerlukan TURSO_DATABASE_URL' })
  }
  return db()
}

function now() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function rowToIdea(row: Record<string, unknown>): IdeaRecord {
  return {
    id: String(row.id ?? ''),
    raw_idea: String(row.raw_idea ?? ''),
    source_type: String(row.source_type ?? 'HUMAN'),
    status: (VALID_IDEAS.has(String(row.status)) ? String(row.status) : 'OPEN') as IdeaStatus,
    linked_article_id: String(row.linked_article_id ?? ''),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? '')
  }
}

export async function listIdeas(filter?: { status?: IdeaStatus }): Promise<IdeaRecord[]> {
  const c = client()
  const cond: string[] = []
  const args: unknown[] = []
  if (filter?.status) {
    cond.push('status = ?')
    args.push(filter.status)
  }
  const where = cond.length ? ` WHERE ${cond.join(' AND ')}` : ''
  const res = await c.execute({
    sql: `SELECT * FROM article_ideas${where} ORDER BY created_at DESC`,
    args
  })
  return (res.rows as Row[]).map((r) => rowToIdea(r as unknown as Record<string, unknown>))
}

export async function getIdea(id: string): Promise<IdeaRecord> {
  const c = client()
  const res = await c.execute({ sql: 'SELECT * FROM article_ideas WHERE id = ?', args: [id] })
  const row = res.rows[0]
  if (!row) throw createError({ statusCode: 404, message: 'Ide tidak ditemukan' })
  return rowToIdea(row as unknown as Record<string, unknown>)
}

export async function createIdea(body: Record<string, unknown>): Promise<IdeaRecord> {
  const rawIdea = String(body.raw_idea ?? '').trim()
  if (!rawIdea) throw createError({ statusCode: 400, message: 'Isi ide wajib diisi' })

  const source = VALID_IDEA_SOURCE.has(String(body.source_type)) ? String(body.source_type) : 'HUMAN'
  const status = VALID_IDEAS.has(String(body.status)) ? String(body.status) : 'OPEN'

  const c = client()
  const id = uid('idea')
  const ts = now()
  await c.execute({
    sql: `INSERT INTO article_ideas (id, raw_idea, source_type, status, linked_article_id, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?)`,
    args: [id, rawIdea, source, status, String(body.linked_article_id ?? ''), ts, ts]
  })
  return getIdea(id)
}

export async function updateIdea(id: string, body: Record<string, unknown>): Promise<IdeaRecord> {
  const current = await getIdea(id)
  const c = client()
  const rawIdea = body.raw_idea !== undefined ? String(body.raw_idea).trim() : current.raw_idea
  if (!rawIdea) throw createError({ statusCode: 400, message: 'Isi ide wajib diisi' })
  const source = body.source_type !== undefined
    ? (VALID_IDEA_SOURCE.has(String(body.source_type)) ? String(body.source_type) : current.source_type)
    : current.source_type
  const status = body.status !== undefined
    ? (VALID_IDEAS.has(String(body.status)) ? String(body.status) : current.status)
    : current.status
  const linked = body.linked_article_id !== undefined ? String(body.linked_article_id) : current.linked_article_id

  await c.execute({
    sql: `UPDATE article_ideas SET raw_idea = ?, source_type = ?, status = ?, linked_article_id = ?, updated_at = ? WHERE id = ?`,
    args: [rawIdea, source, status, linked, now(), id]
  })
  return getIdea(id)
}

export async function deleteIdea(id: string) {
  await getIdea(id)
  const c = client()
  await c.execute({ sql: 'DELETE FROM article_ideas WHERE id = ?', args: [id] })
  return { ok: true }
}

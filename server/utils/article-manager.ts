import { createError } from 'h3'
import type { Client, Row } from '@libsql/client'
import { db, isUsingTurso } from './db'
import { normalizeLS } from './ls'
import { redact } from './redact'

export const ARTICLE_STATUSES = ['IDEA', 'DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'] as const
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]

export const SOURCE_TYPES = ['HUMAN', 'AI', 'HUMAN_AI'] as const
export type SourceType = (typeof SOURCE_TYPES)[number]

export const ARTICLE_FLOW: ArticleStatus[] = ['IDEA', 'DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED']

const ALLOWED_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  IDEA: ['DRAFT', 'ARCHIVED'],
  DRAFT: ['REVIEW', 'ARCHIVED'],
  REVIEW: ['APPROVED', 'DRAFT', 'ARCHIVED'],
  APPROVED: ['PUBLISHED', 'SCHEDULED', 'DRAFT', 'ARCHIVED'],
  PUBLISHED: ['SCHEDULED', 'DRAFT', 'ARCHIVED'],
  SCHEDULED: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
  ARCHIVED: ['IDEA', 'DRAFT']
}

const VALID_STATUS = new Set<string>(ARTICLE_STATUSES)
const VALID_SOURCE = new Set<string>(SOURCE_TYPES)

export interface LSPair {
  id: string
  en: string
}

export interface ArticleRecord {
  id: string
  slug: string
  title: LSPair
  excerpt: LSPair
  category: LSPair
  category_id: string
  tags: string[]
  thumbnail: string
  cover: string
  status: ArticleStatus
  source_type: SourceType
  author_id: string
  seoTitle: LSPair
  seoDescription: LSPair
  content: LSPair
  original_topic: string
  created_at: string
  updated_at: string
  published_at: string | null
  scheduled_at: string | null
}

export interface RevisionRecord {
  id: string
  article_id: string
  title: LSPair
  content: LSPair
  source_type: SourceType | ''
  changed_by: string
  change_summary: string
  created_at: string
}

// ---- test injection ------------------------------------------------------

let _override: Client | null = null

/** Hanya untuk test — mengarahkan client ke libSQL lokal/temp. */
export function __setDbForTest(c: Client | null) {
  _override = c
}

function client(): Client {
  if (_override) return _override
  if (!isUsingTurso()) {
    throw createError({ statusCode: 500, message: 'Relational article store memerlukan TURSO_DATABASE_URL' })
  }
  return db()
}

// ---- helpers -------------------------------------------------------------

function now() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function sv(v: unknown) {
  if (v === undefined || v === null) return ''
  return typeof v === 'string' ? v : JSON.stringify(v)
}

function lsJson(v: unknown): string {
  return JSON.stringify(normalizeLS(v))
}

function parseLs(raw: unknown): LSPair {
  try {
    const o = typeof raw === 'string' ? JSON.parse(raw) : raw
    return normalizeLS(o)
  } catch {
    return { id: '', en: '' }
  }
}

function parseTags(raw: unknown): string[] {
  try {
    const o = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (Array.isArray(o)) return o.map((x) => String(x)).filter(Boolean)
  } catch {
    /* fallthrough */
  }
  return []
}

function rowToArticle(row: Record<string, unknown>): ArticleRecord {
  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    title: parseLs(row.title),
    excerpt: parseLs(row.excerpt),
    category: { id: String(row.category_id ?? ''), en: '' },
    category_id: String(row.category_id ?? ''),
    tags: parseTags(row.tags),
    thumbnail: String(row.thumbnail ?? ''),
    cover: String(row.cover ?? ''),
    status: (VALID_STATUS.has(String(row.status)) ? String(row.status) : 'IDEA') as ArticleStatus,
    source_type: (VALID_SOURCE.has(String(row.source_type)) ? String(row.source_type) : 'HUMAN') as SourceType,
    author_id: String(row.author_id ?? ''),
    seoTitle: parseLs(row.seo_title),
    seoDescription: parseLs(row.seo_description),
    content: parseLs(row.content),
    original_topic: String(row.original_topic ?? ''),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
    published_at: (row.published_at as string | null) ?? null,
    scheduled_at: (row.scheduled_at as string | null) ?? null
  }
}

function isValidSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug)
}

// ---- normalization input ---------------------------------------------------

export interface ArticleInput {
  slug?: string
  title?: unknown
  excerpt?: unknown
  category?: unknown
  category_id?: unknown
  tags?: unknown
  thumbnail?: unknown
  cover?: unknown
  status?: unknown
  source_type?: unknown
  author_id?: unknown
  seoTitle?: unknown
  seoDescription?: unknown
  content?: unknown
  original_topic?: unknown
}

function normalizeInput(body: Record<string, unknown>): Required<Pick<ArticleInput, 'title' | 'excerpt' | 'category' | 'content'>> {
  return {
    title: normalizeLS(body.title),
    excerpt: normalizeLS(body.excerpt),
    category: normalizeLS(body.category),
    content: normalizeLS(body.content)
  }
}

// ---- validation of transitions --------------------------------------------

export function canTransition(from: ArticleStatus, to: ArticleStatus) {
  const allowed = ALLOWED_TRANSITIONS[from] ?? []
  return allowed.includes(to)
}

// ---- CRUD ------------------------------------------------------------------

export async function listArticles(filter?: { status?: ArticleStatus }): Promise<ArticleRecord[]> {
  const c = client()
  const cond: string[] = []
  const args: unknown[] = []
  if (filter?.status) {
    cond.push('status = ?')
    args.push(filter.status)
  }
  const where = cond.length ? ` WHERE ${cond.join(' AND ')}` : ''
  const res = await c.execute({
    sql: `SELECT * FROM articles${where} ORDER BY created_at DESC`,
    args
  })
  return (res.rows as Row[]).map((r) => rowToArticle(r as unknown as Record<string, unknown>))
}

export async function getArticleById(id: string): Promise<ArticleRecord> {
  const c = client()
  const res = await c.execute({ sql: 'SELECT * FROM articles WHERE id = ?', args: [id] })
  const row = res.rows[0]
  if (!row) throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan' })
  return rowToArticle(row as unknown as Record<string, unknown>)
}

export async function getArticleBySlug(slug: string): Promise<ArticleRecord> {
  if (!isValidSlug(slug)) throw createError({ statusCode: 400, message: 'Slug tidak valid' })
  const c = client()
  const res = await c.execute({ sql: 'SELECT * FROM articles WHERE slug = ?', args: [slug] })
  const row = res.rows[0]
  if (!row) throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan' })
  return rowToArticle(row as unknown as Record<string, unknown>)
}

export async function createArticle(
  body: Record<string, unknown>,
  actorType = 'SYSTEM',
  actorId = 'system'
): Promise<ArticleRecord> {
  const { title } = normalizeInput(body)
  if (!title.id) throw createError({ statusCode: 400, message: 'Judul wajib diisi' })

  let slug = String(body.slug ?? '').toLowerCase().trim()
  if (slug && !isValidSlug(slug)) throw createError({ statusCode: 400, message: 'Slug tidak valid' })
  if (!slug) {
    slug = title.id
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80)
  }
  if (!slug) slug = `artikel-${Date.now().toString(36)}`

  const c = client()
  const conflicting = await c.execute({ sql: 'SELECT id FROM articles WHERE slug = ?', args: [slug] })
  if (conflicting.rows.length) {
    throw createError({ statusCode: 409, message: 'Slug sudah digunakan' })
  }

  const status = VALID_STATUS.has(String(body.status)) ? String(body.status) : 'IDEA'
  const source = VALID_SOURCE.has(String(body.source_type)) ? String(body.source_type) : 'HUMAN'

  const id = uid('art')
  const ts = now()
  const parsed = normalizeInput(body)
  const categoryLs = normalizeLS(body.category)
  const publishedAt = status === 'PUBLISHED' ? ts : null

  await c.execute({
    sql: `INSERT INTO articles (
      id, title, slug, excerpt, content, thumbnail, category_id, tags,
      status, source_type, author_id, seo_title, seo_description,
      original_topic, created_at, updated_at, published_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      id,
      lsJson(parsed.title),
      slug,
      lsJson(parsed.excerpt),
      lsJson(parsed.content),
      String(body.thumbnail ?? ''),
      String(body.category_id ?? categoryLs.id ?? ''),
      JSON.stringify(Array.isArray(body.tags) ? body.tags.map(String) : []),
      status,
      source,
      String(body.author_id ?? ''),
      lsJson(normalizeLS(body.seoTitle)),
      lsJson(normalizeLS(body.seoDescription)),
      String(body.original_topic ?? ''),
      ts,
      ts,
      publishedAt
    ]
  })

  await logActivity(actorType, actorId, 'article.create', 'article', id, `Artikel '${title.id}' dibuat`)
  return getArticleById(id)
}

export async function updateArticle(
  id: string,
  body: Record<string, unknown>,
  actorType = 'SYSTEM',
  actorId = 'system',
  changeSummary = ''
): Promise<ArticleRecord> {
  const current = await getArticleById(id)
  const parsed = normalizeInput({ ...body })

  // Simpan snapshot sebelum update ke revision history (bila isi berubah)
  if (body.content !== undefined || body.title !== undefined || changeSummary) {
    await createRevision(id, {
      title: current.title,
      content: current.content,
      source_type: current.source_type,
      changed_by: actorId,
      change_summary: changeSummary || 'Artikel diperbarui'
    })
  }

  const nextSlug = String(body.slug ?? current.slug).toLowerCase().trim()
  if (nextSlug && !isValidSlug(nextSlug)) throw createError({ statusCode: 400, message: 'Slug tidak valid' })

  const c = client()
  if (nextSlug !== current.slug) {
    const conflicting = await c.execute({ sql: 'SELECT id FROM articles WHERE slug = ? AND id != ?', args: [nextSlug, id] })
    if (conflicting.rows.length) throw createError({ statusCode: 409, message: 'Slug sudah digunakan' })
  }

  const status = body.status !== undefined
    ? (VALID_STATUS.has(String(body.status)) ? String(body.status) : current.status)
    : current.status
  const source = body.source_type !== undefined
    ? (VALID_SOURCE.has(String(body.source_type)) ? String(body.source_type) : current.source_type)
    : current.source_type
  const publishedAt = current.published_at
  if (status === 'PUBLISHED' && !publishedAt) {
    await c.execute({ sql: 'UPDATE articles SET published_at = ? WHERE id = ?', args: [now(), id] })
  }

  const categoryLs = normalizeLS(body.category !== undefined ? body.category : { id: current.category_id })

  await c.execute({
    sql: `UPDATE articles SET
      slug = ?, title = ?, excerpt = ?, content = ?, thumbnail = ?,
      category_id = ?, tags = ?, status = ?, source_type = ?, author_id = ?,
      seo_title = ?, seo_description = ?, original_topic = ?, updated_at = ?
      WHERE id = ?`,
    args: [
      nextSlug,
      lsJson(parsed.title),
      lsJson(parsed.excerpt),
      lsJson(parsed.content),
      String(body.thumbnail ?? current.thumbnail),
      String(body.category_id ?? categoryLs.id ?? current.category_id),
      JSON.stringify(Array.isArray(body.tags) ? body.tags.map(String) : current.tags),
      status,
      source,
      String(body.author_id ?? current.author_id),
      lsJson(normalizeLS(body.seoTitle ?? current.seoTitle)),
      lsJson(normalizeLS(body.seoDescription ?? current.seoDescription)),
      String(body.original_topic ?? current.original_topic),
      now(),
      id
    ]
  })

  await logActivity(actorType, actorId, 'article.update', 'article', id, `Artikel '${parsed.title.id}' diperbarui`)
  return getArticleById(id)
}

export async function deleteArticle(id: string, actorType = 'SYSTEM', actorId = 'system') {
  const current = await getArticleById(id)
  const c = client()
  await c.execute({ sql: 'DELETE FROM articles WHERE id = ?', args: [id] })
  await logActivity(actorType, actorId, 'article.delete', 'article', id, `Artikel '${current.title.id}' dihapus`)
  return { ok: true }
}

// ---- status transition ------------------------------------------------------

export async function transitionStatus(
  id: string,
  toStatus: ArticleStatus,
  actorType = 'SYSTEM',
  actorId = 'system',
  note = ''
) {
  const current = await getArticleById(id)
  if (!VALID_STATUS.has(toStatus)) throw createError({ statusCode: 400, message: 'Status tidak valid' })
  if (toStatus === current.status) return current
  if (!canTransition(current.status, toStatus)) {
    throw createError({
      statusCode: 422,
      message: `Transisi tidak diizinkan: ${current.status} → ${toStatus}`
    })
  }

  const c = client()
  await createRevision(id, {
    title: current.title,
    content: current.content,
    source_type: current.source_type,
    changed_by: actorId,
    change_summary: note || `Status berubah ${current.status} → ${toStatus}`
  })

  let publishedAt = current.published_at
  if (toStatus === 'PUBLISHED' && !publishedAt) {
    publishedAt = now()
  }

  await c.execute({
    sql: 'UPDATE articles SET status = ?, published_at = ?, updated_at = ? WHERE id = ?',
    args: [toStatus, toStatus === 'PUBLISHED' ? publishedAt : current.published_at, now(), id]
  })

  await logActivity(actorType, actorId, 'article.status', 'article', id, `Status ${current.status} → ${toStatus}`)
  return getArticleById(id)
}

// ---- schedule ---------------------------------------------------------------

/**
 * Menjadwalkan publikasi. Hanya dari status APPROVED (atau SCHEDULED), required `when` (ISO).
 */
export async function scheduleArticle(
  id: string,
  when: string,
  actorType = 'SYSTEM',
  actorId = 'system'
): Promise<ArticleRecord> {
  const date = new Date(when)
  if (Number.isNaN(date.getTime())) {
    throw createError({ statusCode: 400, message: 'Waktu jadwal tidak valid' })
  }
  const current = await getArticleById(id)
  if (!['APPROVED', 'SCHEDULED'].includes(current.status)) {
    throw createError({ statusCode: 422, message: `Status ${current.status} tidak bisa dijadwalkan` })
  }
  if (current.status !== 'SCHEDULED') {
    await transitionStatus(id, 'SCHEDULED', actorType, actorId, `dijadwalkan ${date.toISOString()}`)
  }
  const c = client()
  await c.execute({
    sql: 'UPDATE articles SET scheduled_at = ?, updated_at = ? WHERE id = ?',
    args: [date.toISOString(), now(), id]
  })
  await logActivity(actorType, actorId, 'article.schedule', 'article', id, `Dijadwalkan ${date.toISOString()}`)
  return getArticleById(id)
}

/** Mencari artikel SCHEDULED yang waktunya sudah tiba untuk dipublikasikan. */
export async function listDueScheduled(nowIso?: string): Promise<ArticleRecord[]> {
  const c = client()
  const ts = nowIso ?? now()
  const res = await c.execute({
    sql: `SELECT * FROM articles WHERE status = 'SCHEDULED' AND scheduled_at IS NOT NULL AND scheduled_at <= ? ORDER BY scheduled_at ASC`,
    args: [ts]
  })
  return (res.rows as Row[]).map((r) => rowToArticle(r as unknown as Record<string, unknown>))
}

// ---- revision history -------------------------------------------------------

export async function createRevision(
  articleId: string,
  opts: { title: LSPair; content: LSPair; source_type: SourceType | string; changed_by: string; change_summary: string }
) {
  const c = client()
  const id = uid('rev')
  await c.execute({
    sql: `INSERT INTO article_revisions (id, article_id, title, content, source_type, changed_by, change_summary, created_at)
      VALUES (?,?,?,?,?,?,?,?)`,
    args: [
      id,
      articleId,
      JSON.stringify(opts.title),
      JSON.stringify(opts.content),
      String(opts.source_type),
      String(opts.changed_by),
      String(opts.change_summary),
      now()
    ]
  })
  return id
}

export async function listRevisions(articleId: string): Promise<RevisionRecord[]> {
  const c = client()
  const res = await c.execute({
    sql: 'SELECT * FROM article_revisions WHERE article_id = ? ORDER BY created_at DESC',
    args: [articleId]
  })
  return (res.rows as Row[]).map((r) => {
    const row = r as unknown as Record<string, unknown>
    return {
      id: String(row.id ?? ''),
      article_id: String(row.article_id ?? ''),
      title: parseLs(row.title),
      content: parseLs(row.content),
      source_type: (VALID_SOURCE.has(String(row.source_type)) ? String(row.source_type) : '') as SourceType | '',
      changed_by: String(row.changed_by ?? ''),
      change_summary: String(row.change_summary ?? ''),
      created_at: String(row.created_at ?? '')
    }
  })
}

export async function restoreRevision(
  articleId: string,
  revisionId: string,
  actorType = 'SYSTEM',
  actorId = 'system'
): Promise<ArticleRecord> {
  const current = await getArticleById(articleId)
  const c = client()
  const res = await c.execute({
    sql: 'SELECT * FROM article_revisions WHERE id = ? AND article_id = ?',
    args: [revisionId, articleId]
  })
  const row = res.rows[0]
  if (!row) throw createError({ statusCode: 404, message: 'Revisi tidak ditemukan' })

  const rev = row as unknown as Record<string, unknown>
  const title = parseLs(rev.title)
  const content = parseLs(rev.content)

  // Snapshot kondisi sekarang sebelum restore, agar tetap bisa di-revert
  await createRevision(articleId, {
    title: current.title,
    content: current.content,
    source_type: current.source_type,
    changed_by: actorId,
    change_summary: 'Snapshot sebelum restore'
  })

  await c.execute({
    sql: 'UPDATE articles SET title = ?, content = ?, updated_at = ? WHERE id = ?',
    args: [JSON.stringify(title), JSON.stringify(content), now(), articleId]
  })

  await logActivity(actorType, actorId, 'article.restore', 'article', articleId, `Artikel dipulihkan dari revisi ${revisionId}`)
  return getArticleById(articleId)
}

// ---- activity log -----------------------------------------------------------

export async function logActivity(
  actorType: string,
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  summary = '',
  metadata: unknown = {}
) {
  const c = client()
  await c.execute({
    sql: `INSERT INTO activity_logs (actor_type, actor_id, action, entity, entity_id, summary, metadata, created_at)
      VALUES (?,?,?,?,?,?,?,?)`,
    args: [String(actorType), String(actorId), String(action), String(entity), String(entityId), redact(summary), redact(JSON.stringify(metadata ?? {})), now()]
  })
}

export async function listActivity(limit = 50) {
  const c = client()
  const res = await c.execute({ sql: 'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?', args: [limit] })
  return (res.rows as Row[]).map((r) => {
    const row = r as unknown as Record<string, unknown>
    return {
      id: Number(row.id),
      actor_type: String(row.actor_type ?? ''),
      actor_id: String(row.actor_id ?? ''),
      action: String(row.action ?? ''),
      entity: String(row.entity ?? ''),
      entity_id: String(row.entity_id ?? ''),
      summary: String(row.summary ?? ''),
      metadata: String(row.metadata ?? '{}'),
      created_at: String(row.created_at ?? '')
    }
  })
}

export { sv }

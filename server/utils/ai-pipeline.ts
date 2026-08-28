import { createError } from 'h3'
import type { Client, Row } from '@libsql/client'
import { db, ensureSchema } from './db'
import * as articleManager from './article-manager'
import * as identity from './telegram-identity'
import { generateContent } from './ai'
import { PERMISSIONS, type Permission } from './permissions'
import type { ArticleRecord, LSPair } from './article-manager'

export const ALLOWLISTED_TOOLS = [
  'createArticle',
  'getArticle',
  'getArticleBySlug',
  'updateArticle',
  'saveDraft',
  'publishArticle',
  'unpublishArticle',
  'deleteArticle',
  'scheduleArticle',
  'generateOutline',
  'generateArticle',
  'expandIdea',
  'rewriteArticle',
  'improveWriting',
  'generateSEO',
  'generateExcerpt',
  'getActivity',
  'getStatistics'
] as const

export type ToolName = (typeof ALLOWLISTED_TOOLS)[number]

export const MODES = ['HUMAN', 'AI', 'HUMAN_AI'] as const
export type WritingMode = (typeof MODES)[number]

export const READY_CHECKLIST = [
  { key: 'title_filled', label: 'Judul terisi (ID)', required: true },
  { key: 'content_length', label: 'Konten substansial (min 600 kata)', required: true },
  { key: 'excerpt_filled', label: 'Excerpt/ringkasan terisi', required: false },
  { key: 'seo_present', label: 'SEO title & description', required: false },
  { key: 'category_set', label: 'Kategori ditetapkan', required: false },
  { key: 'tags_present', label: 'Tag tersedia', required: false }
] as const

export interface PipelineRow {
  id: string
  article_id: string
  mode: string
  original_input: string
  research: string
  outline: string
  ai_draft: string
  final_content: string
  checklist: string
  ai_feedback: string
  review_iterations: number
  status: string
  created_at: string
  updated_at: string
}

// ---- db client (mirroring article-manager pattern) ------------------------

let _override: Client | null = null

export function __setAiPipelineDbForTest(c: Client | null) {
  _override = c
}

function conn() {
  return _override ?? db()
}

function uid(prefix = 'pl') {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now() {
  return new Date().toISOString()
}

function normalizeLs(v: unknown): LSPair {
  if (typeof v === 'string') {
    try {
      return JSON.parse(v)
    } catch {
      return { id: v, en: '' }
    }
  }
  const o = (v || {}) as Record<string, any>
  return { id: String(o.id ?? ''), en: String(o.en ?? '') }
}

function normalizeGenerated(g: Record<string, any>, fallback: string) {
  const slug = String(g.slug || fallback.split(' ').slice(0, 4).join(' '))
    .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
  return {
    slug: slug || `artikel-${Date.now().toString(36)}`,
    title: { id: String(g.title_id || fallback), en: String(g.title_en || fallback) },
    excerpt: { id: String(g.excerpt_id || ''), en: String(g.excerpt_en || '') },
    content: { id: String(g.content_id || ''), en: String(g.content_en || '') },
    category: String(g.category_id || 'Catatan'),
    tags: Array.isArray(g.tags) ? g.tags.map(String).slice(0, 8) : []
  }
}

// ---- pipeline store (traceability) ---------------------------------------

async function savePipeline(p: {
  articleId: string
  mode: string
  originalInput: string
  research: string
  outline: string
  aiDraft: string
  finalContent: string
  checklist: string
  aiFeedback: string
  reviewIterations: number
}): Promise<string> {
  await ensureSchema()
  const id = uid()
  const ts = now()
  await conn().execute({
    sql: `INSERT INTO article_pipeline
      (id, article_id, mode, original_input, research, outline, ai_draft, final_content, checklist, ai_feedback, review_iterations, status, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [id, p.articleId, p.mode, p.originalInput, p.research, p.outline, p.aiDraft, p.finalContent, p.checklist, p.aiFeedback, p.reviewIterations, 'IN_PROGRESS', ts, ts]
  })
  return id
}

async function recordPipelineInput(articleId: string, mode: string, originalInput: string, ctx: ActorContext) {
  await ensureSchema()
  const existing = await conn().execute({ sql: 'SELECT id FROM article_pipeline WHERE article_id = ?', args: [articleId] })
  const ts = now()
  if (existing.rows[0]) {
    await conn().execute({
      sql: `UPDATE article_pipeline SET original_input = ?, mode = ?, updated_at = ? WHERE article_id = ?`,
      args: [originalInput, mode, ts, articleId]
    })
  } else {
    await conn().execute({
      sql: `INSERT INTO article_pipeline
        (id, article_id, mode, original_input, research, outline, ai_draft, final_content, checklist, ai_feedback, review_iterations, status, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [uid(), articleId, mode, originalInput, '', '', '', '', '{}', '', 0, 'IN_PROGRESS', ts, ts]
    })
  }
}

async function savePipelineFeedback(articleId: string, feedback: string, iterations: number) {
  await ensureSchema()
  await conn().execute({
    sql: `UPDATE article_pipeline SET ai_feedback = ?, review_iterations = ?, status = 'REVIEW', updated_at = ? WHERE article_id = ?`,
    args: [feedback, iterations, now(), articleId]
  })
}

async function savePipelineApproval(articleId: string) {
  await ensureSchema()
  await conn().execute({
    sql: `UPDATE article_pipeline SET status = 'APPROVED', updated_at = ? WHERE article_id = ?`,
    args: [now(), articleId]
  })
}

export async function getPipelineByArticleId(articleId: string): Promise<PipelineRow | null> {
  await ensureSchema()
  const res = await conn().execute({ sql: `SELECT * FROM article_pipeline WHERE article_id = ? ORDER BY updated_at DESC LIMIT 1`, args: [articleId] })
  const row = res.rows[0] as unknown as Record<string, unknown> | undefined
  if (!row) return null
  return {
    id: String(row.id ?? ''),
    article_id: String(row.article_id ?? ''),
    mode: String(row.mode ?? 'AI'),
    original_input: String(row.original_input ?? ''),
    research: String(row.research ?? ''),
    outline: String(row.outline ?? ''),
    ai_draft: String(row.ai_draft ?? ''),
    final_content: String(row.final_content ?? ''),
    checklist: String(row.checklist ?? '{}'),
    ai_feedback: String(row.ai_feedback ?? ''),
    review_iterations: Number(row.review_iterations ?? 0),
    status: String(row.status ?? 'DRAFT'),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? '')
  }
}

// ---- actor / auth helpers -------------------------------------------------

interface ActorContext {
  ctx?: identity.UserContext
}

function requireActor(ctx: ActorContext): { actorType: string; actorId: string } {
  const u = ctx?.ctx
  return {
    actorType: u?.telegramUserId ? 'telegram' : 'API',
    actorId: u?.telegramUserId || u?.username || 'api-user'
  }
}

function assertPermission(ctx: ActorContext, perm: Permission) {
  const u = ctx?.ctx
  if (!u) return
  if (!u.isWhitelisted) throw createError({ statusCode: 403, message: 'Akses ditolak: identity tidak terdaftar' })
  const allow = u.permissions.includes(perm) || u.permissions.includes(PERMISSIONS.ADMIN_READ)
  if (!allow) throw createError({ statusCode: 403, message: `Akses ditolak: butuh permission ${perm}` })
}

async function audit(tool: string, request: string, status: 'success' | 'failed', actorId: string) {
  try {
    await identity.logAgentRun(request, `ai.${tool}`, status, actorId || 'ai-agent')
  } catch {
    // audit tidak boleh menggagalkan operasi utama
  }
}

// ---------------------------------------------------------------------------
// Allowlisted tools dispatcher
// ---------------------------------------------------------------------------

export async function runTool(toolName: string, args: Record<string, unknown>, ctx: ActorContext): Promise<unknown> {
  if (!(ALLOWLISTED_TOOLS as readonly string[]).includes(toolName)) {
    throw createError({ statusCode: 403, message: `Tool tidak di-allowlist: ${toolName}` })
  }
  const actor = requireActor(ctx)
  try {
    const result = await dispatch(toolName as ToolName, args, ctx)
    await audit(toolName, JSON.stringify(args || {}), 'success', actor.actorId)
    return result
  } catch (e: unknown) {
    await audit(toolName, JSON.stringify(args || {}), 'failed', actor.actorId)
    throw e
  }
}

async function dispatch(toolName: ToolName, args: Record<string, unknown>, ctx: ActorContext): Promise<unknown> {
  const a = articleManager
  const actor = requireActor(ctx)

  switch (toolName) {
    case 'createArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_WRITE)
      return a.createArticle({ ...(args as Record<string, unknown>), status: 'DRAFT' }, 'AI', actor.actorId)
    }
    case 'getArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_READ)
      return a.getArticleById(String(args.id ?? args.articleId ?? ''))
    }
    case 'getArticleBySlug': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_READ)
      return a.getArticleBySlug(String(args.slug ?? args.id ?? ''))
    }
    case 'updateArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_WRITE)
      const id = String(args.id ?? args.articleId ?? '')
      return a.updateArticle(id, (args.body ?? args) as Record<string, unknown>, actor.actorType, actor.actorId, String(args.note ?? 'update'))
    }
    case 'saveDraft': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_WRITE)
      const id = String(args.id ?? args.articleId ?? '')
      const current = await a.getArticleById(id)
      if (current.status === 'PUBLISHED') throw createError({ statusCode: 422, message: 'Artikel sudah terbit; gunakan revision, bukan saveDraft' })
      return a.updateArticle(id, (args.body ?? args) as Record<string, unknown>, actor.actorType, actor.actorId, String(args.note ?? 'save draft'))
    }
    case 'publishArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_PUBLISH)
      return a.transitionStatus(String(args.id ?? args.articleId ?? ''), 'PUBLISHED', actor.actorType, actor.actorId, 'publish via ai-tool')
    }
    case 'unpublishArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_PUBLISH)
      const id = String(args.id ?? args.articleId ?? '')
      const current = await a.getArticleById(id)
      return a.transitionStatus(id, current.status === 'PUBLISHED' ? 'APPROVED' : current.status, actor.actorType, actor.actorId, 'unpublish via ai-tool')
    }
    case 'deleteArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_DELETE)
      return a.deleteArticle(String(args.id ?? args.articleId ?? ''), actor.actorType, actor.actorId)
    }
    case 'scheduleArticle': {
      assertPermission(ctx, PERMISSIONS.ARTICLE_PUBLISH)
      return a.transitionStatus(String(args.id ?? args.articleId ?? ''), 'SCHEDULED', actor.actorType, actor.actorId, String(args.note ?? 'schedule'))
    }
    case 'generateOutline':
    case 'generateArticle':
    case 'expandIdea':
    case 'rewriteArticle':
    case 'improveWriting':
    case 'generateSEO':
    case 'generateExcerpt': {
      const topic = String(args.topic ?? args.title ?? args.idea ?? args.content ?? '')
      if (!topic) throw createError({ statusCode: 400, message: 'tool ini butuh argumen topic/title/idea/content' })
      return runAIMode(topic, ctx, { mode: toolName })
    }
    case 'getActivity': {
      assertPermission(ctx, PERMISSIONS.MONITORING_READ)
      return a.listActivity(Number(args.limit ?? 30))
    }
    case 'getStatistics': {
      assertPermission(ctx, PERMISSIONS.ADMIN_READ)
      const arts = await a.listArticles({})
      return {
        total: arts.length,
        by_status: arts.reduce((acc, x) => ((acc[x.status] = (acc[x.status] || 0) + 1), acc), {} as Record<string, number>),
        by_source: arts.reduce((acc, x) => ((acc[x.source_type] = (acc[x.source_type] || 0) + 1), acc), {} as Record<string, number>)
      }
    }
    default:
      throw createError({ statusCode: 400, message: `Tool tidak dikenal: ${toolName}` })
  }
}

// ---------------------------------------------------------------------------
// Writing modes (PRD Section 7)
// ---------------------------------------------------------------------------

const WRITE_SYSTEM = `Kamu adalah penulis teknis blog CehaDev. Buat artikel lengkap dua bahasa (Indonesia & Inggris) dalam JSON valid tanpa komentar/markdown fence:
{
  "slug":"<slug-en a-z0-9-dash>",
  "title_id":"...","title_en":"...",
  "excerpt_id":"...","excerpt_en":"...",
  "category_id":"Catatan","category_en":"Notes",
  "tags":["..."],
  "content_id":"<konten markdown ID>","content_en":"<konten markdown EN>"
}
Konten min ~600 kata per bahasa, markdown (##, list, code block). Jangan auto-publish. Tanpa komentar.`

export async function runAIMode(topic: string, ctx: ActorContext, opts: { mode?: ToolName; articleId?: string } = {}): Promise<ArticleRecord> {
  const a = articleManager
  const actor = requireActor(ctx)
  const g = await generateContent({ system: WRITE_SYSTEM, prompt: `Buatkan artikel lengkap dua bahasa (Indonesia & Inggris) tentang:\n\n"${topic}"`, json: true })
  const data = (g.json || {}) as Record<string, any>
  const out = normalizeGenerated(data, topic)
  const body = {
    slug: out.slug,
    title: out.title,
    excerpt: out.excerpt,
    content: out.content,
    category_id: out.category,
    tags: out.tags,
    original_topic: topic,
    status: 'DRAFT',
    source_type: 'AI'
  }
  if (opts.articleId) {
    await a.updateArticle(opts.articleId, body, actor.actorType, actor.actorId, 'AI draft')
    return a.getArticleById(opts.articleId)
  }
  return a.createArticle(body, sourceForMode(opts.mode), actor.actorId)
}

function sourceForMode(mode?: ToolName): ArticleRecord['source_type'] {
  if (mode === 'generateArticle' || mode === 'generateOutline' || mode === 'expandIdea' || mode === 'rewriteArticle' || mode === 'improveWriting' || mode === 'generateSEO' || mode === 'generateExcerpt') return 'AI'
  return 'AI'
}

export async function runHumanMode(
  input: { title: LSPair; content: LSPair; excerpt?: LSPair; slug?: string; category?: string; tags?: string[] },
  ctx: ActorContext
): Promise<ArticleRecord> {
  const a = articleManager
  const actor = requireActor(ctx)
  return a.createArticle(
    {
      slug: input.slug,
      title: input.title,
      content: input.content,
      excerpt: input.excerpt ?? { id: '', en: '' },
      category_id: input.category ?? '',
      tags: input.tags ?? [],
      source_type: 'HUMAN'
    },
    'HUMAN',
    actor.actorId
  )
}

export async function runHumanAIMode(originalInput: string, ctx: ActorContext): Promise<ArticleRecord> {
  const a = articleManager
  const actor = requireActor(ctx)
  const art = await runAIMode(originalInput, ctx)
  await identity.logAgentRun(originalInput, 'ai.human_ai', 'success', actor.actorId)
  await recordPipelineInput(art.id, 'HUMAN_AI', originalInput, ctx)
  return art
}

// ---------------------------------------------------------------------------
// Pipeline genesis — single entry: research → outline → draft → review
// ---------------------------------------------------------------------------

export async function generateArticlePipeline(
  ideaOrTopic: string,
  ctx: ActorContext,
  opts: { mode?: WritingMode; outline?: string; articleId?: string } = {}
): Promise<{ article: ArticleRecord; pipelineId: string }> {
  const mode = opts.mode || 'AI'
  const actor = requireActor(ctx)
  const topic = ideaOrTopic.trim()
  if (!topic) throw createError({ statusCode: 400, message: 'Topik/ide wajib diisi' })

  let article: ArticleRecord
  if (opts.articleId) {
    article = await articleManager.getArticleById(opts.articleId)
  } else {
    article = await runAIMode(topic, ctx)
  }
  const articleId = article.id

  // Step 1: research
  let research = ''
  if (mode !== 'HUMAN') {
    const r = await generateContent({
      system: 'Kamu adalah peneliti konten. Buat catatan riset ringkas JSON {research:string} untuk artikel tentang topik yang diberikan.',
      prompt: `Topik: "${topic}"`,
      json: true
    })
    research = String((r.json as Record<string, any>)?.research ?? '')
  }

  // Step 2: outline
  const outline = opts.outline || (mode !== 'HUMAN' ? await generateOutlineFor(topic) : '')

  // Step 3: draft sesuai outline
  if (mode !== 'HUMAN' && outline) {
    const content = await redraftWithOutline(articleId, outline, topic)
    await articleManager.updateArticle(articleId, { content: { id: content, en: article.content.en } }, actor.actorType, actor.actorId, 'regenerate content from outline')
    article = await articleManager.getArticleById(articleId)
  }

  // Step 4: AI review loop (only for AI/HUMAN_AI)
  const iterations = mode === 'HUMAN' ? 0 : await aiReviewLoop(articleId, ctx, { maxIters: 2 })

  // Step 5: ready-to-publish checklist
  const checklist = await readyToPublishChecklist(articleId, ctx)

  // Step 6: simpan traceability
  const pipelineId = await savePipeline({
    articleId,
    mode,
    originalInput: topic,
    research,
    outline,
    aiDraft: JSON.stringify(article.content),
    finalContent: '',
    checklist: JSON.stringify(checklist),
    aiFeedback: '',
    reviewIterations: iterations
  })

  // Human-in-the-loop: berakhir di REVIEW, menunggu approval manual. Tidak auto-publish.
  const cur = await articleManager.getArticleById(articleId)
  if (promoteToReview(cur.status)) {
    await articleManager.transitionStatus(articleId, 'REVIEW', actor.actorType, actor.actorId, 'pipeline menunggu approval')
  }

  return { article: await articleManager.getArticleById(articleId), pipelineId }
}

function promoteToReview(status: string): boolean {
  return status === 'DRAFT' || status === 'IDEA' || status === 'APPROVED'
}

async function generateOutlineFor(topic: string): Promise<string> {
  const r = await generateContent({
    system: 'Kamu adalah editor. Buat outline artikel JSON {outline:string} (susunan judul bagian, dipisah baris baru) untuk topik yang diberikan. Bahasa Indonesia.',
    prompt: `Topik: "${topic}"`,
    json: true
  })
  return String((r.json as Record<string, any>)?.outline ?? '')
}

async function redraftWithOutline(articleId: string, outline: string, topic: string): Promise<string> {
  const r = await generateContent({
    system: 'Tulis konten artikel markdown bahasa Indonesia berdasarkan outline. Kembalikan JSON {content:string}.',
    prompt: `Topik: "${topic}"\n\nOutline:\n${outline}`,
    json: true
  })
  return String((r.json as Record<string, any>)?.content ?? '')
}

export async function aiReviewLoop(articleId: string, ctx: ActorContext, opts: { maxIters?: number } = {}): Promise<number> {
  const a = articleManager
  const maxIters = opts.maxIters ?? 2
  let iters = 0
  let article = await a.getArticleById(articleId)
  for (let i = 0; i < maxIters; i++) {
    const content = normalizeLs(article.content).id
    const review = await generateContent({
      system: 'Kamu adalah reviewer artikel. Beri feedback ringkas dan perbaiki bila perlu. Kembalikan JSON {pass:boolean, feedback:string, content?:string}.',
      prompt: `Tinjau artikel berikut. Jika ada masalah besar, berikan content revisi.\n\n${content.slice(0, 4000)}`,
      json: true
    })
    const r = (review.json || {}) as Record<string, any>
    iters++
    if (r.pass === true || !r.content) break
    const cur = await a.getArticleById(articleId)
    const newContent = { ...normalizeLs(cur.content), id: String(r.content) }
    await a.createRevision(articleId, {
      title: normalizeLs(cur.title),
      content: normalizeLs(cur.content),
      source_type: 'AI',
      changed_by: 'ai-review-loop',
      change_summary: `AI review iterasi ${iters}`
    })
    await a.updateArticle(articleId, { content: newContent }, 'AI', 'ai-review-loop', `AI review iteration ${iters}`)
    article = await a.getArticleById(articleId)
    if (i === maxIters - 1) {
      const feedback = String(r.feedback ?? '')
      if (feedback) await savePipelineFeedback(articleId, feedback, iters)
    }
  }
  return iters
}

export async function readyToPublishChecklist(articleId: string, ctx: ActorContext): Promise<Array<{ key: string; label: string; required: boolean; ok: boolean; note: string }>> {
  const a = articleManager
  const article = await a.getArticleById(articleId)
  const title = normalizeLs(article.title)
  const content = normalizeLs(article.content)
  const excerpt = normalizeLs(article.excerpt)
  const seoTitle = normalizeLs(article.seo_title)
  const seoDesc = normalizeLs(article.seo_description)
  const contentLen = `${content.id} ${content.en}`.length
  return READY_CHECKLIST.map((c) => {
    let ok = false
    let note = ''
    switch (c.key) {
      case 'title_filled': ok = Boolean(title.id.trim()); note = title.id ? 'ok' : 'judul ID kosong'; break
      case 'content_length': ok = contentLen >= 600; note = `${contentLen} karakter`; break
      case 'excerpt_filled': ok = Boolean(excerpt.id.trim()); note = excerpt.id ? 'ok' : 'belum ada'; break
      case 'seo_present': ok = Boolean(seoTitle.id.trim() && seoDesc.id.trim()); note = seoTitle.id && seoDesc.id ? 'ok' : 'belum lengkap'; break
      case 'category_set': ok = Boolean(article.category_id); note = article.category_id || 'belum set'; break
      case 'tags_present': ok = Array.isArray(article.tags) && article.tags.length > 0; note = Array.isArray(article.tags) ? `${article.tags.length} tag` : 'belum ada'; break
    }
    return { key: c.key, label: c.label, required: c.required, ok, note }
  })
}

// ---------------------------------------------------------------------------
// Human-in-the-loop approval
// ---------------------------------------------------------------------------

export async function humanApproveArticle(articleId: string, ctx: ActorContext): Promise<ArticleRecord> {
  const a = articleManager
  assertPermission(ctx, PERMISSIONS.ARTICLE_PUBLISH)
  const actor = requireActor(ctx)
  const cur = await a.getArticleById(articleId)
  if (!['DRAFT', 'REVIEW'].includes(cur.status)) throw createError({ statusCode: 422, message: `Status ${cur.status} tidak bisa di-approve` })
  const res = await a.transitionStatus(articleId, 'APPROVED', actor.actorType, actor.actorId, 'human approval')
  await savePipelineApproval(articleId)
  return res
}

export async function getStatistics(ctx: ActorContext) {
  const arts = await articleManager.listArticles({})
  return {
    total: arts.length,
    by_status: arts.reduce((acc, x) => ((acc[x.status] = (acc[x.status] || 0) + 1), acc), {} as Record<string, number>),
    by_source: arts.reduce((acc, x) => ((acc[x.source_type] = (acc[x.source_type] || 0) + 1), acc), {} as Record<string, number>)
  }
}

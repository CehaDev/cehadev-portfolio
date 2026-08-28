import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const body = await readBody<Record<string, unknown>>(event).catch(() => ({}))
  const revisionId = String(body.revisionId ?? '')
  if (!revisionId) throw createError({ statusCode: 400, message: 'revisionId wajib diisi' })

  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan' })

  const restored = await restoreRevision(article.id, revisionId, 'ADMIN', 'admin')
  return { ok: true, article: restored }
})

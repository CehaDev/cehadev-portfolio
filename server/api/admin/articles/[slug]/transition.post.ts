import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const body = await readBody<Record<string, unknown>>(event).catch(() => ({}))
  const toStatus = String(body.toStatus ?? '')
  if (!(ARTICLE_STATUSES as readonly string[]).includes(toStatus)) {
    throw createError({ statusCode: 400, message: 'toStatus tidak valid' })
  }
  const article = await getArticleBySlug(slug)
  const updated = await transitionStatus(
    article.id,
    toStatus as Extract<(typeof ARTICLE_STATUSES)[number], string>,
    'ADMIN',
    'admin',
    String(body.note ?? '')
  )
  return { ok: true, article: updated }
})

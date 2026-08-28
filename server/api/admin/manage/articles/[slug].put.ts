export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const body = await readBody<Record<string, unknown>>(event)
  const article = await getArticleBySlug(slug)
  const updated = await updateArticle(
    article.id,
    { ...body, slug: String(body.slug ?? slug) },
    'ADMIN',
    'admin',
    String(body.changeSummary ?? '')
  )
  return { ok: true, article: updated }
})

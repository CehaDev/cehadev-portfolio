export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const article = await getArticleBySlug(slug)
  await deleteArticle(article.id, 'ADMIN', 'admin')
  return { ok: true }
})

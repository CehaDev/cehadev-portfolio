import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan' })
  return listRevisions(article.id)
})

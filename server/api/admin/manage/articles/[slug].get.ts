import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  try {
    return await getArticleBySlug(slug)
  } catch {
    throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan' })
  }
})

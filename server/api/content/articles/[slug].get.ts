import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const article = await readArticleFile(slug)
  if ((article as { status?: string }).status === 'draft') {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }
  return article
})

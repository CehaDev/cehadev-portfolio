import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const body = await readBody<Record<string, unknown>>(event)
  const article = normalizeArticle({ ...body, slug: body.slug ?? slug })
  if (!article.title.id) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi' })
  }
  if (article.slug !== slug) {
    try {
      await readArticleFile(article.slug)
      throw createError({ statusCode: 409, statusMessage: 'Slug sudah digunakan' })
    } catch (e: unknown) {
      const err = e as { statusCode?: number }
      if (err.statusCode !== 404) throw e
    }
    await deleteArticleFile(slug)
  }
  await writeArticleFile(article.slug, article)
  return { ok: true, article }
})

import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const article = normalizeArticle(body)
  if (!article.slug || !article.title.id) {
    throw createError({ statusCode: 400, statusMessage: 'Slug dan judul wajib diisi' })
  }
  try {
    await readArticleFile(article.slug)
    throw createError({ statusCode: 409, statusMessage: 'Slug sudah digunakan' })
  } catch (e: unknown) {
    const err = e as { statusCode?: number }
    if (err.statusCode !== 404) throw e
  }
  await writeArticleFile(article.slug, article)
  return { ok: true, article }
})

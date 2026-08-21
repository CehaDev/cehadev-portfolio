export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  await deleteArticleFile(slug)
  return { ok: true }
})

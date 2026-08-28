export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status ? String(query.status) : undefined
  const articles = await listArticles(status ? { status: status as never } : undefined)
  return articles
})

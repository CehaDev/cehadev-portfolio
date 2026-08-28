export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status ? String(query.status) : undefined
  return listIdeas(status ? { status: status as never } : undefined)
})

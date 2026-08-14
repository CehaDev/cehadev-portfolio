export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id') ?? ''
  await deleteConversation(id)
  return { ok: true }
})

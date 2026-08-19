export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  await deleteConversation(id)
  return { ok: true }
})

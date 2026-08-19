export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const body = await readBody<{ status?: string }>(event)
  const status = body.status === 'resolved' ? 'resolved' : 'open'
  return await setConversationStatus(id, status)
})

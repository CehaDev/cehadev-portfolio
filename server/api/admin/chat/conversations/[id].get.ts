export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const conv = await getConversation(id)
  await markConversationRead(id)
  return conv
})

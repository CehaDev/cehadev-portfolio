export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const body = await readBody<{ text?: string }>(event)
  const { reply } = await addMessageReply(id, typeof body.text === 'string' ? body.text : '')
  return { reply }
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const body = await readBody<{ text?: string }>(event)
  const { message } = await addAdminReply(id, typeof body.text === 'string' ? body.text : '')
  return { message }
})

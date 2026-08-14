export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id') ?? ''
  const msg = await getMessage(id)
  await markMessageRead(id)
  return msg
})

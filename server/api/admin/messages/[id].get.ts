export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const msg = await getMessage(id)
  await markMessageRead(id)
  return msg
})

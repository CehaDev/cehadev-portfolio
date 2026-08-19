export default defineEventHandler(async (event) => {
  const body = await readBody<{ enabled?: boolean }>(event)
  return await setChatEnabled(body.enabled === true)
})

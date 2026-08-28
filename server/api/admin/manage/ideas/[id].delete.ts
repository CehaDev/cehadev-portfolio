export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  await deleteIdea(id)
  return { ok: true }
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const body = await readBody<Record<string, unknown>>(event)
  const idea = await updateIdea(id, body)
  return { ok: true, idea }
})

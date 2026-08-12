export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const slug = getRouterParam(event, 'slug') ?? ''
  await deleteProjectFile(slug)
  return { ok: true }
})

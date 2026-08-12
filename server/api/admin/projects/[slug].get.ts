export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const slug = getRouterParam(event, 'slug') ?? ''
  return await readProjectFile(slug)
})

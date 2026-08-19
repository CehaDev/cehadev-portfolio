export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const { permanent, restore } = getQuery(event)

  if (permanent === 'true') {
    await deleteProjectFile(slug)
    return { ok: true }
  }

  const data = await readProjectFile(slug)
  await writeProjectFile(slug, { ...data, archived: restore !== 'true' })
  return { ok: true }
})

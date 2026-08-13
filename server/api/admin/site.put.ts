export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody<Record<string, unknown>>(event)
  const site = normalizeSite(body)
  await writeSiteFile(site)
  return { ok: true, site }
})

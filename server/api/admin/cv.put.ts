export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const cv = normalizeCv(body)
  await writeCvFile(cv)
  return { ok: true, cv }
})

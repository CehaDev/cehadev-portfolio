export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody<Record<string, unknown>>(event)
  const current = await readSkillsFile()
  const merged = { ...current, ...normalizeSkills(body) }
  await writeSkillsFile(merged)
  return { ok: true, skills: merged }
})

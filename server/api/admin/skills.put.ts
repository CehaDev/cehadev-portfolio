export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const skills = normalizeSkills(body)
  await writeSkillsFile(skills)
  return { ok: true, skills }
})

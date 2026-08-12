export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const files = await listProjectFiles()
  const projects = []
  for (const f of files) {
    const slug = f.replace(/\.json$/, '')
    projects.push({ slug, ...(await readProjectFile(slug)) })
  }
  return projects
})

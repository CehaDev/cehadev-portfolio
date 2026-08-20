export default defineEventHandler(async () => {
  const files = await listProjectFiles()
  const projects = []
  for (const slug of files) {
    try {
      projects.push(await readProjectFile(slug))
    } catch {}
  }
  return projects.filter((p: any) => !p.archived)
})

import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const project = normalizeProject(body)
  if (!project.slug || !project.title) {
    throw createError({ statusCode: 400, statusMessage: 'Slug dan judul wajib diisi' })
  }
  try {
    await readProjectFile(project.slug)
    throw createError({ statusCode: 409, statusMessage: 'Slug sudah digunakan' })
  } catch (e: unknown) {
    const err = e as { statusCode?: number }
    if (err.statusCode !== 404) throw e
  }
  await writeProjectFile(project.slug, project)
  return { ok: true, project }
})

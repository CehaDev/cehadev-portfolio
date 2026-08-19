import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const body = await readBody<Record<string, unknown>>(event)
  const project = normalizeProject({ ...body, slug: body.slug ?? slug })
  if (!project.title) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi' })
  }
  if (project.slug !== slug) {
    try {
      await readProjectFile(project.slug)
      throw createError({ statusCode: 409, statusMessage: 'Slug sudah digunakan' })
    } catch (e: unknown) {
      const err = e as { statusCode?: number }
      if (err.statusCode !== 404) throw e
    }
    await deleteProjectFile(slug)
  }
  await writeProjectFile(project.slug, project)
  return { ok: true, project }
})

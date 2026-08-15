import { readdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'
import { normalizeLS, normalizeLSArray } from './ls'

const contentDir = path.resolve(process.cwd(), 'content/projects')

export function isValidSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug)
}

export async function listProjectFiles() {
  const files = await readdir(contentDir)
  return files.filter((f) => f.endsWith('.json')).sort()
}

export async function readProjectFile(slug: string) {
  if (!isValidSlug(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  }
  const file = path.join(contentDir, `${slug}.json`)
  try {
    return JSON.parse(await readFile(file, 'utf-8'))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })
  }
}

export async function writeProjectFile(slug: string, data: unknown) {
  if (!isValidSlug(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  }
  const file = path.join(contentDir, `${slug}.json`)
  await writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export async function deleteProjectFile(slug: string) {
  if (!isValidSlug(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Slug tidak valid' })
  }
  const file = path.join(contentDir, `${slug}.json`)
  try {
    await unlink(file)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan' })
  }
}

export function normalizeProject(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [])
  const bool = (v: unknown) => v === true || v === 'true' || v === 1

  const featureCards = (v: unknown) =>
    (Array.isArray(v) ? v : [])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return {
          icon: str(o.icon),
          color: str(o.color),
          title: normalizeLS(o.title),
          desc: normalizeLS(o.desc)
        }
      })
      .filter((f) => f.title.id)

  const processSteps = (v: unknown) =>
    (Array.isArray(v) ? v : [])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return {
          num: str(o.num),
          icon: str(o.icon),
          title: normalizeLS(o.title),
          desc: normalizeLS(o.desc)
        }
      })
      .filter((p) => p.title.id)

  const challenges = (v: unknown) =>
    (Array.isArray(v) ? v : [])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { title: normalizeLS(o.title), desc: normalizeLS(o.desc) }
      })
      .filter((c) => c.title.id)

  const results = (v: unknown) =>
    (Array.isArray(v) ? v : [])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { icon: str(o.icon), value: normalizeLS(o.value), label: normalizeLS(o.label) }
      })
      .filter((r) => r.label.id)

  const gallery = (v: unknown) =>
    (Array.isArray(v) ? v : [])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { label: normalizeLS(o.label), seed: Number(o.seed) || 1 }
      })
      .filter((g) => g.label.id)

  const codeFiles = (v: unknown) =>
    (Array.isArray(v) ? v : [])
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { name: str(o.name), language: str(o.language), content: str(o.content) }
      })
      .filter((f) => f.name && f.content)

  const demoRaw = body.demo && typeof body.demo === 'object' ? (body.demo as Record<string, unknown>) : undefined

  let demo: Record<string, unknown> | undefined
  if (demoRaw) {
    const codeRaw = demoRaw.code && typeof demoRaw.code === 'object' ? (demoRaw.code as Record<string, unknown>) : undefined
    const files = codeRaw ? codeFiles(codeRaw.files) : []
    demo = {
      enabled: bool(demoRaw.enabled),
      type: str(demoRaw.type),
      title: normalizeLS(demoRaw.title),
      note: normalizeLS(demoRaw.note),
      ...(files.length ? { code: { files } } : {})
    }
    if (!demo.enabled) demo = undefined
  }

  const rawDetail = body.detail && typeof body.detail === 'object' ? (body.detail as Record<string, unknown>) : undefined

  let detail: Record<string, unknown> | undefined
  if (rawDetail) {
    detail = {
      overview: normalizeLS(rawDetail.overview),
      featureHighlights: featureCards(rawDetail.featureHighlights),
      mainFeatures: featureCards(rawDetail.mainFeatures),
      techStack: arr(rawDetail.techStack),
      process: processSteps(rawDetail.process),
      challenges: challenges(rawDetail.challenges),
      results: results(rawDetail.results),
      gallery: gallery(rawDetail.gallery)
    }
  }

  return {
    slug: str(body.slug).toLowerCase(),
    title: normalizeLS(body.title),
    tagline: normalizeLS(body.tagline),
    description: normalizeLS(body.description),
    tags: normalizeLSArray(body.tags),
    tech: arr(body.tech),
    category: normalizeLS(body.category),
    year: str(body.year),
    role: normalizeLS(body.role),
    duration: normalizeLS(body.duration),
    featured: bool(body.featured),
    archived: bool(body.archived),
    liveUrl: str(body.liveUrl),
    githubUrl: str(body.githubUrl),
    ...(demo ? { demo } : {}),
    ...(detail ? { detail } : {})
  }
}

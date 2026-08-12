import { readdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

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

  return {
    slug: str(body.slug).toLowerCase(),
    title: str(body.title),
    tagline: str(body.tagline),
    description: str(body.description),
    tags: arr(body.tags),
    tech: arr(body.tech),
    category: str(body.category),
    year: str(body.year),
    role: str(body.role),
    duration: str(body.duration),
    featured: bool(body.featured),
    liveUrl: str(body.liveUrl),
    githubUrl: str(body.githubUrl),
    ...(body.detail && typeof body.detail === 'object' ? { detail: body.detail } : {})
  }
}

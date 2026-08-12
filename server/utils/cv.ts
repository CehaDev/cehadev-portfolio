import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

const cvFile = path.resolve(process.cwd(), 'content/cv.json')

export async function readCvFile() {
  try {
    return JSON.parse(await readFile(cvFile, 'utf-8'))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'CV tidak ditemukan' })
  }
}

export async function writeCvFile(data: unknown) {
  await writeFile(cvFile, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export function normalizeCv(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])

  const item = (v: unknown, keys: string[]) => {
    if (!Array.isArray(v)) return []
    return v.map((x) => {
      const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
      const out: Record<string, string> = {}
      for (const k of keys) out[k] = str(o[k])
      return out
    })
  }

  return {
    fullName: str(body.fullName),
    title: str(body.title),
    photo: str(body.photo),
    email: str(body.email),
    phone: str(body.phone),
    location: str(body.location),
    website: str(body.website),
    linkedin: str(body.linkedin),
    github: str(body.github),
    summary: str(body.summary),
    experiences: item(body.experiences, ['role', 'company', 'period', 'description']),
    education: item(body.education, ['degree', 'school', 'period', 'description']),
    skills: arr(body.skills).map((s) => str(s)).filter(Boolean),
    languages: item(body.languages, ['name', 'level']),
    certifications: item(body.certifications, ['name', 'issuer', 'year'])
  }
}

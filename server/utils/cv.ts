import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'
import { normalizeLS, normalizeLSArray, normalizeLSObject } from './ls'
import { kvGetJson, kvSetJson } from './db'

const cvFile = path.resolve(process.cwd(), 'content/cv.json')

export async function readCvFile() {
  const data = await kvGetJson('content_cv', null)
  if (data) return data
  try {
    return JSON.parse(await readFile(cvFile, 'utf-8'))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'CV tidak ditemukan' })
  }
}

export async function writeCvFile(data: unknown) {
  await kvSetJson('content_cv', data)
}

export function normalizeCv(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])

  return {
    fullName: str(body.fullName), title: normalizeLS(body.title), photo: str(body.photo),
    email: str(body.email), phone: str(body.phone), location: normalizeLS(body.location),
    website: str(body.website), linkedin: str(body.linkedin), github: str(body.github),
    summary: normalizeLS(body.summary),
    experiences: normalizeLSObject(body.experiences, ['role', 'company', 'period', 'description']),
    education: normalizeLSObject(body.education, ['degree', 'school', 'period', 'description']),
    skills: normalizeLSArray(body.skills),
    languages: normalizeLSObject(body.languages, ['name', 'level']),
    certifications: normalizeLSObject(body.certifications, ['name', 'issuer', 'year'])
  }
}

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

const skillsFile = path.resolve(process.cwd(), 'content/skills.json')

export async function readSkillsFile() {
  try {
    return JSON.parse(await readFile(skillsFile, 'utf-8'))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Data skills tidak ditemukan' })
  }
}

export async function writeSkillsFile(data: unknown) {
  await writeFile(skillsFile, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export function normalizeSkills(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])

  const techItem = (v: unknown) => {
    if (!Array.isArray(v)) return []
    return v
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { name: str(o.name), level: Number(o.level) || 0, tech: str(o.tech) }
      })
      .filter((i) => i.name)
  }

  const summary = (v: unknown) =>
    arr(v)
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { label: str(o.label), value: str(o.value), icon: str(o.icon) }
      })
      .filter((i) => i.label)

  const strings = (v: unknown) => arr(v).map((s) => str(s)).filter(Boolean)

  const out: Record<string, unknown> = {}
  if (body.homeSkills !== undefined) out.homeSkills = techItem(body.homeSkills)
  if (body.technicalSkills !== undefined) out.technicalSkills = techItem(body.technicalSkills)
  if (body.marqueeTech !== undefined) out.marqueeTech = strings(body.marqueeTech)
  if (body.skillsSummary !== undefined) out.skillsSummary = summary(body.skillsSummary)
  if (body.toolsList !== undefined) out.toolsList = strings(body.toolsList)
  if (body.softSkills !== undefined) out.softSkills = strings(body.softSkills)
  return out
}

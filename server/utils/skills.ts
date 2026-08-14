import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'
import { normalizeLS, normalizeLSArray } from './ls'

const skillsFile = path.resolve(process.cwd(), 'content/skills.json')

export async function readSkillsFile() {
  try {
    return JSON.parse(await readFile(skillsFile, 'utf-8'))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Data skill tidak ditemukan' })
  }
}

export async function writeSkillsFile(data: unknown) {
  await writeFile(skillsFile, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export function normalizeSkills(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])

  const skillItems = (v: unknown, hasCategory: boolean) =>
    arr(v)
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        const item: Record<string, unknown> = {
          name: normalizeLS(o.name),
          level: Math.min(100, Math.max(0, Number(o.level) || 0)),
          tech: str(o.tech)
        }
        if (hasCategory) item.category = normalizeLS(o.category)
        return item
      })
      .filter((i) => i.name.id)

  const summaryCards = (v: unknown) =>
    arr(v)
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return { label: normalizeLS(o.label), value: normalizeLS(o.value), icon: str(o.icon) }
      })
      .filter((i) => i.label.id)

  return {
    homeSkills: skillItems(body.homeSkills, false),
    technicalSkills: skillItems(body.technicalSkills, true),
    marqueeTech: normalizeLSArray(body.marqueeTech),
    skillsSummary: summaryCards(body.skillsSummary),
    toolsList: normalizeLSArray(body.toolsList),
    softSkills: normalizeLSArray(body.softSkills)
  }
}

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

const siteFile = path.resolve(process.cwd(), 'content/site.json')

export async function readSiteFile() {
  try {
    return JSON.parse(await readFile(siteFile, 'utf-8'))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Data pengaturan website tidak ditemukan' })
  }
}

export async function writeSiteFile(data: unknown) {
  await writeFile(siteFile, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

export function normalizeSite(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])

  const strings = (v: unknown) => arr(v).map((s) => str(s)).filter(Boolean)

  const obj = (v: unknown, keys: string[]) => {
    if (!Array.isArray(v)) return []
    return v.map((x) => {
      const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
      const out: Record<string, string> = {}
      for (const k of keys) out[k] = str(o[k])
      return out
    })
  }

  const stats = (v: unknown) =>
    arr(v)
      .map((x) => {
        const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
        return {
          icon: str(o.icon),
          label: str(o.label),
          sub: str(o.sub),
          end: Number(o.end) || 0,
          suffix: str(o.suffix)
        }
      })
      .filter((i) => i.label)

  const socials = (v: unknown) => {
    const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>
    return {
      github: str(o.github),
      linkedin: str(o.linkedin),
      instagram: str(o.instagram)
    }
  }

  return {
    name: str(body.name),
    role: str(body.role),
    heroBadge: str(body.heroBadge),
    heroTitle1: str(body.heroTitle1),
    heroTitleGradient: str(body.heroTitleGradient),
    heroSubtitle: str(body.heroSubtitle),
    heroDescription: str(body.heroDescription),
    aboutIntro: strings(body.aboutIntro),
    aboutChecklist: strings(body.aboutChecklist),
    quote: str(body.quote),
    quoteHighlight: str(body.quoteHighlight),
    stats: stats(body.stats),
    email: str(body.email),
    location: str(body.location),
    website: str(body.website),
    phone: str(body.phone),
    socials: socials(body.socials),
    cvUrl: str(body.cvUrl),
    faqs: obj(body.faqs, ['q', 'a'])
  }
}

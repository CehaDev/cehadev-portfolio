import siteFallback from '../../content/site.json'
import { createError } from 'h3'
import { normalizeLS, normalizeLSArray, normalizeLSObject, deepLS } from './ls'
import { kvGetJson, kvSetJson } from './db'

export async function readSiteFile() {
  const data = await kvGetJson('content_site', null)
  if (data) return data
  if (siteFallback) return siteFallback
  throw createError({ statusCode: 404, statusMessage: 'Data pengaturan website tidak ditemukan' })
}

export async function writeSiteFile(data: unknown) {
  await kvSetJson('content_site', data)
}

export function normalizeSite(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v : [])
  const strings = (v: unknown) => normalizeLSArray(v)

  const stats = (v: unknown) =>
    arr(v).map((x) => {
      const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
      return { icon: str(o.icon), label: normalizeLS(o.label), sub: normalizeLS(o.sub), end: Number(o.end) || 0, suffix: normalizeLS(o.suffix) }
    }).filter((i) => i.label.id)

  const socials = (v: unknown) => {
    const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>
    return { github: str(o.github), linkedin: str(o.linkedin), instagram: str(o.instagram) }
  }

  const faqs = (v: unknown) => normalizeLSObject(v, ['q', 'a'])

  const statCards = (v: unknown) =>
    arr(v).map((x) => {
      const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>
      return { icon: str(o.icon), label: normalizeLS(o.label), value: normalizeLS(o.value) }
    }).filter((i) => i.label.id)

  return {
    name: str(body.name), role: normalizeLS(body.role),
    heroBadge: normalizeLS(body.heroBadge), heroTitle1: normalizeLS(body.heroTitle1),
    heroTitleGradient: normalizeLS(body.heroTitleGradient), heroSubtitle: normalizeLS(body.heroSubtitle),
    heroDescription: normalizeLS(body.heroDescription),
    aboutIntro: strings(body.aboutIntro), aboutChecklist: strings(body.aboutChecklist),
    quote: normalizeLS(body.quote), quoteHighlight: normalizeLS(body.quoteHighlight),
    stats: stats(body.stats), email: str(body.email), location: normalizeLS(body.location),
    website: str(body.website), phone: str(body.phone), socials: socials(body.socials),
    cvUrl: str(body.cvUrl), faqs: faqs(body.faqs), projectStats: statCards(body.projectStats),
    seo: deepLS(body.seo) as Record<string, unknown> | undefined,
    headings: deepLS(body.headings) as Record<string, unknown> | undefined
  }
}

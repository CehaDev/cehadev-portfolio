import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'
import { db, ensureSchema, kvGetJson, kvSetJson, isUsingTurso } from './db'

export interface Visit {
  id: string
  at: string
  path: string
  session: string
  referrer: string
  device: string
  browser: string
}

// ---- Local file fallback ----

const visitsFile = path.resolve(process.cwd(), '.data/visits.json')
const MAX_VISITS = 20000

async function readLocalVisits(): Promise<Visit[]> {
  try {
    const parsed = JSON.parse(await readFile(visitsFile, 'utf-8'))
    return Array.isArray(parsed.visits) ? parsed.visits : []
  } catch {
    return []
  }
}

async function writeLocalVisits(visits: Visit[]) {
  await mkdir(path.dirname(visitsFile), { recursive: true })
  await writeFile(visitsFile, JSON.stringify({ visits }, null, 2) + '\n', 'utf-8')
}

// ---- Detect helpers ----

function detectDevice(ua: string) {
  if (/iphone|ipod|android.*mobile/i.test(ua)) return 'Mobile'
  if (/ipad|tablet/i.test(ua)) return 'Tablet'
  return 'Desktop'
}

function detectBrowser(ua: string) {
  if (/edg\//i.test(ua)) return 'Edge'
  if (/chrome|chromium/i.test(ua)) return 'Chrome'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua)) return 'Safari'
  if (/opr\//i.test(ua)) return 'Opera'
  return 'Lainnya'
}

// ---- Public API ----

export async function addVisit(input: { path?: string; referrer?: string; session?: string; ua?: string }) {
  const p = (input.path ?? '').trim().slice(0, 200)
  if (!p || p.startsWith('/admin') || p.startsWith('/_')) {
    return { ok: false }
  }
  const ua = input.ua ?? ''
  const visit: Visit = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    path: p,
    session: (input.session ?? '').trim().slice(0, 80),
    referrer: (input.referrer ?? '').trim().slice(0, 400),
    device: detectDevice(ua),
    browser: detectBrowser(ua)
  }

  if (isUsingTurso()) {
    await ensureSchema()
    await db().execute({
      sql: 'INSERT INTO visits (id, at, path, session, referrer, device, browser) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [visit.id, visit.at, visit.path, visit.session, visit.referrer, visit.device, visit.browser]
    })
  } else {
    const visits = await readLocalVisits()
    visits.push(visit)
    if (visits.length > MAX_VISITS) visits.splice(0, visits.length - MAX_VISITS)
    await writeLocalVisits(visits)
  }

  return { ok: true }
}

export async function listVisits(): Promise<Visit[]> {
  if (isUsingTurso()) {
    await ensureSchema()
    const { rows } = await db().execute({
      sql: 'SELECT * FROM visits ORDER BY rowid DESC LIMIT 20000',
      args: []
    })
    return rows as unknown as Visit[]
  }
  return readLocalVisits()
}

function dayKey(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function visitDay(v: Visit) {
  return dayKey(new Date(v.at))
}

export function dailySeries(visits: Visit[], days: number) {
  const today = new Date()
  const dates: string[] = []
  const byDay = new Map<string, { views: number; visitors: Set<string> }>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const key = dayKey(d)
    dates.push(key)
    byDay.set(key, { views: 0, visitors: new Set() })
  }
  for (const v of visits) {
    const key = visitDay(v)
    const bucket = byDay.get(key)
    if (!bucket) continue
    bucket.views++
    if (v.session) bucket.visitors.add(v.session)
  }
  return dates.map((date) => {
    const b = byDay.get(date)!
    return { date, views: b.views, visitors: b.visitors.size }
  })
}

export async function getAnalyticsOverview() {
  const visits = await listVisits()
  const sessions = new Set<string>()
  const todayKey = dayKey(new Date())
  let todayViews = 0
  const todaySessions = new Set<string>()

  const pageViews = new Map<string, { views: number; visitors: Set<string> }>()
  const projectViews = new Map<string, { slug: string; views: number }>()
  const devices = new Map<string, number>()
  const browsers = new Map<string, number>()

  for (const v of visits) {
    if (v.session) sessions.add(v.session)
    if (visitDay(v) === todayKey) {
      todayViews++
      if (v.session) todaySessions.add(v.session)
    }
    const pv = pageViews.get(v.path) ?? { views: 0, visitors: new Set<string>() }
    pv.views++
    if (v.session) pv.visitors.add(v.session)
    pageViews.set(v.path, pv)
    if (v.path.startsWith('/projects/')) {
      const slug = v.path.replace('/projects/', '').split('/')[0]
      const pr = projectViews.get(slug) ?? { slug, views: 0 }
      pr.views++
      projectViews.set(slug, pr)
    }
    devices.set(v.device, (devices.get(v.device) ?? 0) + 1)
    browsers.set(v.browser, (browsers.get(v.browser) ?? 0) + 1)
  }

  return {
    total: {
      views: visits.length,
      visitors: sessions.size,
      todayViews,
      todayVisitors: todaySessions.size
    },
    daily: dailySeries(visits, 30),
    topPages: [...pageViews.entries()]
      .map(([path, { views }]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8),
    topProjects: [...projectViews.values()].sort((a, b) => b.views - a.views).slice(0, 8),
    devices: [...devices.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    browsers: [...browsers.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }
}

// ---- Analitik khusus halaman artikel ----

function referrerBucket(referrer: string): 'Google' | 'Sosial Media' | 'Langsung' | 'Lainnya' {
  if (!referrer) return 'Langsung'
  if (/google\./i.test(referrer)) return 'Google'
  if (/facebook|fb\.|twitter|x\.com|t\.co|linkedin|reddit|whatsapp|wa\.me|telegram|t\.me|instagram/i.test(referrer)) return 'Sosial Media'
  return 'Lainnya'
}

export async function getArticlesAnalytics(days = 30) {
  const allVisits = await listVisits()
  // Hanya kunjungan ke daftar & halaman artikel
  const visits = allVisits.filter((v) => v.path === '/articles' || v.path.startsWith('/articles/'))

  const sessions = new Set<string>()
  let views7d = 0
  let viewsPrev7d = 0
  const dayMs = 86_400_000

  const bySlug = new Map<string, { slug: string; views: number; visitors: Set<string>; views7d: number; viewsPrev7d: number }>()
  const devicesMap = new Map<string, number>()
  const browsersMap = new Map<string, number>()
  const referrersMap = new Map<string, number>()

  for (const v of visits) {
    if (v.session) sessions.add(v.session)

    const ageDays = Math.floor((Date.now() - new Date(v.at).getTime()) / dayMs)
    if (ageDays < 7) views7d++
    else if (ageDays < 14) viewsPrev7d++

    const slug = v.path.startsWith('/articles/')
      ? v.path.replace('/articles/', '').split('/')[0]
      : ''

    if (slug && /^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      const entry = bySlug.get(slug) ?? { slug, views: 0, visitors: new Set<string>(), views7d: 0, viewsPrev7d: 0 }
      entry.views++
      if (v.session) entry.visitors.add(v.session)
      if (ageDays < 7) entry.views7d++
      else if (ageDays < 14) entry.viewsPrev7d++
      bySlug.set(slug, entry)
    }

    devicesMap.set(v.device, (devicesMap.get(v.device) ?? 0) + 1)
    browsersMap.set(v.browser, (browsersMap.get(v.browser) ?? 0) + 1)
    const bucket = referrerBucket(v.referrer)
    referrersMap.set(bucket, (referrersMap.get(bucket) ?? 0) + 1)
  }

  const daily = dailySeries(visits, days)

  return {
    total: {
      views: visits.length,
      readers: sessions.size,
      views7d,
      trendPct: viewsPrev7d > 0 ? Math.round(((views7d - viewsPrev7d) / viewsPrev7d) * 100) : null
    },
    daily: daily.map((d) => ({ date: d.date, views: d.views, visitors: d.visitors })),
    devices: [...devicesMap.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    browsers: [...browsersMap.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    sources: ['Google', 'Sosial Media', 'Langsung', 'Lainnya']
      .map((label) => ({ label, value: referrersMap.get(label) ?? 0 })),
    articles: [...bySlug.values()]
      .map(({ visitors, ...rest }) => ({ ...rest, readers: visitors.size }))
      .sort((a, b) => b.views - a.views)
  }
}

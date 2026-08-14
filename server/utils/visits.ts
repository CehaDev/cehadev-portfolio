import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'

export interface Visit {
  id: string
  at: string
  path: string
  session: string
  referrer: string
  device: string
  browser: string
}

interface VisitStore {
  visits: Visit[]
}

const visitsFile = path.resolve(process.cwd(), '.data/visits.json')
const MAX_VISITS = 20000

let queue: Promise<unknown> = Promise.resolve()

function mutate<T>(fn: (store: VisitStore) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const store = await readStore()
    const result = await fn(store)
    await writeStore(store)
    return result
  })
  queue = run.then(
    () => {},
    () => {}
  )
  return run
}

async function readStore(): Promise<VisitStore> {
  try {
    const parsed = JSON.parse(await readFile(visitsFile, 'utf-8'))
    return { visits: Array.isArray(parsed.visits) ? parsed.visits : [] }
  } catch {
    return { visits: [] }
  }
}

async function writeStore(store: VisitStore) {
  await mkdir(path.dirname(visitsFile), { recursive: true })
  await writeFile(visitsFile, JSON.stringify(store, null, 2) + '\n', 'utf-8')
}

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

export async function addVisit(input: { path?: string; referrer?: string; session?: string; ua?: string }) {
  const path = (input.path ?? '').trim().slice(0, 200)
  if (!path || path.startsWith('/admin') || path.startsWith('/_')) {
    return { ok: false }
  }
  const ua = input.ua ?? ''
  const visit: Visit = {
    id: randomUUID(),
    at: new Date().toISOString(),
    path,
    session: (input.session ?? '').trim().slice(0, 80),
    referrer: (input.referrer ?? '').trim().slice(0, 400),
    device: detectDevice(ua),
    browser: detectBrowser(ua)
  }
  await mutate(async (store) => {
    store.visits.push(visit)
    if (store.visits.length > MAX_VISITS) {
      store.visits.splice(0, store.visits.length - MAX_VISITS)
    }
  })
  return { ok: true }
}

export async function listVisits() {
  const store = await readStore()
  return store.visits
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
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
    const key = v.at.slice(0, 10)
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
  const todayKey = new Date().toISOString().slice(0, 10)
  let todayViews = 0
  const todaySessions = new Set<string>()

  const pageViews = new Map<string, { views: number; visitors: Set<string> }>()
  const projectViews = new Map<string, { slug: string; views: number }>()
  const devices = new Map<string, number>()
  const browsers = new Map<string, number>()

  for (const v of visits) {
    if (v.session) sessions.add(v.session)
    if (v.at.slice(0, 10) === todayKey) {
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

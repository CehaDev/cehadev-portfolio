import type { Client } from '@libsql/client'
import { db, ensureSchema } from './db'
import * as articleManager from './article-manager'

let _override: Client | null = null

export function __setMonitorDbForTest(c: Client | null) {
  _override = c
}

function conn() {
  return _override ?? db()
}

// ---------------------------------------------------------------------------
// Pluggable metrics collector. Pada Vercel (serverless) metrics CPU/RAM/disk
// tidak tersedia; LocalMetricsProvider mengembalikan "N/A" dan bisa diganti
// dengan collector VPS (Phase 8) atau stub untuk test.
// ---------------------------------------------------------------------------

export interface MachineMetrics {
  cpu: { usedPct: number | null; text: string }
  ram: { usedPct: number | null; text: string }
  disk: { usedPct: number | null; text: string }
  uptimeSec: number | null
}

export interface MetricsCollector {
  collect(): Promise<MachineMetrics>
}

class LocalMetricsCollector implements MetricsCollector {
  async collect(): Promise<MachineMetrics> {
    return {
      cpu: { usedPct: null, text: 'N/A' },
      ram: { usedPct: null, text: 'N/A' },
      disk: { usedPct: null, text: 'N/A' },
      uptimeSec: null
    }
  }
}

const collector: { current: MetricsCollector | null } = { current: new LocalMetricsCollector() }

export function setMetricsCollector(c: MetricsCollector | null) {
  collector.current = c ?? new LocalMetricsCollector()
}

export function metrics(): MetricsCollector {
  return collector.current!
}

// ---------------------------------------------------------------------------
// Health checks
// ---------------------------------------------------------------------------

export interface HealthResult {
  ok: boolean
  name: string
  detail: string
  checkedAt: string
}

export async function checkDatabase(): Promise<HealthResult> {
  const t = new Date().toISOString()
  try {
    await conn().execute({ sql: 'SELECT 1', args: [] })
    return { ok: true, name: 'database', detail: 'query SELECT 1 ok', checkedAt: t }
  } catch (e: unknown) {
    return { ok: false, name: 'database', detail: (e as Error).message, checkedAt: t }
  }
}

export async function checkWebsite(baseUrl: string): Promise<HealthResult> {
  const t = new Date().toISOString()
  try {
    const res = await fetch(baseUrl, { signal: AbortSignal.timeout(8000) })
    return { ok: res.ok, name: 'website', detail: `HTTP ${res.status}`, checkedAt: t }
  } catch (e: unknown) {
    return { ok: false, name: 'website', detail: (e as Error).message, checkedAt: t }
  }
}

export async function checkApi(baseUrl: string): Promise<HealthResult> {
  const t = new Date().toISOString()
  try {
    const url = baseUrl.replace(/\/$/, '') + '/api/health'
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const ok = res.ok || res.status < 500
    return { ok, name: 'api', detail: `HTTP ${res.status}`, checkedAt: t }
  } catch (e: unknown) {
    return { ok: false, name: 'api', detail: (e as Error).message, checkedAt: t }
  }
}

export interface OverviewReport {
  machine: MachineMetrics
  articles: {
    total: number
    published: number
    drafts: number
    scheduled: number
    review: number
    by_source: Record<string, number>
  }
  connections: {
    database: string
    storage: string
  }
  checkedAt: string
}

export async function getOverview(baseUrl?: string): Promise<OverviewReport> {
  const machine = await metrics().collect()
  const arts = await articleManager.listArticles({})
  const byStatus = arts.reduce((acc, x) => ((acc[x.status] = (acc[x.status] || 0) + 1), acc), {} as Record<string, number>)
  const bySource = arts.reduce((acc, x) => ((acc[x.source_type] = (acc[x.source_type] || 0) + 1), acc), {} as Record<string, number>)
  return {
    machine,
    articles: {
      total: arts.length,
      published: byStatus.PUBLISHED || 0,
      drafts: byStatus.DRAFT || 0,
      scheduled: byStatus.SCHEDULED || 0,
      review: byStatus.REVIEW || 0,
      by_source: bySource
    },
    connections: {
      database: process.env.TURSO_DATABASE_URL ? 'turso' : 'local-file',
      storage: process.env.PUBLIC_SITE_URL || baseUrl || 'local'
    },
    checkedAt: new Date().toISOString()
  }
}

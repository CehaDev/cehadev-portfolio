import { createError, getHeader } from 'h3'
import { kvGetJson, kvSetJson } from './db'

function normalizeIP(ip: string): string {
  const s = ip.trim().toLowerCase()
  if (s.startsWith('::ffff:') && s.includes('.')) return s.slice(7)
  return s
}

function bucketIP(ip: string): string {
  const s = normalizeIP(ip).split(',')[0]
  if (s.includes(':')) {
    const groups = s.split(':').filter(Boolean)
    return 'v6:' + groups.slice(0, 4).join(':')
  }
  return s
}

function getClientIP(event: any): string {
  const realIP = getHeader(event, 'x-real-ip')
  if (realIP) return bucketIP(realIP)
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return bucketIP(forwarded)
  const socket = event.node?.req?.socket?.remoteAddress
  return socket ? bucketIP(socket) : 'unknown'
}

export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now()
  const entry = await kvGetJson<{ timestamps?: unknown }>(`rate_limit:${key}`, {})
  const timestamps = Array.isArray(entry.timestamps)
    ? entry.timestamps.filter((t): t is number => typeof t === 'number' && now - t < windowMs)
    : []
  if (timestamps.length >= limit) return false
  timestamps.push(now)
  await kvSetJson(`rate_limit:${key}`, { timestamps })
  return true
}

export async function rateLimitOrThrow(event: any, name: string, limit: number, windowMs: number): Promise<void> {
  const ip = getClientIP(event)
  let allowed = true
  try {
    allowed = await checkRateLimit(`${name}:${ip}`, limit, windowMs)
  } catch {
    allowed = true
  }
  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak permintaan. Coba lagi beberapa menit.'
    })
  }
}

/**
 * Rate limiter in-memory (PRD Section 16) — window geser sederhana per key.
 * CATATAN: state dalam memori per-instance serverless (best-effort). Untuk
 * produksi ketat gunakan rateLimitOrThrow (persisten via KV) atau store
 * terdistribusi. Digunakan pada middleware admin untuk pembatasan burst lokal.
 */
type Window = { count: number; resetAt: number }

const buckets = new Map<string, Window>()

export interface InMemoryRateOptions {
  max: number
  windowMs: number
}

const DEFAULTS: InMemoryRateOptions = { max: 30, windowMs: 60_000 }

export function rateLimit(key: string, opts: Partial<InMemoryRateOptions> = {}): { ok: boolean; remaining: number; retryAfterMs: number } {
  const { max, windowMs } = { ...DEFAULTS, ...opts }
  const now = Date.now()
  const cur = buckets.get(key)
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: max - 1, retryAfterMs: 0 }
  }
  if (cur.count >= max) {
    return { ok: false, remaining: 0, retryAfterMs: cur.resetAt - now }
  }
  cur.count += 1
  return { ok: true, remaining: max - cur.count, retryAfterMs: 0 }
}

/** Bersihkan bucket kadaluwarsa agar tidak bocor memori. */
export function pruneRateBuckets() {
  const now = Date.now()
  for (const [k, w] of buckets) {
    if (w.resetAt <= now) buckets.delete(k)
  }
}

export function resetRateLimiter() {
  buckets.clear()
}

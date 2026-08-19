import { createError, getHeader, getRequestURL } from 'h3'

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 600_000)
    if (entry.timestamps.length === 0) store.delete(key)
  }
}

setInterval(cleanup, 60_000).unref()

export function getClientIP(event: any): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIP = getHeader(event, 'x-real-ip')
  if (realIP) return realIP.trim()
  return event.node?.req?.socket?.remoteAddress ?? 'unknown'
}

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)
  if (entry.timestamps.length >= limit) return false
  entry.timestamps.push(now)
  store.set(key, entry)
  return true
}

export function rateLimitOrThrow(event: any, name: string, limit: number, windowMs: number) {
  const ip = getClientIP(event)
  const key = `${name}:${ip}`
  if (!checkRateLimit(key, limit, windowMs)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Terlalu banyak permintaan. Coba lagi beberapa menit.'
    })
  }
}

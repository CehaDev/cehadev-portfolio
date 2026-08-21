import { createError, getHeader } from 'h3'
import { kvGetJson, kvSetJson } from './db'

function getClientIP(event: any): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIP = getHeader(event, 'x-real-ip')
  if (realIP) return realIP.trim()
  return event.node?.req?.socket?.remoteAddress ?? 'unknown'
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

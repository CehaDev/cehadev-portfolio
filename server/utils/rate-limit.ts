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

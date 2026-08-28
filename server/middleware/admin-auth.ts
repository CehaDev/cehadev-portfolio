export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const path = url.pathname
  if (!path.startsWith('/api/admin')) {
    // tetap berlakukan rate limit pada percobaan login publik
    if (path.startsWith('/api/auth/login')) {
      const ip = getRequestIP(event) || 'unknown'
      const rl = rateLimit(`login:${ip}`, { max: 10, windowMs: 60_000 })
      if (!rl.ok) {
        setHeader(event, 'Retry-After', String(Math.ceil(rl.retryAfterMs / 1000)))
        throw createError({ statusCode: 429, message: 'Terlalu banyak percobaan login' })
      }
    }
    return
  }
  await requireAdmin(event)

  const ip = getRequestIP(event) || 'unknown'
  const method = (event.method || 'GET').toUpperCase()
  const isSensitive =
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE' ||
    path.includes('/ai/tool') ||
    path.includes('/ai/generate') ||
    path.includes('/media') ||
    path.includes('/backup') ||
    path.includes('/scheduler')

  const cfg = isSensitive ? { max: 60, windowMs: 60_000 } : { max: 120, windowMs: 60_000 }
  const rl = rateLimit(`admin:${ip}`, cfg)
  if (!rl.ok) {
    setHeader(event, 'Retry-After', String(Math.ceil(rl.retryAfterMs / 1000)))
    throw createError({ statusCode: 429, message: 'Terlalu banyak permintaan' })
  }
})

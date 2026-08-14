import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'

export const SESSION_COOKIE = 'cehadev_admin_session'
const SESSION_TTL = 7 * 24 * 60 * 60 // 7 hari

export function secret() {
  return process.env.NUXT_ADMIN_SECRET || 'cehadev-admin-dev-secret'
}

export function sign(str: string) {
  return createHmac('sha256', secret()).update(str).digest('base64url')
}

export function issueSession() {
  const payload = { exp: Date.now() + SESSION_TTL * 1000 }
  return signPayload(payload)
}

export function parseSigned(token: string | undefined): Record<string, unknown> | null {
  if (!token) return null
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return null
  const str = Buffer.from(b64, 'base64url').toString()
  const expected = Buffer.from(sign(str))
  const actual = Buffer.from(sig)
  if (actual.length !== expected.length) return null
  if (!timingSafeEqual(actual, expected)) return null
  try {
    const payload = JSON.parse(str)
    return payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function signPayload(payload: Record<string, unknown>) {
  const str = JSON.stringify(payload)
  return `${Buffer.from(str).toString('base64url')}.${sign(str)}`
}

export function isSessionValid(token: string | undefined) {
  const payload = parseSigned(token)
  return !!payload && typeof payload.exp === 'number' && payload.exp > Date.now()
}

export function setAdminSession(event: Parameters<typeof setCookie>[0]) {
  setCookie(event, SESSION_COOKIE, issueSession(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
}

export function clearAdminSession(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function requireAdmin(event: Parameters<typeof getCookie>[0]) {
  const token = getCookie(event, SESSION_COOKIE)
  if (!isSessionValid(token)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'

export const SESSION_COOKIE = 'cehadev_admin_session'
const SESSION_TTL = 7 * 24 * 60 * 60 // 7 hari

export const PENDING_COOKIE = 'cehadev_admin_pending'
const PENDING_TTL = 10 * 60 * 1000 // 10 menit

function secret() {
  return process.env.NUXT_ADMIN_SECRET || 'cehadev-admin-dev-secret'
}

export function signToken(str: string) {
  return createHmac('sha256', secret()).update(str).digest('base64url')
}

// ---- Token "pending" untuk langkah verifikasi OTP ----

export function issuePending(event: Parameters<typeof setCookie>[0]) {
  const payload = { purpose: 'otp', exp: Date.now() + PENDING_TTL }
  const str = JSON.stringify(payload)
  const token = `${Buffer.from(str).toString('base64url')}.${signToken(str)}`
  setCookie(event, PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
}

export function readPending(event: Parameters<typeof getCookie>[0]): boolean {
  const token = getCookie(event, PENDING_COOKIE)
  if (!token) return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  const str = Buffer.from(b64, 'base64url').toString()
  const expected = Buffer.from(signToken(str))
  const actual = Buffer.from(sig)
  if (actual.length !== expected.length) return false
  if (!timingSafeEqual(actual, expected)) return false
  try {
    const payload = JSON.parse(str) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export function clearPending(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, PENDING_COOKIE, { path: '/' })
}

export function issueSession() {
  const payload = { iat: Date.now(), exp: Date.now() + SESSION_TTL * 1000 }
  const str = JSON.stringify(payload)
  return `${Buffer.from(str).toString('base64url')}.${signToken(str)}`
}

export function isSessionValid(token: string | undefined) {
  if (!token) return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  const str = Buffer.from(b64, 'base64url').toString()
  const expected = Buffer.from(signToken(str))
  const actual = Buffer.from(sig)
  if (actual.length !== expected.length) return false
  if (!timingSafeEqual(actual, expected)) return false
  try {
    const payload = JSON.parse(str)
    return (
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number' &&
      payload.exp > Date.now()
    )
  } catch {
    return false
  }
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

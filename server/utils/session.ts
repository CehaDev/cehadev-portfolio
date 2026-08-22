import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'
import { kvGetJson, kvSetJson } from './db'

export const SESSION_COOKIE = 'cehadev_admin_session'
const SESSION_TTL = 7 * 24 * 60 * 60 // 7 hari

function secret() {
  const s = process.env.NUXT_ADMIN_SECRET
  if (!s) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_ADMIN_SECRET belum diatur' })
  }
  if (process.env.NODE_ENV === 'production' && (s.length < 32 || /dev-only/i.test(s))) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_ADMIN_SECRET tidak aman untuk production' })
  }
  return s
}

export function signToken(str: string) {
  return createHmac('sha256', secret()).update(str).digest('base64url')
}

// ---- Session Epoch (untuk revocation) ----

async function getSessionEpoch(): Promise<number> {
  const data = await kvGetJson<{ epoch?: number }>('session_epoch', {})
  return typeof data.epoch === 'number' ? data.epoch : 0
}

export async function revokeAllSessions() {
  const current = await getSessionEpoch()
  await kvSetJson('session_epoch', { epoch: current + 1 })
}

// ---- Session ----

export async function issueSession() {
  const epoch = await getSessionEpoch()
  const payload = { iat: Date.now(), exp: Date.now() + SESSION_TTL * 1000, epoch }
  const str = JSON.stringify(payload)
  return `${Buffer.from(str).toString('base64url')}.${signToken(str)}`
}

export async function isSessionValid(token: string | undefined) {
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
    if (
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number' ||
      payload.exp <= Date.now()
    ) {
      return false
    }
    const currentEpoch = await getSessionEpoch()
    return payload.epoch === currentEpoch
  } catch {
    return false
  }
}

export async function setAdminSession(event: Parameters<typeof setCookie>[0]) {
  setCookie(event, SESSION_COOKIE, await issueSession(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
}

export function clearAdminSession(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export async function requireAdmin(event: Parameters<typeof getCookie>[0]) {
  const token = getCookie(event, SESSION_COOKIE)
  if (!(await isSessionValid(token))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { secret, sign, parseSigned } from './session'

export const PENDING_COOKIE = 'cehadev_admin_pending'
const OTP_TTL = 5 * 60 * 1000
const MAX_ATTEMPTS = 5

function hashOtp(code: string) {
  return createHmac('sha256', secret()).update(`otp:${code}`).digest('base64url')
}

function signPayload(payload: Record<string, unknown>) {
  const str = JSON.stringify(payload)
  return `${Buffer.from(str).toString('base64url')}.${sign(str)}`
}

export function generateOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function issueOtpToken(code: string, attempts = 0) {
  return signPayload({ exp: Date.now() + OTP_TTL, otpHash: hashOtp(code), attempts })
}

export function readPendingToken(event: Parameters<typeof getCookie>[0]) {
  return getCookie(event, PENDING_COOKIE)
}

export function hasPendingOtp(event: Parameters<typeof getCookie>[0]) {
  return Boolean(readPendingToken(event))
}

export function setPendingOtp(event: Parameters<typeof setCookie>[0], token: string) {
  setCookie(event, PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 5 * 60
  })
}

export function clearPendingOtp(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, PENDING_COOKIE, { path: '/' })
}

export type OtpVerifyResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'expired' | 'max_attempts' | 'wrong'; nextToken?: string }

export function verifyOtp(token: string, code: string): OtpVerifyResult {
  const payload = parseSigned(token)
  if (!payload || typeof payload.exp !== 'number' || typeof payload.otpHash !== 'string') {
    return { ok: false, reason: 'invalid' }
  }
  if (payload.exp < Date.now()) return { ok: false, reason: 'expired' }
  if (typeof payload.attempts !== 'number' || payload.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: 'max_attempts' }
  }
  const submitted = Buffer.from(hashOtp(code))
  const expected = Buffer.from(payload.otpHash)
  if (submitted.length === expected.length && timingSafeEqual(submitted, expected)) {
    return { ok: true }
  }
  const attempts = payload.attempts + 1
  return { ok: false, reason: 'wrong', nextToken: signPayload({ exp: payload.exp, otpHash: payload.otpHash, attempts }) }
}

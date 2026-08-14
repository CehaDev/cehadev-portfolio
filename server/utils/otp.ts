import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { secret, sign, parseSigned } from './session'
import { normalizePhone, waConfigured, sendWhatsApp } from './whatsapp'
import { getMailConfig, sendMail } from './mailer'

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

function waOtpMessage(code: string) {
  return `Kode verifikasi admin CehaDev: ${code}

Kode berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.`
}

function emailOtpHtml(code: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
    <h2 style="margin:0 0 12px;color:#0f172a">Kode Verifikasi Admin</h2>
    <p style="margin:0 0 16px;color:#475569">Gunakan kode berikut untuk menyelesaikan login ke admin panel:</p>
    <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#7c3aed;text-align:center;padding:16px;background:#f5f3ff;border-radius:8px">${code}</div>
    <p style="margin:16px 0 0;color:#94a3b8;font-size:12px">Kode berlaku 5 menit. Jika bukan Anda yang login, abaikan email ini.</p>
  </div>`
}

export type OtpDelivery =
  | { ok: true; channel: 'whatsapp' | 'email' | 'dev'; target: string; devCode: string | null }
  | { ok: false; message: string }

export async function deliverOtp(code: string, wa?: string): Promise<OtpDelivery> {
  const waTarget = wa ? normalizePhone(wa) : ''
  const adminWa = process.env.NUXT_ADMIN_WHATSAPP ? normalizePhone(process.env.NUXT_ADMIN_WHATSAPP) : ''
  if (adminWa && waTarget && waTarget !== adminWa) {
    return { ok: false, message: 'Nomor WhatsApp tidak sesuai dengan akun admin' }
  }

  if (waConfigured() && waTarget) {
    try {
      await sendWhatsApp(waTarget, waOtpMessage(code))
      return { ok: true, channel: 'whatsapp', target: waTarget, devCode: null }
    } catch {
      /* lanjut ke email/fallback */
    }
  }

  const cfg = await getMailConfig()
  const to = process.env.NUXT_ADMIN_EMAIL || cfg?.from || ''
  if (to && cfg) {
    try {
      await sendMail({
        to,
        subject: 'Kode Verifikasi Admin — CehaDev',
        text: `Kode verifikasi Anda: ${code}\n\nKode berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.`,
        html: emailOtpHtml(code)
      })
      return { ok: true, channel: 'email', target: to, devCode: null }
    } catch {
      /* fallback */
    }
  }

  return { ok: true, channel: 'dev', target: '', devCode: code }
}

export function issueOtpToken(
  code: string,
  opts: { attempts?: number; target?: string; channel?: 'whatsapp' | 'email' } = {}
) {
  return signPayload({
    exp: Date.now() + OTP_TTL,
    otpHash: hashOtp(code),
    attempts: opts.attempts ?? 0,
    target: opts.target ?? '',
    channel: opts.channel ?? 'email'
  })
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
  return {
    ok: false,
    reason: 'wrong',
    nextToken: signPayload({
      exp: payload.exp,
      otpHash: payload.otpHash,
      attempts,
      target: typeof payload.target === 'string' ? payload.target : '',
      channel: payload.channel === 'whatsapp' ? 'whatsapp' : 'email'
    })
  }
}

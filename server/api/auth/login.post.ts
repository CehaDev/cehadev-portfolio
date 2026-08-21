import { timingSafeEqual } from 'node:crypto'
import { createError } from 'h3'
import { issueOtp, getAdminEmail } from '../../utils/otp'
import { mailConfigured, sendMail } from '../../utils/mailer'
import { rateLimitOrThrow } from '../../utils/rate-limit'
import { logSecurityEvent } from '../../utils/security-log'

async function sendOtpEmail(code: string) {
  if (!(await mailConfigured())) {
    throw createError({ statusCode: 503, statusMessage: 'SMTP belum dikonfigurasi. Atur di halaman Settings admin.' })
  }
  const to = await getAdminEmail()
  if (!to) {
    throw createError({ statusCode: 500, statusMessage: 'Email admin tidak ditemukan. Atur NUXT_ADMIN_EMAIL atau SMTP di Settings.' })
  }
  await sendMail({
    to,
    subject: `Kode login CehaDev: ${code}`,
    text: `Kode verifikasi login admin Anda adalah ${code}. Berlaku 10 menit. Jika bukan Anda yang login, abaikan email ini.`
  })
}

export default defineEventHandler(async (event) => {
  await rateLimitOrThrow(event, 'login', 5, 15 * 60 * 1000)

  const expected = process.env.NUXT_ADMIN_PASSWORD
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'Password admin belum dikonfigurasi (NUXT_ADMIN_PASSWORD)' })
  }
  const body = await readBody<{ password?: string }>(event)
  const input = body.password ?? ''
  const len = Math.max(input.length, expected.length)
  const inputBuf = Buffer.alloc(len, 0)
  const expectedBuf = Buffer.alloc(len, 0)
  inputBuf.write(input)
  expectedBuf.write(expected)
  if (!input || !timingSafeEqual(inputBuf, expectedBuf)) {
    await logSecurityEvent('login_failed', { ip: event.node?.req?.socket?.remoteAddress })
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }

  const { code } = await issueOtp()

  let smtpOk = true
  try {
    await sendOtpEmail(code)
  } catch {
    smtpOk = false
  }

  issuePending(event)
  if (!smtpOk) {
    if (process.env.NODE_ENV === 'production') {
      throw createError({ statusCode: 503, statusMessage: 'Layanan email sedang bermasalah. Coba lagi nanti.' })
    }
    return { ok: true, pending: true, devCode: code }
  }
  return { ok: true, pending: true }
})

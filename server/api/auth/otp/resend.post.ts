import { createError } from 'h3'
import { issueOtp, getAdminEmail } from '../../../utils/otp'
import { mailConfigured, sendMail } from '../../../utils/mailer'
import { rateLimitOrThrow } from '../../../utils/rate-limit'

export default defineEventHandler(async (event) => {
  rateLimitOrThrow(event, 'otp-resend', 3, 10 * 60 * 1000)

  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login ulang.' })
  }
  const { code } = await issueOtp()

  let smtpOk = true
  try {
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
  } catch {
    smtpOk = false
  }

  return { ok: true, ...(!smtpOk ? { devCode: code } : {}) }
})

import { createError } from 'h3'
import { issueOtp, getAdminEmail } from '../../../utils/otp'
import { mailConfigured, sendMail } from '../../../utils/mailer'

export default defineEventHandler(async (event) => {
  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login ulang.' })
  }
  const { code } = await issueOtp()
  const dev = process.env.NODE_ENV !== 'production'

  if (dev) {
    try {
      if (await mailConfigured()) {
        const to = await getAdminEmail()
        if (to) {
          await sendMail({
            to,
            subject: `Kode login CehaDev: ${code}`,
            text: `Kode verifikasi login admin Anda adalah ${code}. Berlaku 10 menit. Jika bukan Anda yang login, abaikan email ini.`
          })
        }
      }
    } catch {
      /* fallback pengembangan */
    }
  } else {
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

  return { ok: true, ...(dev ? { devCode: code } : {}) }
})

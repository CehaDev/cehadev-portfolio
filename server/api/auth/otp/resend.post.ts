import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = readPendingToken(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login kembali.' })
  }

  const code = generateOtp()
  setPendingOtp(event, issueOtpToken(code))

  const cfg = await getMailConfig()
  const to = process.env.NUXT_ADMIN_EMAIL || cfg?.from || ''
  let devCode: string | null = null

  if (to && cfg) {
    try {
      await sendMail({
        to,
        subject: 'Kode Verifikasi Baru — CehaDev',
        text: `Kode verifikasi baru Anda: ${code}\n\nKode berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="margin:0 0 12px;color:#0f172a">Kode Verifikasi Baru</h2>
          <p style="margin:0 0 16px;color:#475569">Gunakan kode berikut untuk menyelesaikan login ke admin panel:</p>
          <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#7c3aed;text-align:center;padding:16px;background:#f5f3ff;border-radius:8px">${code}</div>
          <p style="margin:16px 0 0;color:#94a3b8;font-size:12px">Kode berlaku 5 menit. Jika bukan Anda yang login, abaikan email ini.</p>
        </div>`
      })
    } catch {
      devCode = code
    }
  } else {
    devCode = code
  }

  return { ok: true, devCode }
})

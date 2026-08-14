import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = readPendingToken(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login kembali.' })
  }

  const body = await readBody<{ code?: string }>(event)
  const code = (body.code ?? '').trim()
  if (!/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 400, statusMessage: 'Kode harus 6 digit angka' })
  }

  const result = verifyOtp(token, code)
  if (!result.ok) {
    if (result.reason === 'wrong' && result.nextToken) {
      setPendingOtp(event, result.nextToken)
    }
    const messages: Record<string, string> = {
      invalid: 'Sesi verifikasi tidak valid. Silakan login kembali.',
      expired: 'Kode verifikasi sudah kedaluwarsa. Kirim ulang kode baru.',
      max_attempts: 'Terlalu banyak percobaan. Silakan login kembali untuk kode baru.',
      wrong: 'Kode verifikasi salah. Coba lagi.'
    }
    throw createError({ statusCode: 400, statusMessage: messages[result.reason] ?? 'Kode verifikasi salah' })
  }

  clearPendingOtp(event)
  setAdminSession(event)
  return { ok: true }
})

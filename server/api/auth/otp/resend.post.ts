import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = readPendingToken(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login kembali.' })
  }

  const payload = parseSigned(token)
  if (!payload || typeof payload.target !== 'string') {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak valid. Silakan login kembali.' })
  }

  const code = generateOtp()
  const delivery = await deliverOtp(code, payload.channel === 'whatsapp' ? payload.target : '')
  if (!delivery.ok) {
    throw createError({ statusCode: 400, statusMessage: delivery.message })
  }

  setPendingOtp(
    event,
    issueOtpToken(code, {
      target: delivery.target,
      channel: delivery.channel === 'whatsapp' ? 'whatsapp' : 'email'
    })
  )
  return { ok: true, devCode: delivery.devCode }
})

import { createError } from 'h3'
import { verifyOtp } from '../../utils/otp'

export default defineEventHandler(async (event) => {
  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login ulang.' })
  }
  const body = await readBody<{ code?: string }>(event)
  await verifyOtp((body.code ?? '').trim())
  setAdminSession(event)
  clearPending(event)
  return { ok: true }
})

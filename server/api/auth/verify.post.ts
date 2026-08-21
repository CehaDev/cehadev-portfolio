import { createError } from 'h3'
import { verifyOtp } from '../../utils/otp'
import { rateLimitOrThrow } from '../../utils/rate-limit'
import { logSecurityEvent } from '../../utils/security-log'

export default defineEventHandler(async (event) => {
  await rateLimitOrThrow(event, 'otp-verify', 5, 10 * 60 * 1000)

  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login ulang.' })
  }
  const body = await readBody<{ code?: string }>(event)
  try {
    await verifyOtp((body.code ?? '').trim())
  } catch (e) {
    await logSecurityEvent('otp_verify_failed', { ip: event.node?.req?.socket?.remoteAddress })
    throw e
  }
  setAdminSession(event)
  clearPending(event)
  await logSecurityEvent('login_success', { ip: event.node?.req?.socket?.remoteAddress })
  return { ok: true }
})

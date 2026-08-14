import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login ulang.' })
  }
  const cfg = await getTotpConfig()
  if (cfg.secret && cfg.enabled) {
    return { active: true }
  }
  const secret = await ensureTotpSecret()
  return {
    active: false,
    secret,
    otpauthUrl: otpauthUrl(secret),
    qrDataUrl: await qrDataUrl(secret)
  }
})

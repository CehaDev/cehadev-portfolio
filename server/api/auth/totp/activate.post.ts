import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  if (!readPending(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Sesi verifikasi tidak ditemukan. Silakan login ulang.' })
  }
  const cfg = await getTotpConfig()
  if (!cfg.secret) {
    throw createError({ statusCode: 400, statusMessage: 'Scan kode QR terlebih dahulu' })
  }
  if (cfg.enabled) {
    throw createError({ statusCode: 409, statusMessage: 'TOTP sudah aktif' })
  }
  const body = await readBody<{ code?: string }>(event)
  const code = (body.code ?? '').replace(/\s/g, '')
  if (!code || !verifyTotp(cfg.secret, code)) {
    throw createError({ statusCode: 400, statusMessage: 'Kode tidak valid' })
  }
  await saveTotp({ secret: cfg.secret, enabled: true, verifiedAt: new Date().toISOString() })
  setAdminSession(event)
  clearPending(event)
  return { ok: true }
})

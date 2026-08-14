import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const secret = await ensureTotpSecret()
  const cfg = await getTotpConfig()
  return {
    enabled: Boolean(cfg.enabled),
    secret,
    otpauthUrl: otpauthUrl(secret),
    qrDataUrl: await qrDataUrl(secret),
    verifiedAt: cfg.verifiedAt ?? null
  }
})

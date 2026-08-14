import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const secret = await ensureTotpSecret()
  const cfg = await getTotpConfig()
  return {
    enabled: Boolean(cfg.enabled),
    secret,
    verifiedAt: cfg.verifiedAt ?? null
  }
})

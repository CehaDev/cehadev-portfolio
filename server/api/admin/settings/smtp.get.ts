export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const stored = await readSmtpSettings()
  return {
    host: stored.host ?? '',
    port: stored.port ?? 465,
    secure: stored.secure ?? true,
    user: stored.user ?? '',
    hasPass: Boolean(stored.pass),
    from: stored.from ?? '',
    fromName: stored.fromName ?? 'CehaDev'
  }
})

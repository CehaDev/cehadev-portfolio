export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody<{ host?: string; port?: number; secure?: boolean; user?: string; pass?: string; from?: string; fromName?: string }>(event)
  const stored = await readSmtpSettings()
  const merged = {
    host: body.host?.trim() ?? stored.host ?? '',
    port: Number(body.port ?? stored.port ?? 465),
    secure: Boolean(body.secure ?? stored.secure ?? true),
    user: body.user?.trim() ?? stored.user ?? '',
    pass: (typeof body.pass === 'string' ? body.pass : undefined) || stored.pass || '',
    from: body.from?.trim() ?? stored.from ?? '',
    fromName: body.fromName?.trim() ?? stored.fromName ?? 'CehaDev'
  }
  return testMailConnection(merged)
})

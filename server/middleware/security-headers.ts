export default defineEventHandler((event) => {
  if (!event.path?.startsWith('/api/')) return

  setResponseHeader(event, 'x-content-type-options', 'nosniff')
  setResponseHeader(event, 'x-frame-options', 'DENY')
  setResponseHeader(event, 'x-xss-protection', '1; mode=block')
  setResponseHeader(event, 'referrer-policy', 'no-referrer')
  setResponseHeader(event, 'strict-transport-security', 'max-age=31536000; includeSubDomains')
  setResponseHeader(event, 'x-permitted-cross-domain-policies', 'none')
  setResponseHeader(event, 'content-security-policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'")
})

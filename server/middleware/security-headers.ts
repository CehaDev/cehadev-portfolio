import { removeResponseHeader, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  removeResponseHeader(event, 'x-powered-by')
  setResponseHeader(event, 'x-content-type-options', 'nosniff')
  setResponseHeader(event, 'x-frame-options', 'DENY')
  setResponseHeader(event, 'referrer-policy', 'no-referrer')
  setResponseHeader(event, 'strict-transport-security', 'max-age=31536000; includeSubDomains')
  setResponseHeader(event, 'x-permitted-cross-domain-policies', 'none')
  setResponseHeader(
    event,
    'content-security-policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'"
  )
})

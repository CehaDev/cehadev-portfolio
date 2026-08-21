export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const proto = getRequestHeader(event, 'x-forwarded-proto') || url.protocol.replace(':', '')
  const host = getRequestHeader(event, 'x-forwarded-host') || getRequestHeader(event, 'host') || url.host

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${proto}://${host}/sitemap.xml`,
    ''
  ].join('\n')
})

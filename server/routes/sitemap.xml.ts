import { listProjectFiles, readProjectFile } from '../utils/projects'

function entry(loc: string, priority: string) {
  return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const proto = getRequestHeader(event, 'x-forwarded-proto') || url.protocol.replace(':', '')
  const host = getRequestHeader(event, 'x-forwarded-host') || getRequestHeader(event, 'host') || url.host
  const origin = `${proto}://${host}`

  const staticPaths: Array<[string, string]> = [
    ['/', '1.0'],
    ['/projects', '0.9'],
    ['/about', '0.8'],
    ['/skills', '0.8'],
    ['/contact', '0.7'],
    ['/cv', '0.6']
  ]

  const urls = staticPaths.map(([p, pr]) => entry(`${origin}${p}`, pr))

  const slugs = await listProjectFiles()
  for (const slug of slugs) {
    try {
      const p = (await readProjectFile(slug)) as { archived?: boolean }
      if (p.archived) continue
    } catch {
      continue
    }
    urls.push(entry(`${origin}/projects/${slug}`, '0.7'))
  }

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
})

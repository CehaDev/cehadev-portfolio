const MAX_INPUT = 300_000

export default defineEventHandler(async (event) => {
  const body = await readBody<{ md?: string; code?: string; lang?: string }>(event).catch(() => null)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Body tidak valid' })
  }

  const md = typeof body.md === 'string' ? body.md : ''
  const code = typeof body.code === 'string' ? body.code : ''
  if (!md.trim() && !code.trim()) {
    return { html: '' }
  }
  if (md.length > MAX_INPUT || code.length > MAX_INPUT) {
    throw createError({ statusCode: 413, statusMessage: 'Konten terlalu besar' })
  }

  try {
    if (code.trim()) {
      const lang = typeof body.lang === 'string' ? body.lang : ''
      return { html: await highlightCode(code, lang) }
    }
    return { html: await renderMarkdown(md) }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Gagal merender konten' })
  }
})

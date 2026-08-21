import { createError } from 'h3'
import { del } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url?: string }>(event)
  if (!body?.url || typeof body.url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'URL gambar wajib diisi' })
  }

  try {
    await del(body.url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Gagal menghapus gambar' })
  }

  return { ok: true }
})

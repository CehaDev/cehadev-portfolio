import { unlink } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

const uploadsDir = path.resolve(process.cwd(), 'public/uploads/projects')

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url?: string }>(event)
  if (!body?.url || typeof body.url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'URL gambar wajib diisi' })
  }

  if (!body.url.startsWith('/uploads/projects/')) {
    throw createError({ statusCode: 400, statusMessage: 'URL tidak valid' })
  }

  const filename = path.basename(body.url)
  if (!filename || filename !== body.url.split('/').pop()) {
    throw createError({ statusCode: 400, statusMessage: 'Filename tidak valid' })
  }

  const filePath = path.resolve(uploadsDir, filename)
  if (!filePath.startsWith(uploadsDir + path.sep)) {
    throw createError({ statusCode: 400, statusMessage: 'Path tidak valid' })
  }

  await unlink(filePath).catch(() => {})

  return { ok: true }
})

import { mkdir, writeFile, unlink, readdir } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const EXTS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif'
}

const uploadsDir = path.resolve(process.cwd(), 'public/uploads/projects')
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'image' && p.filename)
  if (!file?.data || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'File gambar wajib diisi' })
  }
  if (!ALLOWED.has(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Format gambar harus JPG, PNG, WEBP, atau AVIF' })
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'Ukuran gambar maksimal 10 MB' })
  }

  await mkdir(uploadsDir, { recursive: true })

  const filename = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${EXTS[file.type]}`
  await writeFile(path.join(uploadsDir, filename), file.data)

  return { ok: true, url: `/uploads/projects/${filename}` }
})

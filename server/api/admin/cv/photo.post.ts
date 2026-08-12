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

const uploadsDir = path.resolve(process.cwd(), 'public/uploads')
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'photo' && p.filename)
  if (!file?.data || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'File foto wajib diisi' })
  }
  if (!ALLOWED.has(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Format foto harus JPG, PNG, WEBP, atau AVIF' })
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'Ukuran foto maksimal 5 MB' })
  }

  await mkdir(uploadsDir, { recursive: true })

  // Bersihkan upload CV lama agar tidak menumpuk
  const oldFiles = (await readdir(uploadsDir)).filter((f) => f.startsWith('cv-photo-'))
  for (const f of oldFiles) {
    await unlink(path.join(uploadsDir, f)).catch(() => {})
  }

  const filename = `cv-photo-${Date.now()}${EXTS[file.type]}`
  await writeFile(path.join(uploadsDir, filename), file.data)

  return { ok: true, url: `/uploads/${filename}` }
})

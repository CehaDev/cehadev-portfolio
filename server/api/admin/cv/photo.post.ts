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

function validateMagicBytes(data: Buffer, expectedType: string): boolean {
  const signatures: Record<string, number[][]> = {
    'image/jpeg': [[0xff, 0xd8, 0xff]],
    'image/png': [[0x89, 0x50, 0x4e, 0x47]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]],
    'image/avif': [[0x00, 0x00, 0x00]]
  }
  const sigs = signatures[expectedType]
  if (!sigs) return false
  return sigs.some((sig) => sig.every((byte, i) => data[i] === byte))
}

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'photo' && p.filename)
  if (!file?.data || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'File foto wajib diisi' })
  }
  if (!ALLOWED.has(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Format foto harus JPG, PNG, WEBP, atau AVIF' })
  }
  if (!validateMagicBytes(file.data, file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'File tidak sesuai dengan format yang dinyatakan' })
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

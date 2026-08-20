import { createError } from 'h3'
import { put, list, del } from '@vercel/blob'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

function validateMagicBytes(data: Uint8Array, expectedType: string): boolean {
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

  const oldBlobs = await list({ prefix: 'cv-photo-' })
  for (const blob of oldBlobs.blobs) {
    await del(blob.url).catch(() => {})
  }

  const ext = file.type === 'image/jpeg' ? '.jpg' : file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.avif'
  const filename = `cv-photo-${Date.now()}${ext}`

  const blob = await put(filename, file.data, {
    access: 'public',
    contentType: file.type
  })

  return { ok: true, url: blob.url }
})

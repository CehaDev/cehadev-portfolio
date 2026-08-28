import { storage } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key') ?? ''
  if (!key || !/^[a-f0-9]+\.(jpg|png|webp|gif|ogg|mp3|m4a|webm)$/i.test(key)) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }
  const file = await storage().get(key)
  if (!file) throw createError({ statusCode: 404, message: 'Not found' })
  const mime = mimeFromExt(key)
  setHeader(event, 'content-type', mime)
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return file.bytes
})

function mimeFromExt(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    ogg: 'audio/ogg',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    webm: 'audio/webm'
  }
  return map[ext || ''] || 'application/octet-stream'
}

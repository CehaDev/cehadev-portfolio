import { storeMedia, assertMediaPermission } from '../../utils/media-manager'
import { adminActorContext } from '../../utils/admin-context'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  assertMediaPermission(adminActorContext())
  const multipart = await readMultipartFormData(event)
  const file = multipart?.find((p) => p.name === 'file')
  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'File tidak ditemukan (field "file")' })
  }
  const mimeType = String(file.type || 'application/octet-stream')
  const meta: Record<string, unknown> = {}
  const title = multipart?.find((p) => p.name === 'title' && p.data)?.data?.toString('utf8')
  if (title) meta.title = title
  return await storeMedia({ data: file.data, mimeType, metadata: meta, actorId: 'api-user' })
})

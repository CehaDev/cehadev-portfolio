import { deleteMedia, assertMediaPermission } from '../../../utils/media-manager'
import { adminActorContext } from '../../../utils/admin-context'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  assertMediaPermission(adminActorContext())
  const id = getRouterParam(event, 'id') ?? ''
  if (!id) throw createError({ statusCode: 400, message: 'id wajib diisi' })
  return await deleteMedia(id, 'api-user')
})

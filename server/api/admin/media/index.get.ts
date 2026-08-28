import { listMedia, assertMediaPermission } from '../../../utils/media-manager'
import { adminActorContext } from '../../../utils/admin-context'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  assertMediaPermission(adminActorContext())
  const query = getQuery(event)
  const limit = query.limit ? Number(query.limit) : 50
  return await listMedia(limit)
})

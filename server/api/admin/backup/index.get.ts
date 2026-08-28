import { listBackups } from '../../../utils/backup'
import { adminActorContext } from '../../../utils/admin-context'
import { PERMISSIONS } from '../../../utils/permissions'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const ctx = adminActorContext().ctx
  if (!ctx.permissions.includes(PERMISSIONS.ADMIN_READ)) {
    throw createError({ statusCode: 403, message: 'Akses ditolak' })
  }
  return await listBackups()
})

import { getOverview, setMetricsCollector } from '../../../utils/monitoring'
import { adminActorContext } from '../../../utils/admin-context'
import { PERMISSIONS } from '../../../utils/permissions'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const ctx = adminActorContext().ctx
  if (!ctx.permissions.includes(PERMISSIONS.MONITORING_READ) && !ctx.permissions.includes(PERMISSIONS.ADMIN_READ)) {
    throw createError({ statusCode: 403, message: 'Akses ditolak' })
  }
  const base = process.env.SITE_URL || 'https://chdev.online'
  return await getOverview(base)
})

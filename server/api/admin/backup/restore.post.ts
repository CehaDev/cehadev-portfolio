import { restoreBackup, listBackups } from '../../../utils/backup'
import { adminActorContext } from '../../../utils/admin-context'
import { PERMISSIONS } from '../../../utils/permissions'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const ctx = adminActorContext().ctx
  if (!ctx.permissions.includes(PERMISSIONS.ADMIN_READ)) {
    throw createError({ statusCode: 403, message: 'Akses ditolak' })
  }
  const body = await readBody(event) as { name?: string }
  const name = String(body.name ?? '')
  if (!name) throw createError({ statusCode: 400, message: 'name wajib diisi' })
  if (!/^backup-[\dT:-]+\.json\.gz$/.test(name)) {
    throw createError({ statusCode: 400, message: 'nama backup tidak valid' })
  }
  const backups = await listBackups(1000)
  const rec = backups.find((b) => b.name === name)
  if (!rec) throw createError({ statusCode: 404, message: 'file backup tidak ditemukan' })
  return await restoreBackup(rec.file)
})

import type { UserContext } from './telegram-identity'
import { PERMISSIONS, type Permission } from './permissions'

/**
 * Context untuk permintaan dari sesi admin yang sudah terautentikasi (requireAdmin).
 * Menjalankan seluruh permission admin. Pemetaan ke role/permission granular
 * merupakan tanggung jawab Phase 7 (Security Hardening).
 */
export function adminActorContext(): { ctx: UserContext } {
  const permissions = Object.values(PERMISSIONS) as Permission[]
  return {
    ctx: {
      telegramUserId: '',
      username: 'admin',
      isWhitelisted: true,
      adminUserId: '',
      roleId: 'admin',
      roleName: 'Admin',
      permissions
    }
  }
}

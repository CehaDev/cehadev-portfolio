import { revokeAllSessions } from '../../utils/session'

export default defineEventHandler(async (event) => {
  clearAdminSession(event)
  await revokeAllSessions()
  return { ok: true }
})

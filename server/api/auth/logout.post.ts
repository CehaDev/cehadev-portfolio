export default defineEventHandler((event) => {
  clearAdminSession(event)
  clearPendingOtp(event)
  return { ok: true }
})

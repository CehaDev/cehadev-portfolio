export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  const authenticated = isSessionValid(token)
  return { authenticated, pending: !authenticated && readPending(event) }
})

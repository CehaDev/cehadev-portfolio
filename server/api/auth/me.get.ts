export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  const authenticated = await isSessionValid(token)
  return { authenticated }
})

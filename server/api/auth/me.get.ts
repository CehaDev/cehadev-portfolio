export default defineEventHandler((event) => {
  const token = getCookie(event, SESSION_COOKIE)
  return { authenticated: isSessionValid(token) }
})

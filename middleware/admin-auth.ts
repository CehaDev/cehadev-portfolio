export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const requestFetch = useRequestFetch()
  try {
    const me = await requestFetch<{ authenticated: boolean }>('/api/auth/me')
    if (me.authenticated) return
  } catch {
    /* session tidak valid */
  }
  return navigateTo('/admin/login')
})

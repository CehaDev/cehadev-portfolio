export default defineNuxtRouteMiddleware(async (to) => {
  const requestFetch = useRequestFetch()
  try {
    const me = await requestFetch<{ authenticated: boolean; pending: boolean }>('/api/auth/me')
    if (me.authenticated) return
    if (me.pending) {
      if (to.path === '/admin/verify') return
      return navigateTo('/admin/verify')
    }
  } catch {
    /* session tidak valid */
  }
  if (to.path === '/admin/login') return
  return navigateTo('/admin/login')
})

export default defineNuxtRouteMiddleware(async (to) => {
  let me: { authenticated: boolean; pending: boolean } | null = null
  try {
    me = await useRequestFetch()<{ authenticated: boolean; pending: boolean }>('/api/auth/me')
  } catch {
    /* sesi tidak valid */
  }

  if (to.path === '/admin/login') {
    if (me?.authenticated) return navigateTo('/admin')
    return
  }

  if (to.path === '/admin/verify') {
    if (me?.authenticated) return navigateTo('/admin')
    if (me?.pending) return
    return navigateTo('/admin/login')
  }

  if (me?.authenticated) return
  return navigateTo('/admin/login')
})

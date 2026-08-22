export default defineNuxtRouteMiddleware(async (to) => {
  let me: { authenticated: boolean } | null = null
  try {
    me = await useRequestFetch()<{ authenticated: boolean }>('/api/auth/me')
  } catch {
    /* sesi tidak valid */
  }

  if (to.path === '/admin/login') {
    if (me?.authenticated) return navigateTo('/admin')
    return
  }

  if (me?.authenticated) return
  return navigateTo('/admin/login')
})

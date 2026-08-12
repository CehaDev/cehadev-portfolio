import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const expected = process.env.NUXT_ADMIN_PASSWORD
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'Password admin belum dikonfigurasi (NUXT_ADMIN_PASSWORD)' })
  }
  const body = await readBody<{ password?: string }>(event)
  if (!body.password || body.password !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }
  setAdminSession(event)
  return { ok: true }
})

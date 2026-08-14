import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const expected = process.env.NUXT_ADMIN_PASSWORD
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'Password admin belum dikonfigurasi (NUXT_ADMIN_PASSWORD)' })
  }
  const body = await readBody<{ password?: string; wa?: string }>(event)
  if (!body.password || body.password !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }

  const code = generateOtp()
  const delivery = await deliverOtp(code, body.wa ?? '')
  if (!delivery.ok) {
    throw createError({ statusCode: 400, statusMessage: delivery.message })
  }

  clearAdminSession(event)
  setPendingOtp(
    event,
    issueOtpToken(code, {
      target: delivery.target,
      channel: delivery.channel === 'whatsapp' ? 'whatsapp' : 'email'
    })
  )

  return { ok: true, pending: true, devCode: delivery.devCode }
})

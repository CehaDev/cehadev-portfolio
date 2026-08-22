import { timingSafeEqual } from 'node:crypto'
import { createError } from 'h3'
import { rateLimitOrThrow } from '../../utils/rate-limit'
import { logSecurityEvent } from '../../utils/security-log'
import { setAdminSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  await rateLimitOrThrow(event, 'login', 5, 15 * 60 * 1000)

  const expected = process.env.NUXT_ADMIN_PASSWORD
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'Password admin belum dikonfigurasi (NUXT_ADMIN_PASSWORD)' })
  }
  const body = await readBody<{ password?: string }>(event)
  const input = body.password ?? ''
  const len = Math.max(input.length, expected.length)
  const inputBuf = Buffer.alloc(len, 0)
  const expectedBuf = Buffer.alloc(len, 0)
  inputBuf.write(input)
  expectedBuf.write(expected)
  if (!input || !timingSafeEqual(inputBuf, expectedBuf)) {
    await logSecurityEvent('login_failed', { ip: event.node?.req?.socket?.remoteAddress })
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }

  await setAdminSession(event)
  return { ok: true }
})

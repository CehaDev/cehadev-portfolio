import { rateLimitOrThrow } from '../utils/rate-limit'

export default defineEventHandler(async (event) => {
  rateLimitOrThrow(event, 'contact', 5, 10 * 60 * 1000)

  const body = await readBody<{ name?: string; email?: string; subject?: string; message?: string }>(event)
  return await addContactMessage({
    name: typeof body.name === 'string' ? body.name : '',
    email: typeof body.email === 'string' ? body.email : '',
    subject: typeof body.subject === 'string' ? body.subject : '',
    message: typeof body.message === 'string' ? body.message : ''
  })
})

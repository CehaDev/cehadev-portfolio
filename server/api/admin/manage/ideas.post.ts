import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  if (!body || typeof body !== 'object') throw createError({ statusCode: 400, message: 'Body invalid' })
  const idea = await createIdea(body)
  return { ok: true, idea }
})

import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { enabled } = await getChatConfig()
  if (!enabled) {
    throw createError({ statusCode: 403, statusMessage: 'Chat sedang nonaktif' })
  }

  const body = await readBody<{ conversationId?: string; name?: string; email?: string; text?: string }>(event)
  if (typeof body.text !== 'string' || !body.text.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Pesan wajib diisi' })
  }

  const result = await addVisitorMessage({
    conversationId: typeof body.conversationId === 'string' ? body.conversationId : undefined,
    name: typeof body.name === 'string' ? body.name : '',
    email: typeof body.email === 'string' ? body.email : '',
    text: body.text
  })

  return result
})

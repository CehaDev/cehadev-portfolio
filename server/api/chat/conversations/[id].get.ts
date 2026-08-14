import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const conv = await findConversation(id)
  if (!conv) {
    throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  }
  return { id: conv.id, status: conv.status, messages: conv.messages }
})

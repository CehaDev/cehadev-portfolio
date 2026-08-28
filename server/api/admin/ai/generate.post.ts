import { generateArticlePipeline, type WritingMode } from '../../../utils/ai-pipeline'
import { adminActorContext } from '../../../utils/admin-context'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const topic = String(body.topic ?? body.idea ?? '')
  if (!topic.trim()) {
    throw createError({ statusCode: 400, message: 'topic/idea wajib diisi' })
  }
  const mode = String(body.mode ?? 'AI').toUpperCase() as WritingMode
  if (!['HUMAN', 'AI', 'HUMAN_AI'].includes(mode)) {
    throw createError({ statusCode: 400, message: 'mode harus HUMAN, AI, atau HUMAN_AI' })
  }
  const outline = body.outline ? String(body.outline) : undefined
  const articleId = body.articleId ? String(body.articleId) : undefined
  return await generateArticlePipeline(topic, adminActorContext(), { mode, outline, articleId })
})

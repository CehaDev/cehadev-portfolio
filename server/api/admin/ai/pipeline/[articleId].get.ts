import { getPipelineByArticleId } from '../../../../utils/ai-pipeline'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const articleId = getRouterParam(event, 'articleId') ?? ''
  if (!articleId) throw createError({ statusCode: 400, message: 'articleId wajib diisi' })
  const pipeline = await getPipelineByArticleId(articleId)
  if (!pipeline) throw createError({ statusCode: 404, message: 'Pipeline tidak ditemukan' })
  return pipeline
})

import { humanApproveArticle } from '../../../utils/ai-pipeline'
import { adminActorContext } from '../../../utils/admin-context'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event) as { articleId?: string; id?: string }
  const articleId = String(body.articleId ?? body.id ?? '')
  if (!articleId) throw createError({ statusCode: 400, message: 'articleId wajib diisi' })
  const article = await humanApproveArticle(articleId, adminActorContext())
  return { approved: true, article }
})

import { rateLimitOrThrow } from '../../../../utils/rate-limit'

export default defineEventHandler(async (event) => {
  await rateLimitOrThrow(event, 'article-comment', 5, 10 * 60 * 1000)

  const slug = getRouterParam(event, 'slug') ?? ''
  const body = await readBody<{ name?: string; message?: string; parentId?: string }>(event)
  return await addArticleComment({
    articleSlug: slug,
    name: typeof body.name === 'string' ? body.name : '',
    message: typeof body.message === 'string' ? body.message : '',
    parentId: typeof body.parentId === 'string' ? body.parentId : ''
  })
})

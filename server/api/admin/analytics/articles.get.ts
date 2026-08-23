export default defineEventHandler(async () => {
  return await getArticlesAnalytics(30)
})

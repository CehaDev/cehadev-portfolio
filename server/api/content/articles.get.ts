export default defineEventHandler(async () => {
  const slugs = await listArticleFiles()
  const articles = []
  for (const slug of slugs) {
    try {
      articles.push(await readArticleFile(slug))
    } catch {}
  }
  return articles.filter((a: any) => a.status === 'published')
})

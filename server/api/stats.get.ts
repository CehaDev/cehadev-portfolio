export default defineEventHandler(async () => {
  const visits = await listVisits()
  const sessions = new Set<string>()
  const projectViews = new Map<string, number>()
  let fromGoogle = 0
  let direct = 0
  let other = 0

  for (const v of visits) {
    if (v.session) sessions.add(v.session)
    if (v.path.startsWith('/projects/')) {
      const slug = v.path.replace('/projects/', '').split('/')[0]
      projectViews.set(slug, (projectViews.get(slug) ?? 0) + 1)
    }
    if (/google\./i.test(v.referrer) && /search|url\?/i.test(v.referrer)) fromGoogle++
    else if (!v.referrer) direct++
    else other++
  }

  return {
    total: { views: visits.length, visitors: sessions.size },
    sources: [
      { label: 'Google', value: fromGoogle },
      { label: 'Langsung', value: direct },
      { label: 'Lainnya', value: other }
    ],
    projects: [...projectViews.entries()]
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
  }
})

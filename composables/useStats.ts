export interface SiteStats {
  total: { views: number; visitors: number }
  sources: Array<{ label: string; value: number }>
  projects: Array<{ slug: string; views: number }>
}

let promise: Promise<SiteStats | null> | null = null

function load() {
  if (!promise) {
    promise = $fetch<SiteStats>('/api/stats')
      .catch(() => null)
  }
  return promise
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}jt`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export function useStats() {
  const data = ref<SiteStats | null>(null)

  onMounted(async () => {
    data.value = await load()
  })

  const viewsOf = (slug: string) => {
    const found = data.value?.projects.find((p) => p.slug === slug)
    return found?.views ?? 0
  }

  const sourceOf = (label: string) => data.value?.sources.find((s) => s.label === label)?.value ?? 0

  return { data, viewsOf, sourceOf, formatCount }
}

<script setup lang="ts">
import { Newspaper, Search, X, ArrowDownWideNarrow, Sparkles, CalendarDays, Clock3, TrendingUp } from 'lucide-vue-next'

const { data: articles } = await useArticlesContent()
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('articles.heroHead1')} ${t('articles.heroHead2')} | CehaDev`,
  description: () => t('articles.heroDesc')
})
useCanonical('/articles')

const query = ref('')
const activeCategory = ref('')
const activeTag = ref('')
const sortBy = ref<'newest' | 'oldest' | 'az'>('newest')
const visibleCount = ref(6)

const allList = computed<any[]>(() => {
  const list = [...((articles.value ?? []) as any[])]
  return list.sort((a, b) => String(b.datePublished ?? '').localeCompare(String(a.datePublished ?? '')))
})

const categories = computed(() => {
  const set = new Set<string>()
  for (const a of allList.value) if (a.category) set.add(a.category as string)
  return [t('articles.allCategory'), ...set]
})

const topTags = computed(() => {
  const counts = new Map<string, number>()
  for (const a of allList.value) for (const tg of (a.tags as string[]) ?? []) counts.set(tg, (counts.get(tg) ?? 0) + 1)
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([tag]) => tag)
})

function matchesQuery(a: Record<string, unknown>) {
  const q = query.value.trim().toLowerCase()
  if (!q) return true
  const hay = [a.title, a.excerpt, a.slug, ...(Array.isArray(a.tags) ? a.tags : [])]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

const filtered = computed(() => {
  let list = allList.value
  const all = activeCategory.value === '' || activeCategory.value === t('articles.allCategory')
  if (!all) list = list.filter((a: any) =>a.category === activeCategory.value)
  if (activeTag.value) list = list.filter((a: any) =>((a.tags as string[]) ?? []).includes(activeTag.value))
  list = list.filter(matchesQuery)
  if (sortBy.value === 'oldest') list = [...list].reverse()
  else if (sortBy.value === 'az') list = [...list].sort((x, y) => String(x.title).localeCompare(String(y.title)))
  return list
})

const hasActiveFilter = computed(
  () => query.value.trim() !== '' || !(activeCategory.value === '' || activeCategory.value === t('articles.allCategory')) || !!activeTag.value || sortBy.value !== 'newest'
)

// ---- Bento editorial: 1 artikel utama + 2 pendamping ----
const featured = computed(() => (hasActiveFilter.value ? null : allList.value[0] ?? null))
const bentoSlugs = computed(() => {
  if (!featured.value) return []
  return filtered.value
    .filter((a: any) =>a.slug !== featured.value!.slug)
    .slice(0, 2)
    .map((a: any) => a.slug)
})
const bentoSide = computed(() =>
  bentoSlugs.value.map((slug: string) => allList.value.find((a: any) => a.slug === slug)).filter(Boolean)
)
const gridList = computed(() => {
  let list = filtered.value
  if (featured.value) list = list.filter((a: any) =>a.slug !== featured.value!.slug)
  return list.filter((a: any) =>!bentoSlugs.value.includes(a.slug))
})
const visibleList = computed(() => gridList.value.slice(0, visibleCount.value))

watch([query, activeCategory, activeTag, sortBy], () => {
  visibleCount.value = 6
})

function resetFilters() {
  query.value = ''
  activeCategory.value = ''
  activeTag.value = ''
  sortBy.value = 'newest'
}

function categoryCount(cat: string) {
  return cat === t('articles.allCategory') ? allList.value.length : allList.value.filter((a: any) =>a.category === cat).length
}

function readingMin(text: string) {
  return Math.max(1, Math.round(String(text ?? '').trim().split(/\s+/).filter(Boolean).length / 200))
}

const totalArticles = computed(() => allList.value.length)

const statItems = computed(() => [
  { label: 'Artikel', value: String(totalArticles.value) },
  { label: 'Kategori', value: String(categories.value.length - 1) },
  { label: 'Tag', value: String(new Set(allList.value.flatMap((a: any) => (a.tags as string[]) ?? [])).size) }
])

const dateLabelShort = (d: string) => {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

const gradients = ['from-violet-500 to-indigo-600', 'from-cyan-500 to-blue-600', 'from-emerald-500 to-lime-600', 'from-amber-500 to-rose-600']
const gradientFor = (slug: string) => gradients[slug.length % gradients.length]
</script>

<template>
  <div class="container-site min-h-[calc(100vh-76px)] py-14 md:py-16">
    <!-- HERO EDITORIAL -->
    <Reveal direction="up" :parallax="10">
      <section class="card relative overflow-hidden p-7 md:p-10">
        <div class="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div class="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

        <div class="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <span class="inline-flex items-center gap-2 rounded-full border border-border bg-bg-alt px-4 py-1.5 font-mono text-xs text-text-secondary">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
              {{ t('articles.badge') }}
            </span>
            <h1 class="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl">
              {{ t('articles.heroHead1') }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ t('articles.heroHead2') }}</span>
            </h1>
            <p class="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              {{ t('articles.heroDesc') }}
            </p>
          </div>

          <!-- Stat chips -->
          <div class="flex gap-3">
            <div
              v-for="(s, i) in statItems"
              :key="s.label"
              class="min-w-[86px] rounded-card border border-border bg-bg-alt/60 px-4 py-3 backdrop-blur-sm"
              :class="i > 0 ? 'hidden sm:block' : ''"
            >
              <p class="bg-gradient-brand bg-clip-text font-mono text-2xl font-extrabold leading-none text-transparent">{{ s.value }}</p>
              <p class="mt-1 text-[11px] font-medium text-text-muted">{{ s.label }}</p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>

    <!-- PANEL KONTROL: pencarian + urutan -->
    <div class="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted" aria-hidden="true">
          <Search :size="16" :stroke-width="1.75" />
        </span>
        <input
          v-model="query"
          type="search"
          class="input-field !pl-11 !pr-10"
          :placeholder="t('articles.searchPlaceholder')"
          :aria-label="t('articles.searchAria')"
        />
        <button
          v-if="query"
          type="button"
          class="absolute inset-y-0 right-3 my-auto flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-alt hover:text-text"
          :aria-label="t('articles.resetFilter')"
          @click="query = ''"
        >
          <X :size="14" :stroke-width="2" />
        </button>
      </div>
      <div class="relative sm:w-44">
        <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted" aria-hidden="true">
          <ArrowDownWideNarrow :size="15" :stroke-width="1.75" />
        </span>
        <select v-model="sortBy" class="input-field !pl-11" :aria-label="t('articles.sortAria')">
          <option value="newest">{{ t('articles.sortNewest') }}</option>
          <option value="oldest">{{ t('articles.sortOldest') }}</option>
          <option value="az">{{ t('articles.sortAz') }}</option>
        </select>
      </div>
    </div>

    <!-- FILTER KATEGORI + TAG -->
    <div v-if="categories.length > 1 || topTags.length" class="mt-5 space-y-3">
      <div v-if="categories.length > 1" class="flex flex-wrap justify-center gap-2.5" role="tablist" :aria-label="t('articles.filterAria')">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          role="tab"
          :aria-selected="activeCategory === cat || (activeCategory === '' && cat === t('articles.allCategory'))"
          class="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
          :class="(activeCategory === cat || (activeCategory === '' && cat === t('articles.allCategory')))
            ? 'border-transparent bg-gradient-brand text-white shadow-btn-glow'
            : 'border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text'"
          @click="activeCategory = cat"
        >
          {{ cat }}
          <span class="ml-1.5 text-xs" :class="(activeCategory === cat || (activeCategory === '' && cat === t('articles.allCategory'))) ? 'text-white/80' : 'text-text-muted'">({{ categoryCount(cat) }})</span>
        </button>
      </div>

      <div v-if="topTags.length" class="flex flex-wrap justify-center gap-2" role="group" :aria-label="t('articles.tagFilterAria')">
        <button
          v-for="tag in topTags"
          :key="tag"
          type="button"
          class="rounded-full border px-3 py-1 font-mono text-[11px] transition-all duration-300"
          :class="activeTag === tag
            ? 'border-primary/60 bg-primary/15 text-primary'
            : 'border-border/70 bg-transparent text-text-muted hover:border-primary/40 hover:text-text-secondary'"
          @click="activeTag = activeTag === tag ? '' : tag"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- BENTO: artikel unggulan + 2 terbaru -->
    <div v-if="featured && bentoSide.length" class="mt-12 grid gap-6 lg:grid-cols-5">
      <!-- Kartu utama besar -->
      <Reveal direction="left" :parallax="12" class="lg:col-span-3">
        <article class="group relative min-h-[400px] overflow-hidden rounded-card border border-border shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover">
          <NuxtLink :to="`/articles/${featured.slug}`" class="absolute inset-0" aria-hidden="true" tabindex="-1">
            <img
              v-if="featured.cover"
              :src="featured.cover"
              :alt="featured.title"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span v-else class="block h-full w-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-105" :class="gradientFor(featured.slug)">
              <span class="flex h-full w-full items-center justify-center font-mono text-7xl font-extrabold text-white/90">&lt;/&gt;</span>
            </span>
            <span class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true" />
          </NuxtLink>

          <div class="relative flex h-full min-h-[400px] flex-col justify-end p-7 md:p-9">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                <Sparkles :size="11" :stroke-width="2" aria-hidden="true" />
                {{ t('articles.latestPost') }}
              </span>
              <span v-if="featured.category" class="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {{ featured.category }}
              </span>
            </div>
            <NuxtLink :to="`/articles/${featured.slug}`" class="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-white transition-colors hover:text-primary-violet md:text-3xl">
              {{ featured.title }}
            </NuxtLink>
            <p class="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/75">{{ featured.excerpt }}</p>
            <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-white/70">
              <span class="inline-flex items-center gap-1.5">
                <CalendarDays :size="13" :stroke-width="1.75" aria-hidden="true" />
                {{ dateLabelShort(featured.datePublished) }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Clock3 :size="13" :stroke-width="1.75" aria-hidden="true" />
                {{ t('articles.readTime', { min: readingMin(`${featured.excerpt} ${featured.title}`) }) }}
              </span>
            </div>
          </div>
        </article>
      </Reveal>

      <!-- Dua kartu pendamping vertikal -->
      <div class="flex flex-col gap-6 lg:col-span-2">
        <Reveal v-for="(a, i) in bentoSide" :key="a!.slug" :delay="100 + i * 90" direction="up" :parallax="10">
          <NuxtLink
            :to="`/articles/${a!.slug}`"
            class="card group flex h-full gap-4 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
          >
            <span class="relative block w-32 shrink-0 self-stretch overflow-hidden sm:w-36" aria-hidden="true">
              <img
                v-if="a!.cover"
                :src="a!.cover"
                :alt="a!.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105" :class="gradientFor(a!.slug)">
                <span class="font-mono text-2xl font-extrabold text-white/90">&lt;/&gt;</span>
              </span>
            </span>
            <span class="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-4 pr-4">
              <span v-if="a!.category" class="text-[10px] font-bold uppercase tracking-wider text-primary">{{ a!.category }}</span>
              <span class="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-text transition-colors duration-300 group-hover:text-primary">
                {{ a!.title }}
              </span>
              <span class="line-clamp-2 text-xs leading-relaxed text-text-muted">{{ a!.excerpt }}</span>
              <span class="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
                <TrendingUp :size="11" :stroke-width="1.75" aria-hidden="true" />
                {{ dateLabelShort(a!.datePublished) }}
              </span>
            </span>
          </NuxtLink>
        </Reveal>
      </div>
    </div>

    <!-- GRID ARTIKEL -->
    <div v-if="visibleList.length" class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal v-for="(a, i) in visibleList" :key="a.slug" :delay="(i % 3) * 80" :direction="i % 2 === 0 ? 'left' : 'up'" :parallax="10 + (i % 3) * 4">
        <ArticleCard :article="a as any" />
      </Reveal>
    </div>

    <!-- LOAD MORE + counter -->
    <div v-if="gridList.length > visibleCount || hasActiveFilter" class="mt-10 flex flex-col items-center gap-3">
      <button v-if="gridList.length > visibleCount" type="button" class="btn-outline !px-6 !py-3 text-sm" @click="visibleCount += 6">
        {{ t('articles.loadMore') }}
      </button>
      <p class="font-mono text-[11px] text-text-muted">
        {{ t('articles.showingOf', { shown: visibleList.length, total: gridList.length }) }}
      </p>
    </div>

    <!-- EMPTY -->
    <div v-if="!filtered.length" class="card mt-10 flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
        <Newspaper :size="22" :stroke-width="1.75" />
      </span>
      <p class="text-sm font-medium text-text-secondary">{{ hasActiveFilter ? t('articles.noResults') : t('articles.empty') }}</p>
      <button v-if="hasActiveFilter" type="button" class="btn-outline mt-1 !px-5 !py-2.5 text-sm" @click="resetFilters">
        {{ t('articles.resetFilter') }}
      </button>
    </div>
  </div>
</template>

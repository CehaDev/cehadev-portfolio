<script setup lang="ts">
import { Newspaper, Search, X, ArrowDownWideNarrow, Sparkles } from 'lucide-vue-next'

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

const allList = computed(() => {
  const list = [...(articles.value ?? [])]
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
  if (!all) list = list.filter((a) => a.category === activeCategory.value)
  if (activeTag.value) list = list.filter((a) => ((a.tags as string[]) ?? []).includes(activeTag.value))
  list = list.filter(matchesQuery)
  if (sortBy.value === 'oldest') list = [...list].reverse()
  else if (sortBy.value === 'az') list = [...list].sort((x, y) => String(x.title).localeCompare(String(y.title)))
  return list
})

const hasActiveFilter = computed(
  () => query.value.trim() !== '' || !(activeCategory.value === '' || activeCategory.value === t('articles.allCategory')) || !!activeTag.value || sortBy.value !== 'newest'
)

const featured = computed(() => (hasActiveFilter.value ? null : allList.value[0] ?? null))
const gridList = computed(() => (featured.value ? filtered.value.filter((a) => a.slug !== featured.value!.slug) : filtered.value))
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
  return cat === t('articles.allCategory') ? allList.value.length : allList.value.filter((a) => a.category === cat).length
}

const totalArticles = computed(() => allList.value.length)

const statItems = computed(() => [
  { label: 'Artikel', value: String(totalArticles.value) },
  { label: 'Kategori', value: String(categories.value.length - 1) },
  { label: 'Tag', value: String(new Set(allList.value.flatMap((a) => (a.tags as string[]) ?? [])).size) }
])

const dateLabelShort = (d: string) => {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

const gradients = ['from-violet-500 to-indigo-600', 'from-cyan-500 to-blue-600', 'from-emerald-500 to-lime-600', 'from-amber-500 to-rose-600']
</script>

<template>
  <div class="container-site min-h-[calc(100vh-76px)] py-16 md:py-20">
    <!-- HERO -->
    <div class="text-center">
      <span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card">
        <span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        {{ t('articles.badge') }}
      </span>
      <h1 class="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
        {{ t('articles.heroHead1') }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ t('articles.heroHead2') }}</span>
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
        {{ t('articles.heroDesc') }}
      </p>

      <div class="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
        <Reveal v-for="(s, i) in statItems" :key="s.label" :delay="i * 80" direction="up" :parallax="8 + i * 3">
          <div class="rounded-card border border-border bg-card px-3 py-5 text-center shadow-card">
            <p class="font-mono text-xl font-extrabold leading-none text-text">{{ s.value }}</p>
            <p class="mt-1.5 text-xs text-text-muted">{{ s.label }}</p>
          </div>
        </Reveal>
      </div>
    </div>

    <!-- TOOLBAR: search + sort -->
    <div class="mx-auto mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row">
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

    <!-- FILTER KATEGORI -->
    <div v-if="categories.length > 1" class="mt-6 flex flex-wrap justify-center gap-2.5" role="tablist" :aria-label="t('articles.filterAria')">
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

    <!-- FILTER TAG -->
    <div v-if="topTags.length" class="mt-4 flex flex-wrap justify-center gap-2" role="group" :aria-label="t('articles.tagFilterAria')">
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

    <!-- ARTIKEL TERBARU (featured) -->
    <Reveal v-if="featured" direction="up" :parallax="12">
      <article class="card group relative mt-10 overflow-hidden p-0 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover">
        <div class="grid md:grid-cols-2">
          <NuxtLink :to="`/articles/${featured.slug}`" class="relative block h-56 overflow-hidden border-b border-border/60 md:h-auto md:border-b-0 md:border-r" aria-hidden="true" tabindex="-1">
            <img
              v-if="featured.cover"
              :src="featured.cover"
              :alt="featured.title"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105" :class="gradients[featured.slug.length % gradients.length]">
              <span class="font-mono text-5xl font-extrabold text-white/90">&lt;/&gt;</span>
            </span>
            <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <Sparkles :size="11" :stroke-width="2" aria-hidden="true" />
              {{ t('articles.latestPost') }}
            </span>
          </NuxtLink>
          <div class="flex flex-col justify-center gap-4 p-7 md:p-9">
            <div class="flex items-center gap-4 text-[11px] font-medium text-text-muted">
              <span v-if="featured.category" class="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-primary">
                {{ featured.category }}
              </span>
              <span>{{ dateLabelShort(featured.datePublished) }}</span>
            </div>
            <NuxtLink :to="`/articles/${featured.slug}`" class="text-2xl font-extrabold leading-tight tracking-tight text-text transition-colors hover:text-primary md:text-3xl">
              {{ featured.title }}
            </NuxtLink>
            <p class="line-clamp-3 text-sm leading-relaxed text-text-secondary">{{ featured.excerpt }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in (featured.tags ?? []).slice(0, 4)" :key="tag" class="rounded-full border border-border bg-bg-alt px-2.5 py-0.5 font-mono text-[10px] font-medium text-text-muted">#{{ tag }}</span>
            </div>
            <NuxtLink :to="`/articles/${featured.slug}`" class="btn-primary mt-1 w-fit !px-5 !py-2.5 text-sm">
              {{ t('articles.readNow') }}
            </NuxtLink>
          </div>
        </div>
      </article>
    </Reveal>

    <!-- GRID -->
    <div v-if="visibleList.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

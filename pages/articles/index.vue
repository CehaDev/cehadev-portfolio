<script setup lang="ts">
import { Newspaper, Search, X } from 'lucide-vue-next'

const { data: articles } = await useArticlesContent()
const { t } = useI18n()
const { lang } = useLang()

useSeoMeta({
  title: () => `${t('articles.heroHead1')} ${t('articles.heroHead2')} | CehaDev`,
  description: () => t('articles.heroDesc')
})
useCanonical('/articles')

const query = ref('')
const activeCategory = ref('')
const activeTag = ref('')
const sortBy = ref<'newest' | 'oldest' | 'az'>('newest')
const visibleCount = ref(8)

const allList = computed<any[]>(() => {
  const list = [...((articles.value ?? []) as any[])]
  return list.sort((a, b) => String(b.datePublished ?? '').localeCompare(String(a.datePublished ?? '')))
})

const latestFour = computed(() => allList.value.slice(0, 4))

const categories = computed(() => {
  const set = new Set<string>()
  for (const a of allList.value) if (a.category) set.add(a.category as string)
  return [t('articles.allCategory'), ...set]
})

const topTags = computed(() => {
  const counts = new Map<string, number>()
  for (const a of allList.value) for (const tg of (a.tags as string[]) ?? []) counts.set(tg, (counts.get(tg) ?? 0) + 1)
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, 10).map(([tag]) => tag)
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
  if (!all) list = list.filter((a: any) => a.category === activeCategory.value)
  if (activeTag.value) list = list.filter((a: any) => ((a.tags as string[]) ?? []).includes(activeTag.value))
  list = list.filter(matchesQuery)
  if (sortBy.value === 'oldest') list = [...list].reverse()
  else if (sortBy.value === 'az') list = [...list].sort((x, y) => String(x.title).localeCompare(String(y.title)))
  return list
})

const visibleList = computed(() => filtered.value.slice(0, visibleCount.value))

const hasActiveFilter = computed(
  () =>
    query.value.trim() !== '' ||
    !(activeCategory.value === '' || activeCategory.value === t('articles.allCategory')) ||
    !!activeTag.value ||
    sortBy.value !== 'newest'
)

watch([query, activeCategory, activeTag, sortBy], () => {
  visibleCount.value = 8
})

function resetFilters() {
  query.value = ''
  activeCategory.value = ''
  activeTag.value = ''
  sortBy.value = 'newest'
}

function isActiveCat(cat: string) {
  return activeCategory.value === cat || (activeCategory.value === '' && cat === t('articles.allCategory'))
}

const sortOptions = computed(() => [
  { value: 'newest' as const, label: t('articles.sortNewest') },
  { value: 'oldest' as const, label: t('articles.sortOldest') },
  { value: 'az' as const, label: t('articles.sortAz') }
])

function dateLabelShort(d: string) {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat(lang.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
</script>

<template>
  <div class="container-site min-h-[calc(100vh-76px)] pb-20 pt-14 md:pt-20">
    <!-- HERO -->
    <Reveal direction="up" :parallax="8">
      <section class="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 font-mono text-xs text-text-muted">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            {{ t('articles.badge') }}
          </span>
          <h1 class="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl">
            {{ t('articles.heroHead1') }}
            <span class="bg-gradient-brand bg-clip-text text-transparent">{{ t('articles.heroHead2') }}</span>
          </h1>
          <p class="mt-4 max-w-lg text-[15px] leading-relaxed text-text-secondary">
            {{ t('articles.heroDesc') }}
          </p>
        </div>

        <!-- Pencarian -->
        <div class="relative w-full max-w-md shrink-0">
          <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted" aria-hidden="true">
            <Search :size="16" :stroke-width="1.75" />
          </span>
          <input
            v-model="query"
            type="search"
            class="input-field !rounded-full !pl-11 !pr-10"
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
      </section>
    </Reveal>

    <!-- STRIP ARTIKEL TERBARU -->
    <section v-if="latestFour.length" class="mt-10" :aria-label="lang === 'en' ? 'Latest Articles' : 'Artikel Terbaru'">
      <Reveal direction="up" :parallax="6">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-[11px] font-bold uppercase tracking-widest text-text-muted">{{ lang === 'en' ? 'Latest Articles' : 'Artikel Terbaru' }}</h2>
          <span class="font-mono text-[10px] text-text-muted">{{ latestFour.length }}</span>
        </div>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <NuxtLink
            v-for="(a, i) in latestFour"
            :key="a.slug"
            :to="`/articles/${a.slug}`"
            class="group block overflow-hidden rounded-card bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span class="relative block aspect-[16/9] overflow-hidden" aria-hidden="true">
              <img
                v-if="a.cover"
                :src="a.cover"
                :alt="a.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span v-else class="dot-grid absolute inset-0 flex items-center justify-center">
                <span class="font-mono text-base font-extrabold tracking-tighter text-text-muted/50">&lt;/&gt;</span>
              </span>
              <span v-if="i === 0" class="absolute left-2 top-2 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {{ t('articles.latestPost') }}
              </span>
            </span>
            <span class="flex flex-col gap-1.5 p-3.5">
              <span v-if="a.category" class="text-[8px] font-bold uppercase tracking-wider text-primary">{{ a.category }}</span>
              <span class="line-clamp-2 text-[13px] font-bold leading-snug text-text transition-colors duration-300 group-hover:text-primary">
                {{ a.title }}
              </span>
              <span class="font-mono text-[10px] text-text-muted">{{ dateLabelShort(a.datePublished) }}</span>
            </span>
          </NuxtLink>
        </div>
      </Reveal>
    </section>

    <!-- KONTROL: kategori + urutan (tombol polos tanpa band) -->
    <div class="mt-9 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
      <div class="flex flex-wrap gap-2" role="tablist" :aria-label="t('articles.filterAria')">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          role="tab"
          :aria-selected="isActiveCat(cat)"
          class="rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300"
          :class="isActiveCat(cat)
            ? 'bg-gradient-brand text-white shadow-btn-glow'
            : 'bg-bg-alt text-text-secondary hover:text-text'"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Segmented control urutan -->
      <div class="flex items-center rounded-full bg-bg-alt p-1" role="group" :aria-label="t('articles.sortAria')">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300"
          :class="sortBy === opt.value
            ? 'bg-gradient-brand text-white shadow-btn-glow'
            : 'text-text-muted hover:text-text'"
          :aria-pressed="sortBy === opt.value"
          @click="sortBy = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- TAG (mobile/tablet: di atas daftar) -->
    <div v-if="topTags.length" class="mt-5 flex flex-wrap items-center gap-1.5 xl:hidden" role="group" :aria-label="t('articles.tagFilterAria')">
      <button
        v-for="tag in topTags"
        :key="tag"
        type="button"
        class="rounded-full bg-bg-alt px-2.5 py-1 font-mono text-[10px] text-text-muted transition-all duration-300 hover:text-primary"
        :class="activeTag === tag ? '!bg-primary/15 font-bold text-primary' : ''"
        @click="activeTag = activeTag === tag ? '' : tag"
      >
        #{{ tag }}
      </button>
      <button
        v-if="hasActiveFilter"
        type="button"
        class="ml-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] text-text-muted transition-colors hover:text-primary"
        :aria-label="t('articles.resetFilter')"
        @click="resetFilters"
      >
        <X :size="11" :stroke-width="2" aria-hidden="true" />
        reset
      </button>
    </div>

    <!-- KONTEN UTAMA + SIDEBAR TAG -->
    <div class="mt-6 flex items-start gap-7">
      <section v-if="visibleList.length" class="grid min-w-0 flex-1 gap-x-5 gap-y-6 sm:grid-cols-2 xl:grid-cols-3" :aria-label="t('articles.heroHead2')">
        <Reveal v-for="(a, i) in visibleList" :key="a.slug" :delay="Math.min(i % 3, 2) * 60" direction="up" :parallax="6">
          <ArticleCard :article="a as any" />
        </Reveal>
      </section>

      <!-- Kolom tag di sisi artikel utama -->
      <aside v-if="topTags.length" class="sticky top-[84px] hidden w-52 shrink-0 xl:block" aria-label="Tag">
        <p class="text-[10px] font-bold uppercase tracking-widest text-text-muted">{{ lang === 'en' ? 'Tags' : 'Tag' }}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <button
            v-for="tag in topTags"
            :key="tag"
            type="button"
            class="rounded-full bg-bg-alt px-2.5 py-1 font-mono text-[10px] text-text-muted transition-all duration-300 hover:text-primary"
            :class="activeTag === tag ? '!bg-primary/15 font-bold text-primary' : ''"
            @click="activeTag = activeTag === tag ? '' : tag"
          >
            #{{ tag }}
          </button>
        </div>
        <button
          v-if="hasActiveFilter"
          type="button"
          class="mt-3 inline-flex items-center gap-1 rounded-full bg-bg-alt px-3 py-1.5 font-mono text-[10px] text-text-muted transition-colors hover:text-primary"
          @click="resetFilters"
        >
          <X :size="11" :stroke-width="2" aria-hidden="true" />
          {{ t('articles.resetFilter') }}
        </button>
      </aside>
    </div>

    <!-- LOAD MORE + counter -->
    <div v-if="filtered.length > visibleCount || hasActiveFilter" class="mt-12 flex flex-col items-center gap-3">
      <button v-if="filtered.length > visibleCount" type="button" class="btn-outline !px-6 !py-3 text-sm" @click="visibleCount += 8">
        {{ t('articles.loadMore') }}
      </button>
      <p class="font-mono text-[11px] text-text-muted">
        {{ t('articles.showingOf', { shown: Math.min(visibleCount, filtered.length), total: filtered.length }) }}
      </p>
    </div>

    <!-- EMPTY -->
    <div v-if="!filtered.length" class="card mt-12 flex flex-col items-center gap-3 px-6 py-16 text-center">
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

<style scoped>
.dot-grid {
  background-color: rgb(var(--color-bg-alt));
  background-image: radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.28) 1px, transparent 0);
  background-size: 13px 13px;
}
</style>

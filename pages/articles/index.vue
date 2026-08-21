<script setup lang="ts">
import { Newspaper } from 'lucide-vue-next'

const { data: articles } = await useArticlesContent()
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('articles.heroHead1')} ${t('articles.heroHead2')} | CehaDev`,
  description: () => t('articles.heroDesc')
})
useCanonical('/articles')

const categories = computed(() => {
  const set = new Set<string>()
  for (const a of articles.value ?? []) if (a.category) set.add(a.category as string)
  return [t('articles.allCategory'), ...set]
})
const activeCategory = ref('')

const filtered = computed(() => {
  const list = articles.value ?? []
  const all = activeCategory.value === '' || activeCategory.value === t('articles.allCategory')
  return all ? list : list.filter((a) => a.category === activeCategory.value)
})

function categoryCount(cat: string) {
  const list = articles.value ?? []
  return cat === t('articles.allCategory') ? list.length : list.filter((a) => a.category === cat).length
}

const totalArticles = computed(() => (articles.value ?? []).length)

const statItems = computed(() => [
  { label: 'Artikel', value: String(totalArticles.value) },
  { label: 'Kategori', value: String(categories.value.length - 1) },
  { label: 'Tag', value: String(new Set((articles.value ?? []).flatMap((a) => (a.tags as string[]) ?? [])).size) }
])
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

    <!-- FILTER -->
    <div v-if="categories.length > 1" class="mt-12 flex flex-wrap justify-center gap-2.5" role="tablist" :aria-label="t('articles.filterAria')">
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

    <!-- GRID -->
    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal v-for="(a, i) in filtered" :key="a.slug" :delay="(i % 3) * 80" :direction="i % 2 === 0 ? 'left' : 'up'" :parallax="10 + (i % 3) * 4">
        <ArticleCard :article="a as any" />
      </Reveal>
    </div>

    <div v-if="!filtered.length" class="card mt-4 flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
        <Newspaper :size="22" :stroke-width="1.75" />
      </span>
      <p class="text-sm font-medium text-text-secondary">{{ t('articles.empty') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Calendar, Clock3, Eye } from 'lucide-vue-next'

interface ArticleCardData {
  slug: string
  title: string
  excerpt: string
  category: string
  tags?: string[]
  cover?: string
  datePublished: string
}

const props = defineProps<{ article: ArticleCardData; views?: number }>()

const { lang } = useLang()
const { t } = useI18n()

function readingMin(text: string) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 200))
}
const minutes = computed(() => readingMin(`${props.article.excerpt ?? ''} ${props.article.title ?? ''}`))

const visibleTags = computed(() => (props.article.tags ?? []).slice(0, 2))
const extraTags = computed(() => (props.article.tags?.length ?? 0) - visibleTags.value.length)

const dateLabel = computed(() => {
  const d = new Date(props.article.datePublished)
  if (Number.isNaN(d.getTime())) return props.article.datePublished
  return new Intl.DateTimeFormat(lang.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
})

const gradients = [
  'from-violet-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-lime-600',
  'from-amber-500 to-rose-600',
  'from-fuchsia-500 to-violet-600'
]
const gradient = computed(() => gradients[(props.article.slug.length + props.article.title.length) % gradients.length])
</script>

<template>
  <article class="card group relative flex flex-col overflow-hidden p-0 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover">
    <NuxtLink :to="`/articles/${article.slug}`" class="relative block h-44 overflow-hidden border-b border-border/60" aria-hidden="true" tabindex="-1">
      <img
        v-if="article.cover"
        :src="article.cover"
        :alt="article.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-500 group-hover:scale-105"
        :class="gradient"
      >
        <span class="font-mono text-4xl font-extrabold text-white/90">&lt;/&gt;</span>
      </span>
      <span
        v-if="article.category"
        class="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
      >
        {{ article.category }}
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3 p-5">
      <div class="flex items-center gap-4 text-[11px] font-medium text-text-muted">
        <span class="inline-flex items-center gap-1.5">
          <Calendar :size="12" :stroke-width="1.75" aria-hidden="true" />
          {{ dateLabel }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Clock3 :size="12" :stroke-width="1.75" aria-hidden="true" />
          {{ t('articles.readTime', { min: minutes }) }}
        </span>
        <span v-if="views && views > 0" class="ml-auto inline-flex items-center gap-1">
          <Eye :size="12" :stroke-width="1.75" aria-hidden="true" />
          {{ views }}
        </span>
      </div>

      <NuxtLink :to="`/articles/${article.slug}`" class="text-lg font-semibold leading-snug text-text transition-colors hover:text-primary">
        {{ article.title }}
      </NuxtLink>

      <p class="line-clamp-3 text-sm leading-relaxed text-text-secondary">
        {{ article.excerpt }}
      </p>

      <div v-if="visibleTags.length" class="flex flex-wrap items-center gap-1.5">
        <span v-for="tag in visibleTags" :key="tag" class="rounded-full border border-border bg-bg-alt px-2 py-0.5 text-[10px] font-medium text-text-muted">
          #{{ tag }}
        </span>
        <span v-if="extraTags > 0" class="text-[10px] font-medium text-text-muted">+{{ extraTags }}</span>
      </div>

      <NuxtLink
        :to="`/articles/${article.slug}`"
        class="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      >
        {{ t('articleCard.readArticle') }}
        <ArrowRight :size="15" :stroke-width="2" class="transition-transform group-hover:translate-x-0.5" />
      </NuxtLink>
    </div>
  </article>
</template>

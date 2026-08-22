<script setup lang="ts">
import { ArrowUpRight, Calendar, Clock3, Eye } from 'lucide-vue-next'

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
  return new Intl.DateTimeFormat(lang.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
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
  <article class="card group relative flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
    <!-- Cover -->
    <NuxtLink :to="`/articles/${article.slug}`" class="relative block h-32 overflow-hidden" aria-hidden="true" tabindex="-1">
      <img
        v-if="article.cover"
        :src="article.cover"
        :alt="article.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105"
        :class="gradient"
      >
        <span class="font-mono text-4xl font-extrabold tracking-tighter text-white/90">&lt;/&gt;</span>
      </span>
      <!-- Overlay gradasi agar chip & meta terbaca -->
      <span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" aria-hidden="true" />

      <span
        v-if="article.category"
        class="absolute left-2.5 top-2.5 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
      >
        {{ article.category }}
      </span>

      <span class="absolute bottom-2.5 left-3 inline-flex items-center gap-2.5 text-[9px] font-medium text-white/85">
        <span class="inline-flex items-center gap-1">
          <Calendar :size="10" :stroke-width="1.75" aria-hidden="true" />
          {{ dateLabel }}
        </span>
        <span class="inline-flex items-center gap-1">
          <Clock3 :size="10" :stroke-width="1.75" aria-hidden="true" />
          {{ t('articles.readTime', { min: minutes }) }}
        </span>
        <span v-if="views && views > 0" class="inline-flex items-center gap-1">
          <Eye :size="10" :stroke-width="1.75" aria-hidden="true" />
          {{ views }}
        </span>
      </span>
    </NuxtLink>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-2 p-4">
      <NuxtLink
        :to="`/articles/${article.slug}`"
        class="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-text transition-colors duration-300 group-hover:text-primary"
      >
        {{ article.title }}
      </NuxtLink>

      <p class="line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
        {{ article.excerpt }}
      </p>

      <div v-if="visibleTags.length" class="mt-0.5 flex flex-wrap items-center gap-1.5">
        <span v-for="tag in visibleTags" :key="tag" class="rounded-full border border-border bg-bg-alt px-2 py-0.5 font-mono text-[9px] font-medium text-text-muted">
          #{{ tag }}
        </span>
        <span v-if="extraTags > 0" class="font-mono text-[9px] font-medium text-text-muted">+{{ extraTags }}</span>
      </div>

      <div class="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
        <NuxtLink :to="`/articles/${article.slug}`" class="text-[13px] font-semibold text-primary transition-colors hover:text-primary-violet">
          {{ t('articleCard.readArticle') }}
        </NuxtLink>
        <span class="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-alt text-text-secondary transition-all duration-300 group-hover:border-primary/50 group-hover:bg-gradient-brand group-hover:text-white">
          <ArrowUpRight :size="13" :stroke-width="2" />
        </span>
      </div>
    </div>
  </article>
</template>

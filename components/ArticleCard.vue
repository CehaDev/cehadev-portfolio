<script setup lang="ts">
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-vue-next'

interface ArticleCardData {
  slug: string
  title: string
  excerpt: string
  category: string
  tags?: string[]
  cover?: string
  datePublished: string
}

const props = defineProps<{ article: ArticleCardData }>()

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
</script>

<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-card bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
    <!-- Cover -->
    <NuxtLink :to="`/articles/${article.slug}`" class="relative block overflow-hidden" aria-hidden="true" tabindex="-1">
      <span class="block aspect-[16/9]">
        <img
          v-if="article.cover"
          :src="article.cover"
          :alt="article.title"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span v-else class="dot-grid flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-105">
          <span class="font-mono text-2xl font-extrabold tracking-tighter text-text-muted/50">&lt;/&gt;</span>
        </span>
      </span>
      <!-- Overlay gradasi agar chip kategori terbaca -->
      <span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" aria-hidden="true" />

      <span
        v-if="article.category"
        class="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
      >
        {{ article.category }}
      </span>

      <!-- Indikator baca muncul saat hover -->
      <span class="absolute bottom-3 right-3 flex h-6 w-6 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
        <ArrowUpRight :size="12" :stroke-width="2" />
      </span>
    </NuxtLink>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-1.5 p-4">
      <NuxtLink
        :to="`/articles/${article.slug}`"
        class="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-text transition-colors duration-300 group-hover:text-primary"
      >
        {{ article.title }}
      </NuxtLink>

      <p class="line-clamp-2 text-xs leading-relaxed text-text-secondary">
        {{ article.excerpt }}
      </p>

      <!-- Meta ringkas di dasar kartu -->
      <div class="mt-auto flex items-center justify-between gap-2 pt-2.5 text-[10px] font-medium text-text-muted">
        <span class="inline-flex min-w-0 items-center gap-2.5">
          <span class="inline-flex items-center gap-1 whitespace-nowrap">
            <CalendarDays :size="10" :stroke-width="1.75" aria-hidden="true" />
            {{ dateLabel }}
          </span>
          <span class="inline-flex items-center gap-1 whitespace-nowrap">
            <Clock3 :size="10" :stroke-width="1.75" aria-hidden="true" />
            {{ t('articles.readTime', { min: minutes }) }}
          </span>
        </span>
        <span v-if="visibleTags.length" class="inline-flex min-w-0 items-center gap-1 truncate font-mono text-text-muted/80">
          <span v-for="tag in visibleTags" :key="tag">#{{ tag }}</span>
          <span v-if="extraTags > 0">+{{ extraTags }}</span>
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.dot-grid {
  background-color: rgb(var(--color-bg-alt));
  background-image: radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.28) 1px, transparent 0);
  background-size: 13px 13px;
}
</style>

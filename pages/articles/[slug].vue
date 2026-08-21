<script setup lang="ts">
import { ArrowLeft, Calendar, Clock3, Tag } from 'lucide-vue-next'
import { renderMarkdown, countWords } from '~/utils/markdown'

const route = useRoute()
const { lang } = useLang()
const { t } = useI18n()

const { data: articles } = await useArticlesContent()
const article = computed(() => (articles.value ?? []).find((a: any) => a.slug === route.params.slug))

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: t('articles.notFound'), fatal: true })
}

const a = computed(() => article.value as any)

useSeoMeta({
  title: () => `${a.value.seoTitle || a.value.title} | CehaDev`,
  description: () => a.value.seoDescription || a.value.excerpt,
  ogType: 'article',
  articlePublishedTime: () => a.value.datePublished
})
useCanonical(`/articles/${route.params.slug}`)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: a.value.seoTitle || a.value.title,
        description: a.value.seoDescription || a.value.excerpt,
        datePublished: a.value.datePublished,
        author: { '@type': 'Person', name: 'CehaDev', url: 'https://cehadev.id' },
        publisher: { '@type': 'Person', name: 'CehaDev' },
        mainEntityOfPage: `https://cehadev.id/articles/${route.params.slug}`,
        keywords: (a.value.tags ?? []).join(', ')
      })
    }
  ]
})

const minutes = computed(() => Math.max(1, Math.round(countWords(a.value.content ?? '') / 200)))

const { data: html } = await useAsyncData(
  `article-html-${route.params.slug}`,
  () => renderMarkdown(a.value?.content ?? ''),
  { watch: [lang] }
)

const dateLabel = computed(() => {
  const d = new Date(a.value.datePublished)
  if (Number.isNaN(d.getTime())) return a.value.datePublished
  return new Intl.DateTimeFormat(lang.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
})

const others = computed(() =>
  (articles.value ?? [])
    .filter((x: any) => x.slug !== route.params.slug)
    .slice(0, 3)
)

const gradients = [
  'from-violet-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-lime-600',
  'from-amber-500 to-rose-600'
]
const gradient = computed(() => gradients[(a.value.slug?.length ?? 0) % gradients.length])
</script>

<template>
  <div class="container-site min-h-[calc(100vh-76px)] py-12 md:py-16">
    <NuxtLink to="/articles" class="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary">
      <ArrowLeft :size="16" :stroke-width="2" />
      {{ t('articles.backToList') }}
    </NuxtLink>

    <article class="mx-auto mt-8 max-w-3xl">
      <!-- HEADER -->
      <header class="text-center">
        <span v-if="a.category" class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          {{ a.category }}
        </span>
        <h1 class="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{{ a.title }}</h1>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-text-muted">
          <span class="inline-flex items-center gap-1.5">
            <Calendar :size="13" :stroke-width="1.75" aria-hidden="true" />
            {{ t('articles.publishedOn') }} · {{ dateLabel }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <Clock3 :size="13" :stroke-width="1.75" aria-hidden="true" />
            {{ t('articles.readTime', { min: minutes }) }}
          </span>
        </div>
      </header>

      <!-- COVER -->
      <div v-if="a.cover" class="card mt-8 overflow-hidden p-0">
        <img :src="a.cover" :alt="a.title" loading="lazy" class="aspect-video w-full object-cover" />
      </div>
      <div v-else class="card mt-8 flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br p-0" :class="gradient" aria-hidden="true">
        <span class="font-mono text-6xl font-extrabold text-white/90">&lt;/&gt;</span>
      </div>

      <!-- CONTENT -->
      <div class="article-content mt-10" v-html="html ?? ''" />

      <!-- TAGS -->
      <div v-if="(a.tags ?? []).length" class="mt-12 flex flex-wrap items-center gap-2 border-t border-border/60 pt-8">
        <Tag :size="14" :stroke-width="1.75" class="text-text-muted" aria-hidden="true" />
        <span v-for="tag in a.tags" :key="tag" class="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-text-secondary">
          #{{ tag }}
        </span>
      </div>
    </article>

    <!-- ARTIKEL LAINNYA -->
    <section v-if="others.length" class="mx-auto mt-16 max-w-5xl">
      <h2 class="text-xl font-extrabold tracking-tight md:text-2xl">
        {{ lang === 'en' ? 'More Articles' : 'Artikel Lainnya' }}
      </h2>
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="o in others" :key="o.slug" :article="o as any" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.article-content {
  @apply text-[15px] leading-relaxed text-text-secondary;
}
.article-content :deep(h2) {
  @apply mb-3 mt-10 text-2xl font-bold tracking-tight text-text;
}
.article-content :deep(h3) {
  @apply mb-2.5 mt-8 text-xl font-bold tracking-tight text-text;
}
.article-content :deep(h4) {
  @apply mb-2 mt-6 text-base font-bold text-text;
}
.article-content :deep(p) {
  @apply my-4;
}
.article-content :deep(a) {
  @apply font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary-violet hover:decoration-primary;
}
.article-content :deep(strong) {
  @apply font-semibold text-text;
}
.article-content :deep(ul) {
  @apply my-4 list-disc space-y-1.5 pl-6;
}
.article-content :deep(ol) {
  @apply my-4 list-decimal space-y-1.5 pl-6;
}
.article-content :deep(li::marker) {
  @apply text-primary;
}
.article-content :deep(blockquote) {
  @apply my-6 rounded-card border-l-4 border-primary/60 bg-card px-5 py-4 italic shadow-card;
}
.article-content :deep(blockquote p) {
  @apply m-0;
}
.article-content :deep(hr) {
  @apply my-8 border-border/60;
}
.article-content :deep(img) {
  @apply my-6 w-full rounded-card border border-border/60;
}
.article-content :deep(code):not(:deep(pre code)) {
  @apply rounded-md border border-border/70 bg-bg-alt px-1.5 py-0.5 font-mono text-[0.85em] text-primary;
}
.article-content :deep(pre) {
  @apply my-6 overflow-x-auto rounded-xl border border-white/10 text-sm leading-relaxed shadow-card;
}
.article-content :deep(pre code) {
  @apply block bg-transparent p-5 font-mono;
}
.article-content :deep(table) {
  @apply my-6 w-full border-collapse text-sm;
}
.article-content :deep(th),
.article-content :deep(td) {
  @apply border border-border px-3.5 py-2 text-left;
}
.article-content :deep(th) {
  @apply bg-card font-semibold text-text;
}
</style>

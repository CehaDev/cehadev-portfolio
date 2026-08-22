<script setup lang="ts">
import { ArrowLeft, Calendar, Clock3, Tag, Eye, Link2, Check, MessageCircle, Share2, ChevronLeft, ChevronRight, ListTree } from 'lucide-vue-next'
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

const pageUrl = computed(() => `https://cehadev-portfolio.vercel.app/articles/${route.params.slug}`)

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
        mainEntityOfPage: pageUrl.value,
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

// Views dari statistik kunjungan publik
interface StatsShape {
  articles?: Array<{ slug: string; views: number }>
}
const { data: stats } = await useAsyncData(`stats-article-${route.params.slug}`, () =>
  useRequestFetch()<StatsShape>('/api/stats')
)
const views = computed(() => stats.value?.articles?.find((x) => x.slug === route.params.slug)?.views ?? 0)

const dateLabel = computed(() => {
  const d = new Date(a.value.datePublished)
  if (Number.isNaN(d.getTime())) return a.value.datePublished
  return new Intl.DateTimeFormat(lang.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
})

// ---- Daftar isi dari heading h2/h3 ----
interface TocItem { id: string; text: string; depth: number }
const toc = computed<TocItem[]>(() => {
  const out: TocItem[] = []
  const re = /<h([23]) id="([^"]*)">([\s\S]*?)<\/h\1>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html.value ?? ''))) {
    out.push({ depth: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, '').trim() })
  }
  return out
})

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---- Progress baca + scroll-spy daftar isi ----
const progress = ref(0)
const activeId = ref('')
let raf = 0

function updateReadingState() {
  const doc = document.documentElement
  const total = doc.scrollHeight - window.innerHeight
  progress.value = total > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100))) : 0

  let current = ''
  for (const item of toc.value) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= 140) current = item.id
  }
  activeId.value = current || toc.value[0]?.id || ''
}

function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(updateReadingState)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateReadingState()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})

watch(html, () => nextTick(updateReadingState))

// ---- Accordion daftar isi (mobile/tablet) ----
const tocOpen = ref(false)

// ---- Share ----
const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
const shareText = computed(() => `${a.value.title} — CehaDev`)
const shareUrls = computed(() => ({
  wa: `https://wa.me/?text=${encodeURIComponent(`${shareText.value}\n${pageUrl.value}`)}`,
  x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(pageUrl.value)}`,
  fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`
}))

// ---- Urutan kronologis untuk prev/next & terkait ----
const sorted = computed(() =>
  [...(articles.value ?? [])].sort((x: any, y: any) => String(y.datePublished ?? '').localeCompare(String(x.datePublished ?? '')))
)
const currentIndex = computed(() => sorted.value.findIndex((x: any) => x.slug === route.params.slug))
const newerArticle = computed(() => (currentIndex.value > 0 ? sorted.value[currentIndex.value - 1] : null))
const olderArticle = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < sorted.value.length - 1 ? sorted.value[currentIndex.value + 1] : null
)

const others = computed(() => {
  const cur = a.value
  const list = sorted.value.filter((x: any) => x.slug !== route.params.slug)
  const score = (x: any) =>
    (x.category && x.category === cur.category ? 3 : 0) +
    ((x.tags ?? []) as string[]).filter((tg) => ((cur.tags ?? []) as string[]).includes(tg)).length * 2
  const ranked = [...list].sort((x, y) => score(y) - score(x))
  return ranked.slice(0, 3)
})

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
    <!-- PROGRESS BACA -->
    <div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      <div class="h-full bg-gradient-brand shadow-btn-glow transition-[width] duration-100 ease-out" :style="{ width: `${progress}%` }" />
    </div>

    <NuxtLink to="/articles" class="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary">
      <ArrowLeft :size="16" :stroke-width="2" />
      {{ t('articles.backToList') }}
    </NuxtLink>

    <!-- HEADER ARTIKEL -->
    <header class="mx-auto mt-8 max-w-3xl text-center">
      <span v-if="a.category" class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        {{ a.category }}
      </span>
      <h1 class="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{{ a.title }}</h1>
      <p v-if="a.excerpt" class="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">{{ a.excerpt }}</p>

      <!-- Kartu meta penulis -->
      <div class="card mx-auto mt-7 flex w-fit flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-full px-6 py-3 text-xs font-medium text-text-muted">
        <span class="inline-flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-sm font-extrabold text-white" aria-hidden="true">C</span>
          CehaDev
        </span>
        <span class="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
        <span class="inline-flex items-center gap-1.5">
          <Calendar :size="13" :stroke-width="1.75" aria-hidden="true" />
          {{ dateLabel }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Clock3 :size="13" :stroke-width="1.75" aria-hidden="true" />
          {{ t('articles.readTime', { min: minutes }) }}
        </span>
        <span v-if="views > 0" class="inline-flex items-center gap-1.5">
          <Eye :size="13" :stroke-width="1.75" aria-hidden="true" />
          {{ views }} {{ t('common.views') }}
        </span>
      </div>

      <!-- SHARE -->
      <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[11px] font-medium transition-all duration-300"
          :class="copied ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400' : 'border-border bg-card text-text-secondary hover:border-primary/50 hover:text-primary'"
          :aria-label="t('articles.copyLink')"
          @click="copyLink"
        >
          <Check v-if="copied" :size="13" :stroke-width="2" aria-hidden="true" />
          <Link2 v-else :size="13" :stroke-width="1.75" aria-hidden="true" />
          {{ copied ? t('articles.linkCopied') : t('articles.copyLink') }}
        </button>
        <a
          :href="shareUrls.wa"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all duration-300 hover:border-emerald-400/50 hover:text-emerald-400"
          :aria-label="t('articles.shareWhatsapp')"
        >
          <MessageCircle :size="15" :stroke-width="1.75" aria-hidden="true" />
        </a>
        <a
          :href="shareUrls.x"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-9 items-center justify-center rounded-full border border-border bg-card px-3 text-sm font-bold text-text-secondary transition-all duration-300 hover:border-primary/50 hover:text-text"
          :aria-label="t('articles.shareX')"
        >
          𝕏
        </a>
        <a
          :href="shareUrls.fb"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-text-secondary transition-all duration-300 hover:border-blue-400/50 hover:text-blue-400"
          :aria-label="t('articles.shareFacebook')"
        >
          f
        </a>
      </div>
    </header>

    <!-- COVER -->
    <div class="mx-auto mt-9 max-w-4xl">
      <div v-if="a.cover" class="card overflow-hidden p-0">
        <img :src="a.cover" :alt="a.title" loading="lazy" class="aspect-video w-full object-cover" />
      </div>
      <div v-else class="card flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br p-0" :class="gradient" aria-hidden="true">
        <span class="font-mono text-6xl font-extrabold text-white/90">&lt;/&gt;</span>
      </div>
    </div>

    <!-- DAFTAR ISI MOBILE (accordion) -->
    <div v-if="toc.length >= 2" class="mx-auto mt-8 max-w-4xl xl:hidden">
      <div class="card overflow-hidden p-0">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          :aria-expanded="tocOpen"
          aria-controls="toc-mobile"
          @click="tocOpen = !tocOpen"
        >
          <span class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
            <ListTree :size="15" :stroke-width="2" class="text-primary" aria-hidden="true" />
            {{ t('articles.tableOfContents') }}
            <span class="rounded-full bg-bg-alt px-2 py-0.5 font-mono text-[10px] text-text-muted">{{ toc.length }}</span>
          </span>
          <ChevronRight :size="16" :stroke-width="2" class="shrink-0 text-text-muted transition-transform duration-300" :class="tocOpen ? 'rotate-90' : ''" aria-hidden="true" />
        </button>
        <div v-show="tocOpen" id="toc-mobile" class="border-t border-border/60 px-5 py-3">
          <nav class="max-h-64 space-y-0.5 overflow-y-auto" aria-label="Daftar isi mobile">
            <button
              v-for="(item, i) in toc"
              :key="item.id"
              type="button"
              class="group flex w-full items-start gap-2.5 rounded-md py-1.5 pr-2 text-left transition-colors"
              :class="item.depth === 3 ? 'pl-8' : 'pl-2'"
              @click="goTo(item.id); tocOpen = false"
            >
              <span class="mt-0.5 font-mono text-[10px] leading-5 text-text-muted transition-colors group-hover:text-primary">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="line-clamp-2 text-[13px] leading-snug transition-colors" :class="activeId === item.id ? 'font-semibold text-primary' : 'text-text-secondary group-hover:text-text'">
                {{ item.text }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- KONTEN -->
    <div class="mx-auto mt-10 grid max-w-6xl gap-10 xl:grid-cols-[230px_minmax(0,1fr)_230px]">
      <!-- SIDEBAR KIRI: Daftar isi modern dengan scroll-spy -->
      <aside class="hidden self-start xl:sticky xl:top-24 xl:block" aria-label="Daftar isi">
        <div v-if="toc.length >= 2" class="card overflow-hidden p-0">
          <div class="flex items-center justify-between border-b border-border/60 bg-bg-alt/50 px-5 py-4">
            <p class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
              <ListTree :size="14" :stroke-width="2" class="text-primary" aria-hidden="true" />
              {{ t('articles.tableOfContents') }}
            </p>
            <span class="font-mono text-[10px] tabular-nums text-text-muted">{{ progress }}%</span>
          </div>

          <!-- Track progress mini -->
          <div class="h-0.5 w-full bg-border/50" aria-hidden="true">
            <div class="h-full bg-gradient-brand transition-[width] duration-150 ease-out" :style="{ width: `${progress}%` }" />
          </div>

          <nav class="relative max-h-[52vh] space-y-0.5 overflow-y-auto p-4">
            <button
              v-for="(item, i) in toc"
              :key="item.id"
              type="button"
              class="group relative flex w-full items-start gap-2 rounded-md py-1.5 pr-2 text-left transition-colors duration-200"
              :class="[item.depth === 3 ? 'pl-7' : 'pl-2', activeId === item.id ? 'bg-primary/10' : 'hover:bg-bg-alt']"
              @click="goTo(item.id)"
            >
              <span
                v-if="activeId === item.id"
                class="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-full bg-gradient-brand"
                aria-hidden="true"
              />
              <span class="mt-0.5 font-mono text-[9px] leading-4 tabular-nums transition-colors duration-200" :class="activeId === item.id ? 'text-primary' : 'text-text-muted'">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="line-clamp-2 text-[11.5px] leading-snug transition-colors duration-200" :class="activeId === item.id ? 'font-semibold text-primary' : item.depth === 2 ? 'text-text-secondary group-hover:text-text' : 'text-[10.5px] text-text-muted group-hover:text-text-secondary'">
                {{ item.text }}
              </span>
            </button>
          </nav>
        </div>
      </aside>

      <article>
        <!-- CONTENT -->
        <div class="article-content" v-html="html ?? ''" />

        <!-- TAGS -->
        <div v-if="(a.tags ?? []).length" class="mt-12 flex flex-wrap items-center gap-2 border-t border-border/60 pt-8">
          <Tag :size="14" :stroke-width="1.75" class="text-text-muted" aria-hidden="true" />
          <span v-for="tag in a.tags" :key="tag" class="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-text-secondary">
            #{{ tag }}
          </span>
        </div>
      </article>

      <!-- SIDEBAR KANAN: spacer agar artikel tetap center -->
      <div class="hidden xl:block" aria-hidden="true" />
    </div>

    <!-- KOLOM KOMENTAR -->
    <ArticleComments :slug="String(route.params.slug)" class="mx-auto mt-14 max-w-4xl" />

    <!-- PREV / NEXT -->
    <nav v-if="olderArticle || newerArticle" class="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2" aria-label="Navigasi artikel">
      <NuxtLink
        v-if="olderArticle"
        :to="`/articles/${(olderArticle as any).slug}`"
        class="card group flex flex-col gap-1.5 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
      >
        <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors group-hover:text-primary">
          <ChevronLeft :size="12" :stroke-width="2" aria-hidden="true" />
          {{ t('articles.prevArticle') }}
        </span>
        <span class="line-clamp-2 text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary">
          {{ (olderArticle as any).title }}
        </span>
      </NuxtLink>
      <NuxtLink
        v-if="newerArticle"
        :to="`/articles/${(newerArticle as any).slug}`"
        class="card group flex flex-col items-end gap-1.5 p-5 text-right transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover sm:col-start-2"
      >
        <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors group-hover:text-primary">
          {{ t('articles.nextArticle') }}
          <ChevronRight :size="12" :stroke-width="2" aria-hidden="true" />
        </span>
        <span class="line-clamp-2 text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary">
          {{ (newerArticle as any).title }}
        </span>
      </NuxtLink>
    </nav>

    <!-- ARTIKEL TERKAIT -->
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
  @apply mb-3 mt-10 scroll-mt-28 text-2xl font-bold tracking-tight text-text;
}
.article-content :deep(h3) {
  @apply mb-2.5 mt-8 scroll-mt-28 text-xl font-bold tracking-tight text-text;
}
.article-content :deep(h4) {
  @apply mb-2 mt-6 scroll-mt-28 text-base font-bold text-text;
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

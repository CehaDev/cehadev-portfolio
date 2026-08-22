<script setup lang="ts">
import { ArrowLeft, ArrowRight, ArrowUp, Calendar, Clock3, Tag, Eye, Link2, Check, MessageCircle, Share2, ChevronLeft, ChevronRight, ListTree } from 'lucide-vue-next'
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

// ---- HTML terbagi: paragraf pembuka → daftar isi → sisa konten ----
const wrapTable = (s: string) => s.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>')

const introHtml = computed(() => {
  const h = html.value ?? ''
  const idx = h.indexOf('</p>')
  return idx >= 0 ? wrapTable(h.slice(0, idx + 4)) : ''
})

const restHtml = computed(() => {
  const h = html.value ?? ''
  const idx = h.indexOf('</p>')
  return wrapTable(idx >= 0 ? h.slice(idx + 4) : h)
})

// ---- Daftar isi dari heading h2/h3 (heading ber-<!--notoc--> dikecualikan) ----
interface TocItem { id: string; text: string; depth: number }
const toc = computed<TocItem[]>(() => {
  const out: TocItem[] = []
  const re = /<h([23]) id="([^"]*)">([\s\S]*?)<\/h\1>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html.value ?? ''))) {
    const raw = m[3]
    const text = raw.replace(/<[^>]+>/g, '').trim()
    if (/<!--\s*notoc\s*-->/i.test(raw)) continue
    out.push({ depth: Number(m[1]), id: m[2], text })
  }
  return out
})

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

// ---- Accordion daftar isi: terbuka di desktop, tertutup di layar kecil ----
const tocOpen = ref(true)

onMounted(() => {
  if (window.innerWidth < 768) tocOpen.value = false
})

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
  <div class="container-site relative min-h-[calc(100vh-76px)] py-12 md:py-16">
    <!-- Dekorasi lembut di belakang header -->
    <div class="pointer-events-none absolute inset-x-0 top-8 mx-auto h-64 w-[40rem] max-w-full rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

    <!-- Tombol kembali ke atas -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-show="progress > 12"
        type="button"
        class="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-text-secondary shadow-lg backdrop-blur transition-colors duration-300 hover:border-primary/50 hover:text-primary"
        :aria-label="t('common.backToTop')"
        @click="scrollTop"
      >
        <ArrowUp :size="17" :stroke-width="2" aria-hidden="true" />
      </button>
    </Transition>
    <!-- PROGRESS BACA -->
    <div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      <div class="h-full bg-gradient-brand shadow-btn-glow transition-[width] duration-100 ease-out" :style="{ width: `${progress}%` }" />
    </div>

    <NuxtLink to="/articles" class="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary">
      <ArrowLeft :size="16" :stroke-width="2" />
      {{ t('articles.backToList') }}
    </NuxtLink>

    <!-- HEADER ARTIKEL -->
    <header class="mx-auto mt-6 max-w-3xl text-center md:mt-8">
      <span v-if="a.category" class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        {{ a.category }}
      </span>
      <h1 class="mt-3 break-words text-[26px] font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">{{ a.title }}</h1>
      <p v-if="a.excerpt" class="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">{{ a.excerpt }}</p>

      <!-- Kartu meta penulis -->
      <div class="card mx-auto mt-7 flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-btn px-4 py-3 text-[11px] font-medium text-text-muted sm:rounded-full sm:px-6 sm:text-xs">
        <span class="inline-flex items-center gap-2">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-extrabold text-white" aria-hidden="true">C</span>
          CehaDev
        </span>
        <span class="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
        <span class="inline-flex items-center gap-1.5">
          <Calendar :size="13" :stroke-width="1.75" aria-hidden="true" class="shrink-0" />
          {{ dateLabel }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Clock3 :size="13" :stroke-width="1.75" aria-hidden="true" class="shrink-0" />
          {{ t('articles.readTime', { min: minutes }) }}
        </span>
        <span v-if="views > 0" class="inline-flex items-center gap-1.5">
          <Eye :size="13" :stroke-width="1.75" aria-hidden="true" class="shrink-0" />
          {{ views }} {{ t('common.views') }}
        </span>
      </div>

      <!-- SHARE -->
      <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
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
    <div class="mx-auto mt-8 w-full max-w-3xl md:mt-9">
      <div v-if="a.cover" class="card overflow-hidden p-0">
        <img :src="a.cover" :alt="a.title" loading="lazy" class="aspect-video w-full object-cover" />
      </div>
      <div v-else class="card flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br p-0" :class="gradient" aria-hidden="true">
        <span class="font-mono text-5xl font-extrabold text-white/90 sm:text-6xl">&lt;/&gt;</span>
      </div>
    </div>

    <!-- ALUR ARTIKEL + PANEL SAMPING (laptop & desktop) -->
    <div class="mx-auto mt-9 grid w-full grid-cols-1 gap-8 md:mt-11 lg:grid-cols-[minmax(0,48rem)_minmax(0,230px)] lg:items-start xl:grid-cols-[minmax(0,220px)_minmax(0,48rem)_minmax(0,220px)]">
      <!-- Panel kiri: penulis & bagikan -->
      <aside class="hidden self-start xl:sticky xl:top-24 xl:block" aria-label="Penulis dan bagikan">
        <div class="card p-5 text-center">
          <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-extrabold text-white shadow-btn-glow" aria-hidden="true">C</span>
          <p class="mt-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">{{ t('articles.byAuthor') }}</p>
          <p class="mt-0.5 text-sm font-bold text-text">CehaDev</p>
          <p class="mt-2 text-xs leading-relaxed text-text-secondary">{{ t('articles.authorTagline') }}</p>
        </div>

        <div class="card mt-4 p-4">
          <div class="flex flex-row justify-center gap-2 xl:flex-col xl:items-center">
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-all duration-300"
              :class="copied ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400' : 'text-text-secondary hover:border-primary/50 hover:text-primary'"
              :aria-label="t('articles.copyLink')"
              @click="copyLink"
            >
              <Check v-if="copied" :size="14" :stroke-width="2" aria-hidden="true" />
              <Link2 v-else :size="14" :stroke-width="2" aria-hidden="true" />
            </button>
            <a :href="shareUrls.wa" target="_blank" rel="noopener noreferrer" class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-[10px] font-bold text-text-secondary transition-all duration-300 hover:border-emerald-400/50 hover:text-emerald-400" :aria-label="t('articles.shareWhatsapp')">WA</a>
            <a :href="shareUrls.x" target="_blank" rel="noopener noreferrer" class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all duration-300 hover:border-border-strong hover:text-text" :aria-label="t('articles.shareX')">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1 2h6.5l4.4 5.9L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.5L17.8 20Z"/></svg>
            </a>
            <a :href="shareUrls.fb" target="_blank" rel="noopener noreferrer" class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-text-secondary transition-all duration-300 hover:border-blue-400/50 hover:text-blue-400" :aria-label="t('articles.shareFacebook')">f</a>
          </div>
        </div>
      </aside>

      <!-- ISI ARTIKEL -->
      <div class="min-w-0">
      <!-- Paragraf pembuka -->
      <div v-if="introHtml" class="article-content article-intro" v-html="introHtml" />

      <!-- DAFTAR ISI (menyatu dengan artikel) -->
      <div v-if="toc.length >= 2" class="card my-8 overflow-hidden p-0 md:my-10">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          :aria-expanded="tocOpen"
          aria-controls="toc-inline"
          @click="tocOpen = !tocOpen"
        >
          <span class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
            <ListTree :size="15" :stroke-width="2" class="text-primary" aria-hidden="true" />
            {{ t('articles.tableOfContents') }}
            <span class="rounded-full bg-bg-alt px-2 py-0.5 font-mono text-[10px] text-text-muted">{{ toc.length }}</span>
          </span>
          <span class="flex shrink-0 items-center gap-2.5">
            <span class="font-mono text-[10px] tabular-nums text-text-muted">{{ progress }}%</span>
            <ChevronRight :size="16" :stroke-width="2" class="text-text-muted transition-transform duration-300" :class="tocOpen ? 'rotate-90' : ''" aria-hidden="true" />
          </span>
        </button>

        <!-- Track progress mini -->
        <div class="h-0.5 w-full bg-border/50" aria-hidden="true">
          <div class="h-full bg-gradient-brand transition-[width] duration-150 ease-out" :style="{ width: `${progress}%` }" />
        </div>

        <div v-show="tocOpen" id="toc-inline" class="border-t border-border/60 px-4 py-3 sm:px-5">
          <nav class="max-h-72 space-y-0.5 overflow-y-auto" aria-label="Daftar isi">
            <button
              v-for="(item, i) in toc"
              :key="item.id"
              type="button"
              class="group relative flex w-full items-start gap-2.5 rounded-md py-1.5 pr-2 text-left transition-colors duration-200"
              :class="[item.depth === 3 ? 'pl-8' : 'pl-2', activeId === item.id ? 'bg-primary/10' : 'hover:bg-bg-alt']"
              @click="goTo(item.id)"
            >
              <span
                v-if="activeId === item.id"
                class="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-full bg-gradient-brand"
                aria-hidden="true"
              />
              <span class="mt-0.5 font-mono text-[10px] leading-5 tabular-nums transition-colors duration-200" :class="activeId === item.id ? 'text-primary' : 'text-text-muted'">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="line-clamp-2 text-[13px] leading-snug transition-colors duration-200" :class="activeId === item.id ? 'font-semibold text-primary' : item.depth === 2 ? 'text-text-secondary group-hover:text-text' : 'text-[12px] text-text-muted group-hover:text-text-secondary'">
                {{ item.text }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Sisa konten -->
      <div class="article-content" v-html="restHtml" />

      <!-- TAGS -->
      <div v-if="(a.tags ?? []).length" class="mt-10 flex flex-wrap items-center gap-2 border-t border-border/60 pt-7">
        <Tag :size="14" :stroke-width="1.75" class="text-text-muted" aria-hidden="true" />
        <span v-for="tag in a.tags" :key="tag" class="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-text-secondary">
          #{{ tag }}
        </span>
      </div>
      </div>

      <!-- Panel kanan: progres, info & CTA -->
      <aside class="hidden self-start lg:sticky lg:top-24 lg:block" aria-label="Info artikel">
        <div class="card p-5 text-center">
          <p class="text-[10px] font-bold uppercase tracking-wider text-text-muted">{{ t('articles.readingProgress') }}</p>
          <p class="mt-2 font-mono text-4xl font-extrabold tabular-nums text-primary">{{ progress }}<span class="text-lg">%</span></p>
          <div class="mt-3 h-1 overflow-hidden rounded-full bg-bg-alt" aria-hidden="true">
            <div class="h-full rounded-full bg-gradient-brand transition-[width] duration-150 ease-out" :style="{ width: `${progress}%` }" />
          </div>
        </div>

        <div class="card mt-4 space-y-3 p-4">
          <p class="px-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">{{ t('articles.articleInfo') }}</p>
          <div class="flex items-center gap-2.5 text-xs font-medium text-text-secondary">
            <Calendar :size="13" :stroke-width="1.75" class="shrink-0 text-primary" aria-hidden="true" />
            {{ dateLabel }}
          </div>
          <div class="flex items-center gap-2.5 text-xs font-medium text-text-secondary">
            <Clock3 :size="13" :stroke-width="1.75" class="shrink-0 text-primary" aria-hidden="true" />
            {{ t('articles.readTime', { min: minutes }) }}
          </div>
          <div v-if="a.category" class="flex items-center gap-2.5 text-xs font-medium text-text-secondary">
            <Tag :size="13" :stroke-width="1.75" class="shrink-0 text-primary" aria-hidden="true" />
            {{ a.category }}
          </div>
        </div>

        <div class="card mt-4 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-5 text-center">
          <MessageCircle :size="20" :stroke-width="1.75" class="mx-auto text-primary" aria-hidden="true" />
          <p class="mt-2 text-xs leading-relaxed text-text-secondary">{{ t('articles.discussCta') }}</p>
          <NuxtLink to="/contact" class="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card !px-4 !py-2 text-xs font-semibold text-primary transition-all duration-300 hover:bg-gradient-brand hover:text-white hover:border-transparent">
            {{ t('articles.contactMe') }}
            <ArrowRight :size="13" :stroke-width="2" aria-hidden="true" />
          </NuxtLink>
        </div>
      </aside>
    </div>

    <!-- KOLOM KOMENTAR -->
    <ArticleComments :slug="String(route.params.slug)" class="mx-auto mt-14 w-full" />

    <!-- PREV / NEXT -->
    <nav v-if="olderArticle || newerArticle" class="mx-auto mt-14 grid w-full gap-4 sm:grid-cols-2 md:mt-16" aria-label="Navigasi artikel">
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
    <section v-if="others.length" class="mx-auto mt-14 w-full md:mt-16">
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
  @apply text-[17px] leading-[1.75] text-text-secondary;
}
@media (min-width: 768px) {
  .article-content {
    @apply text-[18px] leading-[1.8];
  }
}
/* Paragraf pembuka sedikit lebih menonjol (nuansa editorial) */
.article-intro :deep(p:first-child) {
  @apply text-[18px] font-medium leading-[1.75] text-text;
}
@media (min-width: 768px) {
  .article-intro :deep(p:first-child) {
    @apply text-[19px];
  }
}
/* Judul bab tidak tertutup navbar saat lompat anchor */
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
  scroll-margin-top: 96px;
}
.article-content :deep(h2) {
  @apply mb-3 mt-10 scroll-mt-28 break-words text-2xl font-bold tracking-tight text-text;
}
.article-content :deep(h3) {
  @apply mb-2.5 mt-8 scroll-mt-28 break-words text-xl font-bold tracking-tight text-text;
}
.article-content :deep(h4) {
  @apply mb-2 mt-6 scroll-mt-28 break-words text-base font-bold text-text;
}
.article-content :deep(p) {
  @apply my-4 [overflow-wrap:anywhere];
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
  @apply rounded-md border border-border/70 bg-bg-alt px-1.5 py-0.5 font-mono text-[0.85em] text-primary [overflow-wrap:anywhere];
}
.article-content :deep(pre) {
  @apply my-6 max-w-full overflow-x-auto rounded-xl border border-white/10 text-sm leading-relaxed shadow-card;
}
.article-content :deep(pre code) {
  @apply block bg-transparent p-4 font-mono sm:p-5;
}
/* Tabel bisa digeser horizontal di layar kecil */
.article-content :deep(.table-scroll) {
  @apply my-6 w-full overflow-x-auto rounded-xl border border-border/60 shadow-card;
}
.article-content :deep(.table-scroll table) {
  @apply my-0 w-full min-w-[480px] border-collapse text-sm;
}
.article-content :deep(th),
.article-content :deep(td) {
  @apply border border-border px-3.5 py-2 text-left align-top;
}
.article-content :deep(th) {
  @apply whitespace-nowrap bg-card font-semibold text-text;
}
</style>

<script setup lang="ts">
import { Plus, Newspaper, Pencil, Trash2, ExternalLink, LoaderCircle, FileEdit, FileCheck2, Search, X, Eye, EyeOff, Tag, MessageSquare, BarChart3, FolderOpen, FilePen, Users, Activity } from 'lucide-vue-next'
import { lsId } from '~/utils/localize'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Artikel'
})

interface AdminArticleRow {
  slug: string
  title: string
  excerpt: string
  category: string
  tags?: string[]
  cover?: string
  status: 'published' | 'draft'
  datePublished: string
}

interface AdminCommentRow {
  id: string
  articleSlug: string
  name: string
  message: string
  at: string
  parentId?: string
}

const { data: articles, refresh } = await useAsyncData('admin-articles-list', () =>
  useRequestFetch()<AdminArticleRow[]>('/api/admin/articles')
)

const { data: stats } = await useAsyncData('admin-articles-stats', () =>
  useRequestFetch()<{ articles?: Array<{ slug: string; views: number }> }>('/api/stats')
)

const { data: allComments, refresh: refreshComments } = await useAsyncData<AdminCommentRow[]>('admin-article-comments', () =>
  useRequestFetch()<AdminCommentRow[]>('/api/admin/comments')
)

const busy = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)
const confirmDeleteComment = ref<string | null>(null)
const query = ref('')

const tab = ref<'all' | 'published' | 'draft' | 'comments' | 'analytics'>('all')
const publishedCount = computed(() => (articles.value ?? []).filter((a) => a.status === 'published').length)
const draftCount = computed(() => (articles.value ?? []).filter((a) => a.status === 'draft').length)

// ---- Analitik artikel ----
interface ArticleAnalytics {
  total: { views: number; readers: number; views7d: number; trendPct: number | null }
  daily: Array<{ date: string; views: number; visitors: number }>
  devices: Array<{ label: string; value: number }>
  browsers: Array<{ label: string; value: number }>
  sources: Array<{ label: string; value: number }>
  articles: Array<{ slug: string; views: number; readers: number; views7d: number; viewsPrev7d: number }>
}

const { data: articleAnalytics } = await useAsyncData('admin-articles-analytics', () =>
  useRequestFetch()<ArticleAnalytics>('/api/admin/analytics/articles')
)

const titleBySlug = computed(() => {
  const map = new Map<string, string>()
  for (const a of articles.value ?? []) map.set(a.slug, a.title)
  return map
})

const chartLabels = computed(() => (articleAnalytics.value?.daily ?? []).map((d) => d.date.slice(5).replace('-', '/')))
const chartViews = computed(() => (articleAnalytics.value?.daily ?? []).map((d) => d.views))
const chartVisitors = computed(() => (articleAnalytics.value?.daily ?? []).map((d) => d.visitors))

function trendOf(row: { views7d: number; viewsPrev7d: number }): { label: string; up: boolean } | null {
  if (row.viewsPrev7d > 0) {
    const pct = Math.round(((row.views7d - row.viewsPrev7d) / row.viewsPrev7d) * 100)
    if (pct === 0) return null
    return { label: `${pct > 0 ? '+' : ''}${pct}%`, up: pct > 0 }
  }
  return row.views7d > 0 ? { label: 'Baru', up: true } : null
}

const avgViewsPerArticle = computed(() => {
  const n = (articles.value ?? []).filter((a) => a.status === 'published').length
  return n > 0 ? Math.round((articleAnalytics.value?.total.views ?? 0) / n) : 0
})

const articleViews = (slug: string) => stats.value?.articles?.find((x) => x.slug === slug)?.views ?? 0

const sumViews = computed(() =>
  (articles.value ?? []).reduce((acc, a) => acc + articleViews(a.slug), 0)
)
const commentCountBySlug = computed(() => {
  const map = new Map<string, number>()
  for (const c of allComments.value ?? []) map.set(c.articleSlug, (map.get(c.articleSlug) ?? 0) + 1)
  return map
})
const totalComments = computed(() => (allComments.value ?? []).length)

// Peta id → nama untuk menampilkan konteks "membalas @nama"
const commentNameById = computed(() => {
  const map = new Map<string, string>()
  for (const c of allComments.value ?? []) map.set(c.id, c.name)
  return map
})

const statCards = computed(() => [
  { label: 'Total Artikel', value: String(articles.value?.length ?? 0), icon: Newspaper, tone: 'text-primary bg-primary/10' },
  { label: 'Terbit', value: String(publishedCount.value), icon: FileCheck2, tone: 'text-emerald-400 bg-emerald-400/10' },
  { label: 'Draft', value: String(draftCount.value), icon: FilePen, tone: 'text-amber-400 bg-amber-400/10' },
  { label: 'Total Views', value: String(sumViews.value), icon: BarChart3, tone: 'text-cyan-400 bg-cyan-400/10' },
  { label: 'Komentar', value: String(totalComments.value), icon: MessageSquare, tone: 'text-fuchsia-400 bg-fuchsia-400/10' }
])

function matchesQuery(a: AdminArticleRow) {
  const q = query.value.trim().toLowerCase()
  if (!q) return true
  return [a.title, a.slug, a.category, ...(a.tags ?? [])].join(' ').toLowerCase().includes(q)
}

const currentList = computed(() => {
  let list = articles.value ?? []
  if (tab.value === 'published') list = list.filter((a) => a.status === 'published')
  else if (tab.value === 'draft') list = list.filter((a) => a.status === 'draft')
  return list.filter(matchesQuery)
})

function dateLabel(d: string) {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function commentDateLabel(at: string) {
  const date = new Date(at)
  if (Number.isNaN(date.getTime())) return at
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

function commentInitials(n: string) {
  return n.split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('') || '?'
}

async function removePermanent(slug: string) {
  if (busy.value) return
  busy.value = slug
  try {
    await $fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' })
    confirmDelete.value = null
    await Promise.all([refresh(), refreshComments()])
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    alert(err.data?.statusMessage ?? 'Gagal menghapus artikel')
  } finally {
    busy.value = null
  }
}

async function removeComment(id: string) {
  if (busy.value) return
  busy.value = `comment-${id}`
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    confirmDeleteComment.value = null
    await refreshComments()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    alert(err.data?.statusMessage ?? 'Gagal menghapus komentar')
  } finally {
    busy.value = null
  }
}

async function toggleStatus(a: AdminArticleRow) {
  if (busy.value) return
  busy.value = `toggle-${a.slug}`
  try {
    const url: string = `/api/admin/articles/${a.slug}`
    await useRequestFetch()(url, { method: 'PUT', body: { ...a, status: a.status === 'published' ? 'draft' : 'published' } })
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    alert(err.data?.statusMessage ?? 'Gagal mengubah status artikel')
  } finally {
    busy.value = null
  }
}

const gradients = ['from-violet-500 to-indigo-600', 'from-cyan-500 to-blue-600', 'from-emerald-500 to-lime-600', 'from-amber-500 to-rose-600']
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Newspaper :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Kelola Artikel</h2>
            <p class="mt-1 text-sm text-text-secondary">Tulis artikel markdown dua bahasa, pantau performa & moderasi komentar.</p>
          </div>
        </div>
        <NuxtLink to="/admin/articles/new" class="btn-primary !py-2.5">
          <Plus :size="16" :stroke-width="2" />
          Tulis Artikel
        </NuxtLink>
      </div>
    </div>

    <!-- Kartu statistik -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <div v-for="s in statCards" :key="s.label" class="card flex items-center gap-3.5 p-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" :class="s.tone" aria-hidden="true">
          <component :is="s.icon" :size="19" :stroke-width="1.75" />
        </span>
        <div class="min-w-0">
          <p class="truncate font-mono text-xl font-extrabold leading-tight text-text">{{ s.value }}</p>
          <p class="truncate text-[11px] font-medium text-text-muted">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- Tab + pencarian -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="inline-flex items-center gap-1 overflow-x-auto rounded-btn border border-border bg-card p-1" role="tablist" aria-label="Filter artikel">
        <button
          v-for="tb in [
            { key: 'all', label: 'Semua', count: articles?.length ?? 0 },
            { key: 'published', label: 'Terbit', count: publishedCount },
            { key: 'draft', label: 'Draft', count: draftCount },
            { key: 'comments', label: 'Komentar', count: totalComments },
            { key: 'analytics', label: 'Analitik', count: sumViews }
          ]"
          :key="tb.key"
          type="button"
          role="tab"
          :aria-selected="tab === tb.key"
          class="inline-flex shrink-0 items-center gap-2 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"
          :class="tab === tb.key ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-muted hover:text-text'"
          @click="tab = tb.key as any"
        >
          {{ tb.label }}
          <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="tab === tb.key ? 'bg-white/20 text-white' : 'bg-bg-alt text-text-muted'">{{ tb.count }}</span>
        </button>
      </div>

      <div v-if="tab !== 'comments' && tab !== 'analytics'" class="relative w-full sm:w-72">
        <span class="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-text-muted" aria-hidden="true">
          <Search :size="15" :stroke-width="1.75" />
        </span>
        <input
          v-model="query"
          type="search"
          class="input-field !py-2.5 !pl-10 !pr-9 text-sm"
          placeholder="Cari judul, slug, kategori, tag..."
          aria-label="Cari artikel"
        />
        <button
          v-if="query"
          type="button"
          class="absolute inset-y-0 right-3 my-auto flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-alt hover:text-text"
          aria-label="Bersihkan pencarian"
          @click="query = ''"
        >
          <X :size="13" :stroke-width="2" />
        </button>
      </div>
    </div>

    <!-- ===== TAB ANALITIK ARTIKEL ===== -->
    <template v-if="tab === 'analytics'">
      <!-- Kartu metrik ringkas -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="card flex items-center gap-3.5 p-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400" aria-hidden="true"><Eye :size="19" :stroke-width="1.75" /></span>
          <div class="min-w-0">
            <p class="truncate font-mono text-xl font-extrabold leading-tight text-text">{{ articleAnalytics?.total.views ?? 0 }}</p>
            <p class="truncate text-[11px] font-medium text-text-muted">Total Views Artikel</p>
          </div>
        </div>
        <div class="card flex items-center gap-3.5 p-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-primary" aria-hidden="true"><Users :size="19" :stroke-width="1.75" /></span>
          <div class="min-w-0">
            <p class="truncate font-mono text-xl font-extrabold leading-tight text-text">{{ articleAnalytics?.total.readers ?? 0 }}</p>
            <p class="truncate text-[11px] font-medium text-text-muted">Pembaca Unik</p>
          </div>
        </div>
        <div class="card flex items-center gap-3.5 p-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400" aria-hidden="true"><Activity :size="19" :stroke-width="1.75" /></span>
          <div class="min-w-0">
            <p class="truncate font-mono text-xl font-extrabold leading-tight text-text">
              {{ articleAnalytics?.total.views7d ?? 0 }}
              <span
                v-if="articleAnalytics?.total.trendPct != null"
                class="ml-1 align-middle font-sans text-[10px] font-bold"
                :class="(articleAnalytics.total.trendPct ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'"
              >{{ (articleAnalytics.total.trendPct ?? 0) >= 0 ? '▲' : '▼' }} {{ Math.abs(articleAnalytics.total.trendPct ?? 0) }}%</span>
            </p>
            <p class="truncate text-[11px] font-medium text-text-muted">Views 7 Hari Terakhir</p>
          </div>
        </div>
        <div class="card flex items-center gap-3.5 p-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400" aria-hidden="true"><Newspaper :size="19" :stroke-width="1.75" /></span>
          <div class="min-w-0">
            <p class="truncate font-mono text-xl font-extrabold leading-tight text-text">{{ avgViewsPerArticle }}</p>
            <p class="truncate text-[11px] font-medium text-text-muted">Rata-rata per Artikel</p>
          </div>
        </div>
      </div>

      <!-- Tren harian -->
      <div class="card p-7">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-extrabold tracking-tight text-text">Tren Pembaca Artikel — 30 Hari Terakhir</h3>
            <p class="mt-1 text-xs text-text-muted">Garis solid = kunjungan halaman artikel, garis putus-putus = pembaca unik</p>
          </div>
        </div>
        <div class="mt-5">
          <AreaChart :labels="chartLabels" :values="chartViews" :secondary="chartVisitors" :height="230" />
        </div>
      </div>

      <!-- Perangkat, browser & sumber -->
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="card p-6">
          <h3 class="text-sm font-extrabold tracking-tight text-text">Perangkat Pembaca</h3>
          <div class="mt-5">
            <DonutChart v-if="(articleAnalytics?.devices ?? []).length" :items="articleAnalytics!.devices" />
          </div>
        </div>
        <div class="card p-6">
          <h3 class="text-sm font-extrabold tracking-tight text-text">Browser</h3>
          <div class="mt-5">
            <BarList :items="(articleAnalytics?.browsers ?? []).map((b) => ({ label: b.label, value: b.value }))" color="#38BDF8" />
          </div>
        </div>
        <div class="card p-6">
          <h3 class="text-sm font-extrabold tracking-tight text-text">Sumber Kunjungan</h3>
          <div class="mt-5">
            <BarList :items="(articleAnalytics?.sources ?? []).map((s) => ({ label: s.label, value: s.value }))" color="#8B5CF6" />
          </div>
        </div>
      </div>

      <!-- Performa per artikel -->
      <div class="card overflow-hidden p-0">
        <div class="flex items-center justify-between px-7 py-5">
          <div>
            <h3 class="text-base font-extrabold tracking-tight text-text">Performa per Artikel</h3>
            <p class="mt-1 text-xs text-text-muted">Diurutkan berdasarkan total views — bandingkan tren mingguan tiap artikel</p>
          </div>
        </div>
        <ul class="divide-y divide-border/60 border-t border-border/60">
          <li v-for="(row, i) in articleAnalytics?.articles ?? []" :key="row.slug" class="flex items-center gap-4 px-7 py-3.5 transition-colors hover:bg-card/40">
            <span class="w-7 shrink-0 font-mono text-xs tabular-nums" :class="i === 0 ? 'font-bold text-primary' : 'text-text-muted'">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="min-w-0 flex-1">
              <NuxtLink :to="`/articles/${row.slug}`" target="_blank" class="block truncate text-sm font-semibold text-text transition-colors hover:text-primary">
                {{ titleBySlug.get(row.slug) || row.slug }}
              </NuxtLink>
              <span class="font-mono text-[10px] text-text-muted">/articles/{{ row.slug }}</span>
            </div>
            <div class="hidden shrink-0 items-center gap-2 sm:flex" aria-hidden="true">
              <div class="h-1.5 w-28 overflow-hidden rounded-full bg-bg-alt">
                <div
                  class="h-full rounded-full bg-gradient-brand transition-all duration-700"
                  :style="{ width: Math.max((row.views / Math.max(articleAnalytics?.articles[0]?.views ?? 1, 1)) * 100, 2) + '%' }"
                />
              </div>
            </div>
            <div class="shrink-0 text-right">
              <p class="font-mono text-sm font-bold text-text">{{ row.views }}</p>
              <p class="text-[10px] text-text-muted">{{ row.readers }} unik</p>
            </div>
            <div class="w-20 shrink-0 text-right">
              <p class="font-mono text-xs font-bold text-text-secondary">{{ row.views7d }}<span class="ml-1 font-normal text-text-muted">7d</span></p>
              <span
                v-if="trendOf(row)"
                class="text-[10px] font-bold"
                :class="trendOf(row)!.up ? 'text-emerald-400' : 'text-red-400'"
              >{{ trendOf(row)!.up ? '▲' : '▼' }} {{ trendOf(row)!.label }}</span>
              <span v-else class="text-[10px] text-text-muted">—</span>
            </div>
          </li>
          <li v-if="!(articleAnalytics?.articles ?? []).length" class="px-7 py-14 text-center">
            <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true"><BarChart3 :size="22" :stroke-width="1.75" /></span>
            <p class="mt-3 text-sm font-medium text-text-secondary">Belum ada kunjungan ke halaman artikel.</p>
          </li>
        </ul>
      </div>
    </template>

    <!-- ===== TAB KOMENTAR ===== -->
    <div v-if="tab === 'comments'" class="card overflow-hidden p-0">
      <ul class="divide-y divide-border/60">
        <li v-for="c in allComments ?? []" :key="c.id" class="flex items-start gap-4 px-7 py-4 transition-colors hover:bg-card/40">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-extrabold text-white" aria-hidden="true">
            {{ commentInitials(c.name) }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <p class="text-sm font-bold text-text">{{ c.name }}</p>
              <span class="font-mono text-[10px] text-text-muted">{{ commentDateLabel(c.at) }}</span>
              <span v-if="c.parentId && commentNameById.get(c.parentId)" class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
                Membalas @{{ commentNameById.get(c.parentId) }}
              </span>
            </div>
            <p class="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-text-secondary">{{ c.message }}</p>
            <NuxtLink :to="`/articles/${c.articleSlug}`" target="_blank" class="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-text-muted transition-colors hover:text-primary">
              /articles/{{ c.articleSlug }}
              <ExternalLink :size="10" :stroke-width="1.75" />
            </NuxtLink>
          </div>
          <button
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-red-500/30 px-3.5 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
            @click="confirmDeleteComment = c.id"
          >
            <Trash2 :size="13" :stroke-width="1.75" />
            Hapus
          </button>
        </li>
        <li v-if="!(allComments ?? []).length" class="px-7 py-14 text-center">
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <MessageSquare :size="22" :stroke-width="1.75" />
          </span>
          <p class="mt-3 text-sm font-medium text-text-secondary">Belum ada komentar masuk. Komentar pembaca akan muncul di sini untuk dimoderasi.</p>
        </li>
      </ul>
    </div>

    <!-- ===== LIST ARTIKEL ===== -->
    <div v-else class="card overflow-hidden p-0">
      <ul class="divide-y divide-border/60">
        <li v-for="(a, i) in currentList" :key="a.slug" class="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-card/40 sm:px-7">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-sm font-extrabold text-white" :class="gradients[i % gradients.length]" aria-hidden="true">
            <img v-if="a.cover" :src="a.cover" alt="" class="h-full w-full object-cover" />
            <template v-else>{{ lsId(a.title).charAt(0).toUpperCase() || '?' }}</template>
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-text">{{ lsId(a.title) }}</p>
            <div class="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5">
              <NuxtLink :to="`/articles/${a.slug}`" target="_blank" class="inline-flex items-center gap-1 font-mono text-[10px] text-text-muted transition-colors hover:text-primary">
                /articles/{{ a.slug }}
                <ExternalLink :size="10" :stroke-width="1.75" />
              </NuxtLink>
              <span v-if="lsId(a.category)" class="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted">
                <Tag :size="10" :stroke-width="2" />
                {{ lsId(a.category) }}
              </span>
              <span class="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted">
                <BarChart3 :size="10" :stroke-width="2" />
                {{ articleViews(a.slug) }} views
              </span>
              <span class="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted">
                <MessageSquare :size="10" :stroke-width="2" />
                {{ commentCountBySlug.get(a.slug) ?? 0 }} komentar
              </span>
            </div>
          </div>
          <span class="hidden shrink-0 text-xs text-text-muted sm:block">{{ dateLabel(a.datePublished) }}</span>
          <span
            class="inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
            :class="a.status === 'published'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
              : 'border-amber-400/30 bg-amber-400/10 text-amber-400'"
          >
            <FileCheck2 v-if="a.status === 'published'" :size="10" :stroke-width="2" />
            <FileEdit v-else :size="10" :stroke-width="2" />
            {{ a.status === 'published' ? 'Terbit' : 'Draft' }}
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-btn border px-3.5 py-2 text-xs font-medium transition-colors"
              :class="a.status === 'published'
                ? 'border-border text-text-secondary hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400'
                : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/70'"
              :title="a.status === 'published' ? 'Jadikan draft' : 'Terbitkan sekarang'"
              :disabled="busy !== null"
              @click="toggleStatus(a)"
            >
              <LoaderCircle v-if="busy === `toggle-${a.slug}`" :size="13" class="animate-spin" />
              <EyeOff v-else-if="a.status === 'published'" :size="13" :stroke-width="1.75" />
              <Eye v-else :size="13" :stroke-width="1.75" />
              {{ a.status === 'published' ? 'Draft' : 'Terbitkan' }}
            </button>
            <NuxtLink :to="`/admin/articles/${a.slug}`" class="btn-outline !px-4 !py-2 text-xs">
              <Pencil :size="13" :stroke-width="1.75" />
              Edit
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-btn border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
              @click="confirmDelete = a.slug"
            >
              <Trash2 :size="13" :stroke-width="1.75" />
              Hapus
            </button>
          </div>
        </li>
        <li v-if="!currentList.length" class="px-7 py-14 text-center">
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <FolderOpen :size="22" :stroke-width="1.75" />
          </span>
          <p class="mt-3 text-sm font-medium text-text-secondary">
            {{ query ? `Tidak ada artikel yang cocok dengan "${query}".` : 'Belum ada artikel' + (tab !== 'all' ? ' pada status ini.' : '. Klik "Tulis Artikel" untuk mulai.') }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Modal konfirmasi hapus artikel -->
    <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus artikel">
      <div class="card w-full max-w-sm p-7">
        <h3 class="text-lg font-bold text-text">Hapus permanen artikel?</h3>
        <p class="mt-2 text-sm text-text-secondary">
          Artikel <strong class="font-mono text-text">{{ confirmDelete }}</strong> akan <strong class="text-red-400">dihapus permanen</strong> dan tidak bisa dipulihkan. Lanjutkan?
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="btn-outline !px-4 !py-2.5" @click="confirmDelete = null">Batal</button>
          <button type="button" class="btn-primary !bg-red-600 !px-4 !py-2.5 !shadow-none" :disabled="busy === confirmDelete" @click="removePermanent(confirmDelete)">
            <LoaderCircle v-if="busy === confirmDelete" :size="15" class="animate-spin" />
            <Trash2 v-else :size="15" :stroke-width="2" />
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Modal konfirmasi hapus komentar -->
    <div v-if="confirmDeleteComment" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus komentar">
      <div class="card w-full max-w-sm p-7">
        <h3 class="text-lg font-bold text-text">Hapus komentar?</h3>
        <p class="mt-2 text-sm text-text-secondary">Komentar ini akan dihapus dan tidak akan tampil lagi di halaman artikel.</p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="btn-outline !px-4 !py-2.5" @click="confirmDeleteComment = null">Batal</button>
          <button type="button" class="btn-primary !bg-red-600 !px-4 !py-2.5 !shadow-none" :disabled="busy === `comment-${confirmDeleteComment}`" @click="removeComment(confirmDeleteComment)">
            <LoaderCircle v-if="busy === `comment-${confirmDeleteComment}`" :size="15" class="animate-spin" />
            <Trash2 v-else :size="15" :stroke-width="2" />
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

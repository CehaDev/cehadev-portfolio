<script setup lang="ts">
import {
  Eye, Users, Mail, Plus, ArrowRight, Layers, Star, Inbox, FileText, FolderKanban, Newspaper, PenLine, Activity, Globe, Sparkles, Play
} from 'lucide-vue-next'
import { lsId } from '~/utils/localize'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Dashboard'
})

interface AnalyticsOverview {
  total: { views: number; visitors: number; todayViews: number; todayVisitors: number }
  daily: Array<{ date: string; views: number; visitors: number }>
  topPages: Array<{ path: string; views: number }>
  topProjects: Array<{ slug: string; views: number }>
  devices: Array<{ label: string; value: number }>
  browsers: Array<{ label: string; value: number }>
}

const { data: analytics } = await useAsyncData('admin-dash-analytics', () =>
  useRequestFetch()<AnalyticsOverview>('/api/admin/analytics/overview')
)

const { data: projects, refresh } = await useAsyncData('admin-projects', () =>
  useRequestFetch()<Array<Record<string, any>>>('/api/admin/projects')
)

interface AdminArticle {
  slug: string
  title: string
  category: string
  tags?: string[]
  cover?: string
  status: 'published' | 'draft'
  datePublished: string
}

const { data: adminArticles } = await useAsyncData('admin-dash-articles', () =>
  useRequestFetch()<AdminArticle[]>('/api/admin/articles')
)

interface InboxMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  at: string
}

const { data: messages } = await useAsyncData('admin-dash-messages', () =>
  useRequestFetch()<InboxMessage[]>('/api/admin/messages')
)

const { data: projectTitles } = await useProjectsContent()

const unreadMessages = computed(() => messages.value?.filter((m) => !m.read) ?? [])
const recentMessages = computed(() => (messages.value ?? []).slice(0, 4))

const publishedArticles = computed(() => (adminArticles.value ?? []).filter((a) => a.status === 'published').length)
const draftArticles = computed(() => (adminArticles.value ?? []).filter((a) => a.status === 'draft').length)
const latestArticles = computed(() =>
  [...(adminArticles.value ?? [])].sort((x, y) => String(y.datePublished).localeCompare(String(x.datePublished))).slice(0, 5)
)

function articleDate(d: string) {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function messageTime(at: string) {
  const d = new Date(at)
  const today = new Date()
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const stats = computed(() => [
  {
    label: 'Total Kunjungan',
    value: analytics.value?.total.views ?? 0,
    icon: Eye,
    color: '#8B5CF6',
    spark: (analytics.value?.daily ?? []).slice(-14).map((d) => d.views)
  },
  {
    label: 'Total Pengunjung',
    value: analytics.value?.total.visitors ?? 0,
    icon: Users,
    color: '#3B82F6',
    spark: (analytics.value?.daily ?? []).slice(-14).map((d) => d.visitors)
  },
  {
    label: 'Total Artikel',
    value: adminArticles.value?.length ?? 0,
    icon: Newspaper,
    color: '#EC4899',
    hint: `${publishedArticles.value} terbit · ${draftArticles.value} draft`,
    spark: []
  },
  {
    label: 'Kunjungan Hari Ini',
    value: analytics.value?.total.todayViews ?? 0,
    icon: Activity,
    color: '#22C55E',
    spark: (analytics.value?.daily ?? []).slice(-7).map((d) => d.views)
  },
  {
    label: 'Pesan Belum Dibaca',
    value: unreadMessages.value.length,
    icon: Mail,
    color: '#F59E0B',
    spark: []
  }
])

const chartLabels = computed(() => (analytics.value?.daily ?? []).slice(-14).map((d) => d.date))
const chartViews = computed(() => (analytics.value?.daily ?? []).slice(-14).map((d) => d.views))
const chartVisitors = computed(() => (analytics.value?.daily ?? []).slice(-14).map((d) => d.visitors))

const titleMap = computed(() => {
  const map = new Map<string, string>()
  for (const p of (projectTitles.value ?? []) as Array<{ slug: string; title: string }>) map.set(p.slug, p.title)
  return map
})

const projectItems = computed(() =>
  (analytics.value?.topProjects ?? []).slice(0, 6).map((p) => ({
    label: titleMap.value.get(p.slug) ?? p.slug,
    value: p.views,
    hint: p.slug
  }))
)

const topPageItems = computed(() =>
  (analytics.value?.topPages ?? []).slice(0, 6).map((p) => ({ label: p.path, value: p.views }))
)

const latest = computed(() => [...(projects.value ?? [])].sort((a, b) => String(b.year).localeCompare(String(a.year))).slice(0, 5))

const demoBadges: Record<string, string> = {
  store: 'Store',
  kanban: 'Kanban',
  dashboard: 'Dashboard',
  api: 'API',
  todo: 'Task',
  code: 'Code',
  studio: 'Studio'
}

function demoTypeOf(p: { demo?: { enabled?: boolean; type?: string } }): string | null {
  const d = p.demo
  if (!d?.enabled) return null
  return (d.type && demoBadges[d.type]) || d.type || null
}

const avatarGradients = [
  'from-violet-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-lime-600',
  'from-amber-500 to-rose-500',
  'from-fuchsia-500 to-violet-600',
  'from-teal-500 to-emerald-600'
]
</script>

<template>
  <div class="space-y-6">
    <!-- Hero -->
    <div class="card relative overflow-hidden p-8">
      <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-blue/10 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-6">
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles :size="12" :stroke-width="2" aria-hidden="true" />
            Admin Panel
          </span>
          <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text">Selamat datang kembali 👋</h2>
          <p class="mt-1.5 text-sm text-text-secondary">Pantau performa website, kelola project, dan balas pesan — semua dari sini.</p>
        </div>
        <div class="flex flex-wrap items-end gap-5">
          <div class="flex flex-col items-center gap-1">
            <NuxtLink to="/admin/demos" class="btn-outline !py-2.5">
              <Play :size="16" :stroke-width="2" />
              Lihat Demo
            </NuxtLink>
            <span class="text-[10px] text-text-muted">Live preview project</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <NuxtLink to="/admin/articles/new" class="btn-primary !py-2.5">
              <PenLine :size="16" :stroke-width="2" />
              Tulis Artikel
            </NuxtLink>
            <span class="text-[10px] text-text-muted">Publikasikan tulisan</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <NuxtLink to="/admin/projects/new" class="btn-outline !py-2.5">
              <Plus :size="16" :stroke-width="2" />
              Tambah Project
            </NuxtLink>
            <span class="text-[10px] text-text-muted">Buat project baru</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div v-for="s in stats" :key="s.label" class="card relative overflow-hidden p-6">
        <span class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15" :style="{ backgroundColor: s.color }" aria-hidden="true" />
        <div class="flex items-start justify-between">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl" :style="{ backgroundColor: s.color + '22', color: s.color }" aria-hidden="true">
            <component :is="s.icon" :size="20" :stroke-width="1.5" />
          </span>
          <span v-if="s.spark.length" class="flex h-8 items-end gap-[2px]" aria-hidden="true">
            <span
              v-for="(v, i) in s.spark"
              :key="i"
              class="w-[3px] rounded-sm transition-all"
              :style="{
                height: `${Math.max((v / Math.max(...s.spark, 1)) * 100, 6)}%`,
                backgroundColor: s.color + (i === s.spark.length - 1 ? '' : '55')
              }"
            />
          </span>
        </div>
        <p class="mt-4 text-3xl font-extrabold text-text"><CountUp :end="s.value" /></p>
        <p class="mt-1 text-sm font-medium text-text-secondary">{{ s.label }}</p>
        <p v-if="'hint' in s && s.hint" class="mt-0.5 font-mono text-[10px] text-text-muted">{{ s.hint }}</p>
      </div>
    </div>

    <!-- Chart kunjungan -->
    <div class="card p-7">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="flex items-center gap-2 text-base font-bold text-text">
            <Activity :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Kunjungan 14 Hari Terakhir
          </h3>
          <p class="mt-1 text-xs text-text-muted">Garis solid = kunjungan, garis putus-putus = pengunjung unik</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <NuxtLink to="/admin/analytics" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
            Analytics Lengkap
            <ArrowRight :size="15" :stroke-width="2" />
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Detail grafik & metrik kunjungan</span>
        </div>
      </div>
      <div class="mt-5">
        <AreaChart :labels="chartLabels" :values="chartViews" :secondary="chartVisitors" :height="230" />
      </div>
    </div>

    <!-- Top pages & project -->
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card p-7">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <Globe :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Halaman Terpopuler
        </h3>
        <div class="mt-5">
          <BarList v-if="topPageItems.length" :items="topPageItems" />
          <EmptyState v-else title="Belum ada kunjungan" desc="Kunjungan ke website akan tercatat di sini." />
        </div>
      </div>

      <div class="card p-7">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <FolderKanban :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Kunjungan per Project
        </h3>
        <div class="mt-5">
          <BarList v-if="projectItems.length" :items="projectItems" color="#3B82F6" />
          <EmptyState v-else title="Belum ada data" desc="Kunjungan ke halaman project akan muncul di sini." />
        </div>
      </div>
    </div>

    <!-- Project terbaru -->
    <div class="card overflow-hidden p-0">
      <div class="relative overflow-hidden border-b border-border px-7 py-6">
        <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div class="relative flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-start gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
              <Layers :size="22" :stroke-width="1.75" />
            </span>
            <div>
              <h3 class="flex items-center gap-2 text-base font-bold text-text">
                Project Terbaru
                <span class="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-text-muted">{{ latest.length }}</span>
              </h3>
              <p class="mt-1 text-xs text-text-muted">Tambah, ubah, dan pantau project terbaru Anda dari satu tempat.</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <NuxtLink to="/admin/projects" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
              Lihat Semua
              <ArrowRight :size="15" :stroke-width="2" />
            </NuxtLink>
            <span class="text-[10px] text-text-muted">Kelola seluruh project</span>
          </div>
        </div>
      </div>

      <div class="hidden border-b border-border bg-card-alt/50 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_minmax(0,180px)] md:gap-6">
        <span>Project</span>
        <span>Detail</span>
        <span class="text-right">Aksi</span>
      </div>

      <ul class="divide-y divide-border/60">
        <li v-for="(p, i) in latest" :key="p.slug" class="px-7 py-5 transition-colors hover:bg-card/40">
          <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_minmax(0,180px)] md:items-center md:gap-6">
            <div class="flex min-w-0 items-center gap-4">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"
                :class="avatarGradients[i % avatarGradients.length]"
                aria-hidden="true"
              >
                {{ lsId(p.title).trim().charAt(0).toUpperCase() }}
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate text-sm font-semibold text-text">{{ lsId(p.title) }}</p>
                  <span v-if="p.featured" class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                    <Star :size="10" :stroke-width="2" class="fill-amber-400" />
                    Featured
                  </span>
                </div>
                <p class="mt-1 truncate text-xs text-text-muted">{{ lsId(p.category) }} • {{ p.year }}</p>
              </div>
            </div>

            <div class="flex min-w-0 flex-wrap items-center gap-2 md:flex-col md:items-start md:gap-1.5">
              <code class="truncate rounded-md border border-border bg-bg px-2 py-1 font-mono text-[10px] text-text-muted">{{ p.slug }}</code>
              <span v-if="demoTypeOf(p)" class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                Demo · {{ demoTypeOf(p) }}
              </span>
            </div>

            <div class="flex items-center justify-start gap-5 md:justify-end">
              <div class="flex flex-col items-center gap-1">
                <NuxtLink :to="`/admin/projects/${p.slug}`" class="btn-outline shrink-0 !px-4 !py-2 text-xs">Edit</NuxtLink>
                <span class="text-[9px] text-text-muted">Ubah isi & pengaturan</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <NuxtLink :to="`/projects/${p.slug}`" target="_blank" class="btn-outline shrink-0 !px-4 !py-2 text-xs">
                  <Eye :size="13" :stroke-width="1.75" />
                  Lihat
                </NuxtLink>
                <span class="text-[9px] text-text-muted">Buka halaman publik</span>
              </div>
            </div>
          </div>
        </li>
        <li v-if="!latest.length" class="px-7 py-10 text-center text-sm text-text-muted">
          Belum ada project. Tambahkan project pertama Anda.
        </li>
      </ul>
    </div>

    <!-- Artikel terbaru -->
    <div class="card overflow-hidden p-0">
      <div class="relative overflow-hidden border-b border-border px-7 py-6">
        <div class="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" aria-hidden="true" />
        <div class="relative flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-start gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-btn-glow" aria-hidden="true">
              <Newspaper :size="22" :stroke-width="1.75" />
            </span>
            <div>
              <h3 class="flex items-center gap-2 text-base font-bold text-text">
                Artikel Terbaru
                <span class="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-text-muted">{{ adminArticles?.length ?? 0 }}</span>
              </h3>
              <p class="mt-1 text-xs text-text-muted">{{ publishedArticles }} terbit · {{ draftArticles }} draft — tulis, jadwalkan, dan kelola artikel.</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <NuxtLink to="/admin/articles" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
              Kelola Artikel
              <ArrowRight :size="15" :stroke-width="2" />
            </NuxtLink>
            <span class="text-[10px] text-text-muted">Semua artikel & SEO</span>
          </div>
        </div>
      </div>

      <ul class="divide-y divide-border/60">
        <li v-for="(art, i) in latestArticles" :key="art.slug" class="flex flex-wrap items-center gap-4 px-7 py-4 transition-colors hover:bg-card/40">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"
            :class="avatarGradients[i % avatarGradients.length]"
            aria-hidden="true"
          >
            <img v-if="art.cover" :src="art.cover" alt="" class="h-full w-full object-cover" />
            <template v-else>{{ lsId(art.title) ? lsId(art.title).charAt(0).toUpperCase() : '?' }}</template>
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-text">{{ lsId(art.title) || art.slug }}</p>
            <p class="mt-0.5 truncate text-xs text-text-muted">
              {{ articleDate(art.datePublished) }}<span v-if="lsId(art.category)"> · {{ lsId(art.category) }}</span>
            </p>
          </div>
          <span
            class="inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
            :class="art.status === 'published'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
              : 'border-amber-400/30 bg-amber-400/10 text-amber-400'"
          >
            {{ art.status === 'published' ? 'Terbit' : 'Draft' }}
          </span>
          <div class="flex shrink-0 items-center gap-3">
            <NuxtLink :to="`/admin/articles/${art.slug}`" class="btn-outline !px-4 !py-2 text-xs">Edit</NuxtLink>
            <NuxtLink v-if="art.status === 'published'" :to="`/articles/${art.slug}`" target="_blank" class="btn-outline !px-4 !py-2 text-xs">
              <Eye :size="13" :stroke-width="1.75" />
              Lihat
            </NuxtLink>
          </div>
        </li>
        <li v-if="!latestArticles.length" class="px-7 py-10 text-center">
          <p class="text-sm text-text-muted">Belum ada artikel.</p>
          <NuxtLink to="/admin/articles/new" class="btn-outline mt-3 inline-flex !px-5 !py-2.5 text-xs">
            <PenLine :size="13" :stroke-width="2" />
            Tulis artikel pertama
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Pesan masuk -->
    <div class="card p-7">
      <div class="flex flex-wrap items-start justify-between gap-5">
        <div class="flex items-start gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
            <Mail :size="18" :stroke-width="1.75" />
          </span>
          <div>
            <h3 class="flex items-center gap-2 text-base font-bold text-text">
              Pesan Masuk
              <span
                v-if="unreadMessages.length > 0"
                class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                {{ unreadMessages.length > 9 ? '9+' : unreadMessages.length }}
              </span>
            </h3>
            <p class="mt-1 text-xs text-text-muted">Pesan dari pengunjung via form kontak.</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <NuxtLink to="/admin/messages" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
            Buka Inbox
            <ArrowRight :size="15" :stroke-width="2" />
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Balas & kelola pesan</span>
        </div>
      </div>

      <ul v-if="recentMessages.length" class="mt-5 divide-y divide-border/60">
        <li v-for="m in recentMessages" :key="m.id">
          <NuxtLink
            :to="`/admin/messages`"
            class="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-card"
          >
            <div class="flex min-w-0 items-center gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                :class="m.read ? 'bg-bg-alt text-text-muted' : 'bg-primary/15 text-primary'"
                aria-hidden="true"
              >
                <Mail :size="15" :stroke-width="1.5" />
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-text">
                  <span v-if="!m.read" class="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" aria-hidden="true" />
                  {{ m.subject }}
                </p>
                <p class="mt-0.5 truncate text-xs text-text-muted">{{ m.name }} — {{ m.email }}</p>
              </div>
            </div>
            <span class="shrink-0 text-[10px] text-text-muted">{{ messageTime(m.at) }}</span>
          </NuxtLink>
        </li>
      </ul>
      <EmptyState v-else title="Belum ada pesan masuk" desc="Pesan dari form kontak akan muncul di sini." />
    </div>
  </div>
</template>

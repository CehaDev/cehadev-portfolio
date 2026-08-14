<script setup lang="ts">
import {
  Eye, Users, Mail, Plus, ArrowRight, Layers, Star, Inbox, FileText, FolderKanban, Activity, Globe, Sparkles
} from 'lucide-vue-next'

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
  useRequestFetch()('/api/admin/projects')
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
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink to="/admin/cv" class="btn-outline !py-2.5">
            <FileText :size="16" :stroke-width="2" />
            Kelola CV
          </NuxtLink>
          <NuxtLink to="/admin/projects/new" class="btn-primary !py-2.5">
            <Plus :size="16" :stroke-width="2" />
            Tambah Project
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        <NuxtLink to="/admin/analytics" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
          Analytics Lengkap
          <ArrowRight :size="15" :stroke-width="2" />
        </NuxtLink>
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

    <!-- Project terbaru & pesan masuk -->
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card p-7">
        <div class="flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-base font-bold text-text">
            <Layers :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Project Terbaru
          </h3>
          <NuxtLink to="/admin/projects" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
            Lihat Semua
            <ArrowRight :size="15" :stroke-width="2" />
          </NuxtLink>
        </div>

        <ul class="mt-5 divide-y divide-border/60">
          <li v-for="p in latest" :key="p.slug" class="flex items-center justify-between gap-4 py-3.5">
            <div class="min-w-0">
              <div class="flex items-center gap-2.5">
                <p class="truncate text-sm font-semibold text-text">{{ p.title }}</p>
                <span v-if="p.featured" class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                  <Star :size="10" :stroke-width="2" class="fill-amber-400" />
                  Featured
                </span>
              </div>
              <p class="mt-0.5 truncate text-xs text-text-muted">{{ p.category }} • {{ p.year }} • {{ p.slug }}</p>
            </div>
            <NuxtLink :to="`/admin/projects/${p.slug}`" class="btn-outline shrink-0 !px-4 !py-2 text-xs">Edit</NuxtLink>
          </li>
          <li v-if="!latest.length" class="py-8 text-center text-sm text-text-muted">
            Belum ada project. Tambahkan project pertama Anda.
          </li>
        </ul>
      </div>

      <div class="card p-7">
        <div class="flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-base font-bold text-text">
            <Mail :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Pesan Masuk
            <span
              v-if="unreadMessages.length > 0"
              class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
              aria-hidden="true"
            >
              {{ unreadMessages.length > 9 ? '9+' : unreadMessages.length }}
            </span>
          </h3>
          <NuxtLink to="/admin/messages" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
            Buka Inbox
            <ArrowRight :size="15" :stroke-width="2" />
          </NuxtLink>
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
  </div>
</template>

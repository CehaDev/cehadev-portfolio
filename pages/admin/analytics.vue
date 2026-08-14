<script setup lang="ts">
import { Eye, Users, CalendarDays, MousePointerClick, TrendingUp, TrendingDown, Activity, FolderKanban, MonitorSmartphone, Globe, LoaderCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Analytics'
})

interface AnalyticsOverview {
  total: { views: number; visitors: number; todayViews: number; todayVisitors: number }
  daily: Array<{ date: string; views: number; visitors: number }>
  topPages: Array<{ path: string; views: number }>
  topProjects: Array<{ slug: string; views: number }>
  devices: Array<{ label: string; value: number }>
  browsers: Array<{ label: string; value: number }>
}

const { data: analytics } = await useAsyncData('admin-analytics', () =>
  useRequestFetch()<AnalyticsOverview>('/api/admin/analytics/overview')
)

const { data: projects } = await useProjectsContent()

const range = ref(14)
const ranges = [
  { days: 7, label: '7 Hari' },
  { days: 14, label: '14 Hari' },
  { days: 30, label: '30 Hari' }
]

const daily = computed(() => (analytics.value?.daily ?? []).slice(-range.value))

const chartLabels = computed(() => daily.value.map((d) => d.date))
const chartViews = computed(() => daily.value.map((d) => d.views))
const chartVisitors = computed(() => daily.value.map((d) => d.visitors))

const avgPerDay = computed(() => {
  const n = daily.value.length
  if (!n) return 0
  return Math.round(daily.value.reduce((a, d) => a + d.views, 0) / n)
})

const totalViews = computed(() => analytics.value?.total.views ?? 0)
const totalVisitors = computed(() => analytics.value?.total.visitors ?? 0)
const todayViews = computed(() => analytics.value?.total.todayViews ?? 0)
const todayVisitors = computed(() => analytics.value?.total.todayVisitors ?? 0)

const prevHalf = computed(() => {
  const slice = daily.value
  if (slice.length < 2) return 0
  const mid = Math.floor(slice.length / 2)
  const a = slice.slice(0, mid).reduce((s, d) => s + d.views, 0)
  const b = slice.slice(mid).reduce((s, d) => s + d.views, 0)
  if (a === 0) return b > 0 ? 100 : 0
  return Math.round(((b - a) / a) * 100)
})

const projectTitles = computed(() => {
  const map = new Map<string, string>()
  for (const p of (projects.value ?? []) as Array<{ slug: string; title: string }>) map.set(p.slug, p.title)
  return map
})

const projectItems = computed(() =>
  (analytics.value?.topProjects ?? []).map((p) => ({
    label: projectTitles.value.get(p.slug) ?? p.slug,
    value: p.views,
    hint: p.slug
  }))
)

const statCards = computed(() => [
  { label: 'Total Kunjungan', value: totalViews.value, icon: Eye, color: '#8B5CF6' },
  { label: 'Total Pengunjung', value: totalVisitors.value, icon: Users, color: '#3B82F6' },
  { label: 'Kunjungan Hari Ini', value: todayViews.value, icon: MousePointerClick, color: '#22C55E' },
  { label: 'Pengunjung Hari Ini', value: todayVisitors.value, icon: Users, color: '#F59E0B' }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Stat cards -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="s in statCards" :key="s.label" class="card relative overflow-hidden p-6">
        <span
          class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15"
          :style="{ backgroundColor: s.color }"
          aria-hidden="true"
        />
        <span class="flex h-11 w-11 items-center justify-center rounded-xl" :style="{ backgroundColor: s.color + '22', color: s.color }" aria-hidden="true">
          <component :is="s.icon" :size="20" :stroke-width="1.5" />
        </span>
        <p class="mt-4 text-3xl font-extrabold text-text"><CountUp :end="s.value" /></p>
        <p class="mt-1 text-sm font-medium text-text-secondary">{{ s.label }}</p>
      </div>
    </div>

    <!-- Kunjungan chart -->
    <div class="card p-7">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="flex items-center gap-2 text-base font-bold text-text">
            <Activity :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Kunjungan Website
          </h3>
          <p class="mt-1 text-xs text-text-muted">Rata-rata {{ avgPerDay }} kunjungan/hari</p>
        </div>
        <div class="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <button
            v-for="r in ranges"
            :key="r.days"
            type="button"
            class="rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors"
            :class="range === r.days ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:text-text'"
            @click="range = r.days"
          >
            {{ r.label }}
          </button>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
        <span class="flex items-center gap-2">
          <span class="h-0.5 w-5 rounded-full bg-[#8B5CF6]" aria-hidden="true" />
          Kunjungan
        </span>
        <span class="flex items-center gap-2">
          <span class="h-0 w-5 border-t-2 border-dashed border-[#38BDF8]" aria-hidden="true" />
          Pengunjung
        </span>
        <span
          class="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          :class="prevHalf >= 0 ? 'border border-success/30 bg-success/10 text-success' : 'border border-red-500/30 bg-red-500/10 text-red-400'"
        >
          <TrendingUp v-if="prevHalf >= 0" :size="12" :stroke-width="2" />
          <TrendingDown v-else :size="12" :stroke-width="2" />
          {{ Math.abs(prevHalf) }}% dibanding paruh pertama
        </span>
      </div>

      <div class="mt-5">
        <AreaChart :labels="chartLabels" :values="chartViews" :secondary="chartVisitors" />
      </div>
    </div>

    <!-- Top halaman & project -->
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card p-7">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <Globe :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Halaman Terpopuler
        </h3>
        <div class="mt-5">
          <BarList
            v-if="(analytics?.topPages ?? []).length"
            :items="(analytics!.topPages as Array<{ path: string; views: number }>).map((p) => ({ label: p.path, value: p.views }))"
          />
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

    <!-- Perangkat & browser -->
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card p-7">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <MonitorSmartphone :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Perangkat Pengunjung
        </h3>
        <div class="mt-6">
          <DonutChart v-if="(analytics?.devices ?? []).length" :items="analytics!.devices as Array<{ label: string; value: number }>" center-label="Kunjungan" />
          <EmptyState v-else title="Belum ada data" desc="Data perangkat akan muncul setelah ada kunjungan." />
        </div>
      </div>

      <div class="card p-7">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <MonitorSmartphone :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Browser Pengunjung
        </h3>
        <div class="mt-5">
          <BarList
            v-if="(analytics?.browsers ?? []).length"
            :items="(analytics!.browsers as Array<{ label: string; value: number }>).map((b) => ({ label: b.label, value: b.value }))"
            color="#22C55E"
          />
          <EmptyState v-else title="Belum ada data" desc="Data browser akan muncul setelah ada kunjungan." />
        </div>
      </div>
    </div>
  </div>
</template>

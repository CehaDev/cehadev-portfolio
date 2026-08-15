<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Activity, Cpu, ShieldCheck, Timer, Terminal, Bell } from 'lucide-vue-next'

defineProps<{ storageKey?: string }>()

const metrics = reactive({ uptime: 99.92, reqs: 342, errors: 0.42, latency: 88 })
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    metrics.uptime = Math.min(100, Math.max(98, metrics.uptime + (Math.random() - 0.5) * 0.06))
    metrics.reqs = Math.max(120, Math.round(metrics.reqs + (Math.random() - 0.5) * 60))
    metrics.errors = Math.max(0.05, Math.min(3, metrics.errors + (Math.random() - 0.5) * 0.18))
    metrics.latency = Math.max(40, Math.round(metrics.latency + (Math.random() - 0.5) * 24))
  }, 2500)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const kpis = computed(() => [
  { label: 'Uptime', value: metrics.uptime.toFixed(2) + '%', sub: '30 hari terakhir', icon: ShieldCheck, color: '#22C55E' },
  { label: 'Request / detik', value: String(metrics.reqs), sub: 'rata-rata per menit', icon: Activity, color: '#3B82F6' },
  { label: 'Error rate', value: metrics.errors.toFixed(2) + '%', sub: 'dari total request', icon: Cpu, color: '#F43F5E' },
  { label: 'p95 latency', value: metrics.latency + 'ms', sub: 'waktu respons', icon: Timer, color: '#F59E0B' }
])

const chart = Array.from({ length: 24 }, (_, i) => ({
  label: String(i).padStart(2, '0') + ':00',
  value: 55 + Math.round(Math.random() * 95)
}))

const W = 400
const H = 130
const PAD = 10
const maxV = Math.max(...chart.map((p) => p.value)) * 1.15
const pts = chart.map((p, i) => ({
  x: PAD + ((W - PAD * 2) * i) / (chart.length - 1),
  y: H - PAD - (p.value / maxV) * (H - PAD * 2)
}))
const linePath = 'M' + pts.map((p) => `${p.x} ${p.y}`).join(' L ')
const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`

const barData = [
  { day: 'Sen', value: 210 },
  { day: 'Sel', value: 265 },
  { day: 'Rab', value: 240 },
  { day: 'Kam', value: 320 },
  { day: 'Jum', value: 290 },
  { day: 'Sab', value: 180 },
  { day: 'Min', value: 140 }
]
const maxBar = Math.max(...barData.map((b) => b.value)) * 1.15

type Level = 'info' | 'warn' | 'error'
interface Log {
  time: string
  level: Level
  msg: string
}
const sampleLogs: Log[] = [
  { time: '10:42:13', level: 'info', msg: 'GET /api/events → 200 · 38ms' },
  { time: '10:42:09', level: 'warn', msg: 'Latensi tinggi: /api/search → 1.2s' },
  { time: '10:41:55', level: 'info', msg: 'WS terhubung client=db-7' },
  { time: '10:41:30', level: 'error', msg: 'Timeout query: orders#index' },
  { time: '10:41:12', level: 'info', msg: 'Cache hit rate 94.2%' },
  { time: '10:40:58', level: 'info', msg: 'Deploy rilis v2.4.1 selesai' },
  { time: '10:40:41', level: 'warn', msg: 'Penggunaan memori 78% dari limit' },
  { time: '10:40:25', level: 'info', msg: 'POST /api/auth/login → 201 · 52ms' },
  { time: '10:39:57', level: 'error', msg: 'Retry bank API: pembayaran #8812' },
  { time: '10:39:33', level: 'info', msg: 'Cron harian: laporan terjadwal' }
]
const levelColor: Record<Level, string> = { info: '#3B82F6', warn: '#F59E0B', error: '#F43F5E' }
const levelLabel: Record<Level, string> = { info: 'INFO', warn: 'WARN', error: 'ERROR' }
const logFilter = ref<'all' | Level>('all')
const filteredLogs = computed(() =>
  logFilter.value === 'all' ? sampleLogs : sampleLogs.filter((l) => l.level === logFilter.value)
)
</script>

<template>
  <div class="flex h-full min-h-[540px] flex-col bg-bg text-text">
    <!-- Header -->
    <header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div class="flex items-center gap-2.5">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">DB</span>
        <div class="leading-tight">
          <p class="text-sm font-extrabold tracking-tight">DevBoard</p>
          <p class="text-[10px] text-text-muted">Production · v2.4.1</p>
        </div>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true" />
        LIVE
      </span>
    </header>

    <div class="flex-1 overflow-y-auto p-4">
      <!-- KPI -->
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-for="k in kpis" :key="k.label" class="rounded-card border border-border bg-card p-4">
          <div class="flex items-center justify-between">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{{ k.label }}</p>
            <span class="flex h-7 w-7 items-center justify-center rounded-lg" :style="{ backgroundColor: k.color + '22', color: k.color }" aria-hidden="true">
              <component :is="k.icon" :size="14" :stroke-width="1.75" />
            </span>
          </div>
          <p class="mt-2 text-2xl font-extrabold tracking-tight text-text">{{ k.value }}</p>
          <p class="mt-0.5 text-[11px] text-text-muted">{{ k.sub }}</p>
        </div>
      </div>

      <!-- Grafik -->
      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <div class="rounded-card border border-border bg-card p-4 lg:col-span-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-text">Request / Jam</p>
            <span class="text-[10px] text-text-muted">24 jam terakhir</span>
          </div>
          <svg viewBox="0 0 400 130" class="mt-3 w-full" role="img" aria-label="Grafik request per jam">
            <defs>
              <linearGradient id="demo-dash-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#demo-dash-fill)" />
            <path :d="linePath" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
            <g v-for="(p, i) in pts" :key="i">
              <circle :cx="p.x" :cy="p.y" r="2" fill="#3B82F6" />
            </g>
          </svg>
        </div>

        <div class="rounded-card border border-border bg-card p-4">
          <p class="text-xs font-bold text-text">Traffic Mingguan</p>
          <div class="mt-4 flex h-32 items-end justify-between gap-2">
            <div v-for="b in barData" :key="b.day" class="flex flex-1 flex-col items-center gap-1.5">
              <div class="flex w-full flex-1 items-end rounded-md bg-bg-alt">
                <div
                  class="w-full rounded-md bg-gradient-to-t from-primary-violet to-primary-blue"
                  :style="{ height: (b.value / maxBar) * 100 + '%' }"
                />
              </div>
              <span class="text-[9px] font-medium text-text-muted">{{ b.day }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Log -->
      <div class="mt-4 overflow-hidden rounded-card border border-border bg-card">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p class="flex items-center gap-2 text-xs font-bold text-text">
            <Terminal :size="14" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            System Logs
            <span class="flex items-center gap-1 text-[10px] font-medium text-text-muted">
              <Bell :size="11" :stroke-width="1.5" />
              streaming
            </span>
          </p>
          <div class="flex gap-1">
            <button
              v-for="f in ['all', 'info', 'warn', 'error'] as const"
              :key="f"
              type="button"
              class="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors"
              :class="logFilter === f ? 'bg-bg-alt text-text' : 'text-text-muted hover:text-text'"
              @click="logFilter = f"
            >
              {{ f }}
            </button>
          </div>
        </div>
        <ul class="max-h-44 divide-y divide-border/60 overflow-y-auto">
          <li v-for="(l, i) in filteredLogs" :key="i" class="flex items-center gap-2.5 px-4 py-2 text-[11px]">
            <span class="shrink-0 font-mono text-text-muted">{{ l.time }}</span>
            <span
              class="w-11 shrink-0 rounded px-1.5 py-0.5 text-center text-[9px] font-bold"
              :style="{ backgroundColor: levelColor[l.level] + '1f', color: levelColor[l.level] }"
            >
              {{ levelLabel[l.level] }}
            </span>
            <span class="truncate font-mono text-text-secondary">{{ l.msg }}</span>
          </li>
          <li v-if="!filteredLogs.length" class="px-4 py-6 text-center text-[11px] text-text-muted">
            Tidak ada log dengan level ini.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

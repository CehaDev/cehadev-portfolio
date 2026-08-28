<script setup lang="ts">
import { History, LoaderCircle, RefreshCw } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Aktivitas'
})

interface ActivityRow {
  id: number
  actor_type: string
  actor_id: string
  action: string
  entity: string
  entity_id: string
  summary: string
  metadata: string
  created_at: string
}

const { data: logs, refresh, pending } = await useAsyncData<ActivityRow[]>('admin-activity', () =>
  useRequestFetch()<ActivityRow[]>('/api/admin/manage/activity?limit=100')
)

const actionTone: Record<string, string> = {
  'article.create': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'article.update': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'article.delete': 'text-red-400 bg-red-400/10 border-red-400/30',
  'article.status': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'article.restore': 'text-violet-400 bg-violet-400/10 border-violet-400/30'
}

function toneFor(action: string) {
  return actionTone[action] ?? 'text-text-muted bg-card border-border'
}

function actionLabel(action: string) {
  const map: Record<string, string> = {
    'article.create': 'Buat Artikel',
    'article.update': 'Ubah Artikel',
    'article.delete': 'Hapus Artikel',
    'article.status': 'Ubah Status',
    'article.restore': 'Restore'
  }
  return map[action] ?? action
}

function dateLabel(at: string) {
  const d = new Date(at)
  if (Number.isNaN(d.getTime())) return at
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}
</script>

<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-btn-glow" aria-hidden="true">
            <History :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Aktivitas & Audit Log</h2>
            <p class="mt-1 text-sm text-text-secondary">Jejak operasi penting (buat, ubah, terbit, hapus, restore) pada artikel & konten.</p>
          </div>
        </div>
        <button type="button" class="btn-outline !py-2.5" @click="refresh">
          <LoaderCircle v-if="pending" :size="15" class="animate-spin" />
          <RefreshCw v-else :size="15" :stroke-width="2" />
          Muat Ulang
        </button>
      </div>
    </div>

    <div class="card overflow-hidden p-0">
      <ul class="divide-y divide-border/60">
        <li v-for="l in logs ?? []" :key="l.id" class="flex items-start gap-4 px-7 py-4 transition-colors hover:bg-card/40">
          <span class="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold" :class="toneFor(l.action)">
            {{ actionLabel(l.action) }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-text">{{ l.summary || l.action }}</p>
            <p class="mt-0.5 font-mono text-[10px] text-text-muted">
              {{ l.actor_type }}<span v-if="l.actor_id"> · {{ l.actor_id }}</span>
              <template v-if="l.entity_id"> · {{ l.entity }}:{{ l.entity_id }}</template>
            </p>
          </div>
          <span class="shrink-0 text-[10px] text-text-muted">{{ dateLabel(l.created_at) }}</span>
        </li>
        <li v-if="!(logs ?? []).length" class="px-7 py-14 text-center">
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <History :size="22" :stroke-width="1.75" />
          </span>
          <p class="mt-3 text-sm font-medium text-text-secondary">Belum ada aktivitas tercatat. Aksi artikel akan tercatat di sini.</p>
        </li>
      </ul>
    </div>
  </div>
</template>

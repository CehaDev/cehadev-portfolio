<script setup lang="ts">
import { Newspaper, Plus, ArrowRight, LoaderCircle, Sparkles, Users, PenLine, RotateCcw, ListRestart, ChevronDown } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Manajemen Artikel (Relasional)'
})

interface RelArticle {
  id: string
  slug: string
  title: { id: string; en: string }
  status: string
  source_type: string
  created_at: string
  updated_at: string
  published_at: string | null
}

interface RevisionRow {
  id: string
  title: { id: string }
  content: { id: string }
  source_type: string
  changed_by: string
  change_summary: string
  created_at: string
}

const STATUSES = ['IDEA', 'DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']

const { data: articles, refresh } = await useAsyncData<RelArticle[]>('admin-manage-articles', () =>
  useRequestFetch()<RelArticle[]>('/api/admin/manage/articles')
)

const busy = ref<string | null>(null)
const expanded = ref<Record<string, { revisions: RevisionRow[]; loading: boolean }>>({})

const statusTone: Record<string, string> = {
  IDEA: 'border-zinc-400/30 bg-zinc-400/10 text-zinc-300',
  DRAFT: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  REVIEW: 'border-blue-400/30 bg-blue-400/10 text-blue-400',
  APPROVED: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400',
  PUBLISHED: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
  SCHEDULED: 'border-violet-400/30 bg-violet-400/10 text-violet-400',
  ARCHIVED: 'border-border bg-card text-text-muted'
}

const sourceIcon: Record<string, any> = { AI: Sparkles, HUMAN: Users, HUMAN_AI: PenLine }

function dateLabel(d: string | null) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function articleDate(a: RelArticle) {
  return dateLabel(a.published_at || a.updated_at || a.created_at)
}

async function transition(id: string, status: string) {
  const article = (articles.value ?? []).find((a) => a.id === id)
  if (!article) return
  if (status === article.status) return
  if (busy.value) return
  busy.value = `tr-${id}`
  try {
    await $fetch(`/api/admin/articles/${article.slug}/transition`, { method: 'POST', body: { toStatus: status } })
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    alert(err.data?.message ?? 'Transisi gagal')
  } finally {
    busy.value = null
  }
}

async function toggleRevisions(id: string, slug: string) {
  if (expanded.value[id]?.loading) return
  if (expanded.value[id] && !expanded.value[id].loading) {
    // sudah dimuat — tutup/buka
    if (expanded.value[id].revisions) {
      delete expanded.value[id]
      return
    }
  }
  expanded.value[id] = { loading: true, revisions: [] }
  try {
    const revisions = await $fetch<RevisionRow[]>(`/api/admin/articles/${slug}/revisions`)
    expanded.value[id] = { loading: false, revisions }
  } catch {
    expanded.value[id] = { loading: false, revisions: [] }
  }
}

async function restore(slug: string, revisionId: string) {
  if (busy.value) return
  busy.value = `rst-${revisionId}`
  try {
    await $fetch(`/api/admin/articles/${slug}/restore`, { method: 'POST', body: { revisionId } })
    await refresh()
    alert('Artikel dipulihkan dari revisi.')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    alert(err.data?.message ?? 'Gagal restore')
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Newspaper :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Manajemen Artikel (Workflow)</h2>
            <p class="mt-1 text-sm text-text-secondary">Tabel relasional per PRD — status workflow penuh, source type, dan revision history.</p>
          </div>
        </div>
        <NuxtLink to="/admin/articles/new" class="btn-primary !py-2.5">
          <Plus :size="16" :stroke-width="2" />
          Tulis Artikel
        </NuxtLink>
      </div>
    </div>

    <!-- Indikator alur -->
    <div class="card flex flex-wrap items-center gap-2 p-5 text-[11px] font-semibold text-text-muted">
      <span v-for="(s, i) in STATUSES" :key="s" class="inline-flex items-center gap-2">
        <span class="rounded-full border px-2.5 py-1" :class="statusTone[s]">{{ s }}</span>
        <ArrowRight v-if="i < STATUSES.length - 1" :size="12" class="text-text-muted" aria-hidden="true" />
      </span>
    </div>

    <!-- Daftar artikel relasional -->
    <div class="card overflow-hidden p-0">
      <ul class="divide-y divide-border/60">
        <li v-for="a in articles ?? []" :key="a.id">
          <div class="flex flex-col gap-3 px-7 py-4 transition-colors hover:bg-card/40 sm:flex-row sm:items-center">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-text">{{ a.title.id || a.slug }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <code class="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-text-muted">{{ a.slug }}</code>
                <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold" :class="statusTone[a.status]">{{ a.status }}</span>
                <span class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <component :is="sourceIcon[a.source_type]" :size="10" :stroke-width="2" />
                  {{ a.source_type }}
                </span>
                <span class="text-[10px] text-text-muted">{{ dateLabel(a.updated_at) }}</span>
              </div>
            </div>
            <button
              type="button"
              class="btn-outline shrink-0 !px-4 !py-2 text-xs"
              @click="toggleRevisions(a.id, a.slug)"
            >
              <ListRestart :size="13" :stroke-width="1.75" />
              Revisi
            </button>
          </div>

          <!-- Pilihan transisi status -->
          <div class="flex flex-wrap items-center gap-2 px-7 pb-4">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Transisi:</span>
            <button
              v-for="s in STATUSES"
              :key="s"
              type="button"
              class="rounded-btn border px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50"
              :class="s === a.status ? statusTone[s] : 'border-border text-text-muted hover:text-text'"
              :disabled="busy !== null || s === a.status"
              @click="transition(a.id, s)"
            >
              <LoaderCircle v-if="busy === `tr-${a.id}`" :size="11" class="animate-spin" />
              <template v-else>{{ s }}</template>
            </button>
          </div>

          <!-- Daftar revisi -->
          <div v-if="expanded[a.id]" class="border-t border-border/60 bg-bg/40 px-7 py-4">
            <p v-if="expanded[a.id].loading" class="flex items-center gap-2 text-xs text-text-muted">
              <LoaderCircle :size="13" class="animate-spin" /> Memuat revisi...
            </p>
            <template v-else-if="expanded[a.id].revisions.length">
              <p class="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Revision History ({{ expanded[a.id].revisions.length }})</p>
              <ul class="divide-y divide-border/50">
                <li v-for="r in expanded[a.id].revisions" :key="r.id" class="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <div class="min-w-0">
                    <p class="truncate text-xs font-medium text-text">{{ r.change_summary || 'Perubahan' }}</p>
                    <p class="font-mono text-[10px] text-text-muted">{{ dateLabel(r.created_at) }} · {{ r.changed_by || 'system' }}</p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex shrink-0 items-center gap-1 rounded-btn border border-violet-400/40 px-3 py-1.5 text-[11px] font-semibold text-violet-400 transition-colors hover:bg-violet-400/10"
                    @click="restore(a.slug, r.id)"
                  >
                    <LoaderCircle v-if="busy === `rst-${r.id}`" :size="11" class="animate-spin" />
                    <RotateCcw v-else :size="11" :stroke-width="1.75" />
                    Restore
                  </button>
                </li>
              </ul>
            </template>
            <p v-else class="text-xs text-text-muted">Belum ada revisi tersimpan.</p>
          </div>
        </li>
        <li v-if="!(articles ?? []).length" class="px-7 py-14 text-center">
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <Newspaper :size="22" :stroke-width="1.75" />
          </span>
          <p class="mt-3 text-sm font-medium text-text-secondary">
            Belum ada artikel di tabel relasional. Jalankan migration lalu buat artikel pertama via API relasional.
          </p>
          <p class="mt-1 font-mono text-[10px] text-text-muted">node scripts/migrate.mjs</p>
        </li>
      </ul>
    </div>
  </div>
</template>

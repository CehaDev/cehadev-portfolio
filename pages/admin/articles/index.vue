<script setup lang="ts">
import { Plus, Newspaper, Pencil, Trash2, ExternalLink, LoaderCircle, FileEdit, FileCheck2, Search, X, Eye, EyeOff, Tag } from 'lucide-vue-next'
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

const { data: articles, refresh } = await useAsyncData('admin-articles-list', () =>
  useRequestFetch()<AdminArticleRow[]>('/api/admin/articles')
)

const busy = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)
const query = ref('')

const tab = ref<'all' | 'published' | 'draft'>('all')
const publishedCount = computed(() => (articles.value ?? []).filter((a) => a.status === 'published').length)
const draftCount = computed(() => (articles.value ?? []).filter((a) => a.status === 'draft').length)

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

async function removePermanent(slug: string) {
  if (busy.value) return
  busy.value = slug
  try {
    await $fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' })
    confirmDelete.value = null
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    alert(err.data?.statusMessage ?? 'Gagal menghapus artikel')
  } finally {
    busy.value = null
  }
}

async function toggleStatus(a: AdminArticleRow) {
  if (busy.value) return
  busy.value = `toggle-${a.slug}`
  try {
    await $fetch(`/api/admin/articles/${a.slug}`, { method: 'PUT', body: { ...a, status: a.status === 'published' ? 'draft' : 'published' } })
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
            <p class="mt-1 text-sm text-text-secondary">Tulis artikel markdown dua bahasa, atur jadwal terbit & SEO. {{ articles?.length ?? 0 }} artikel tersimpan.</p>
            <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted">
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Terbit: {{ publishedCount }}</span>
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Draft: {{ draftCount }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/admin/articles/new" class="btn-primary !py-2.5">
            <Plus :size="16" :stroke-width="2" />
            Tulis Artikel
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Buat artikel baru</span>
        </div>
      </div>
    </div>

    <!-- Tab + pencarian -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="inline-flex items-center gap-1 rounded-btn border border-border bg-card p-1" role="tablist" aria-label="Filter artikel">
        <button
          v-for="tb in [
            { key: 'all', label: 'Semua', count: articles?.length ?? 0 },
            { key: 'published', label: 'Terbit', count: publishedCount },
            { key: 'draft', label: 'Draft', count: draftCount }
          ]"
          :key="tb.key"
          type="button"
          role="tab"
          :aria-selected="tab === tb.key"
          class="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"
          :class="tab === tb.key ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-muted hover:text-text'"
          @click="tab = tb.key as any"
        >
          {{ tb.label }}
          <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="tab === tb.key ? 'bg-white/20 text-white' : 'bg-bg-alt text-text-muted'">{{ tb.count }}</span>
        </button>
      </div>

      <div class="relative w-full sm:w-72">
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

    <!-- List -->
    <div class="card overflow-hidden p-0">
      <ul class="divide-y divide-border/60">
        <li v-for="(a, i) in currentList" :key="a.slug" class="flex items-center gap-4 px-7 py-4 transition-colors hover:bg-card/40">
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
              <span v-if="(a.tags ?? []).length" class="truncate font-mono text-[10px] text-text-muted">{{ (a.tags ?? []).slice(0, 3).map((tg) => `#${tg}`).join(' ') }}</span>
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
          <div class="flex shrink-0 items-center gap-3">
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
            <Newspaper :size="22" :stroke-width="1.75" />
          </span>
          <p class="mt-3 text-sm font-medium text-text-secondary">
            {{ query ? `Tidak ada artikel yang cocok dengan "${query}".` : 'Belum ada artikel' + (tab !== 'all' ? ' pada status ini.' : '. Klik "Tulis Artikel" untuk mulai.') }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Modal konfirmasi -->
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
  </div>
</template>

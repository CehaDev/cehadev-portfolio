<script setup lang="ts">
import { Plus, Star, ExternalLink, Pencil, Trash2, LoaderCircle, Archive, ArchiveRestore, FolderKanban } from 'lucide-vue-next'
import { lsId } from '~/utils/localize'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Projects'
})

const { data: projects, refresh } = await useAsyncData('admin-projects-list', () =>
  useRequestFetch()<Array<Record<string, any>>>('/api/admin/projects')
)

const tab = ref<'active' | 'archived'>('active')
const busy = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)

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

const activeProjects = computed(() => (projects.value ?? []).filter((p) => !p.archived))
const archivedProjects = computed(() => (projects.value ?? []).filter((p) => p.archived))
const currentProjects = computed(() => (tab.value === 'active' ? activeProjects.value : archivedProjects.value))

async function runAction(slug: string, query?: string) {
  if (busy.value) return
  busy.value = slug
  try {
    await $fetch(`/api/admin/projects/${slug}${query ?? ''}`, { method: 'DELETE' })
    confirmDelete.value = null
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    alert(err.data?.statusMessage ?? 'Gagal memproses project')
  } finally {
    busy.value = null
  }
}

const archive = (slug: string) => runAction(slug)
const restore = (slug: string) => runAction(slug, '?restore=true')
const removePermanent = (slug: string) => runAction(slug, '?permanent=true')

const avatarGradients = [
  'from-violet-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-lime-600',
  'from-amber-500 to-rose-600',
  'from-fuchsia-500 to-violet-600',
  'from-teal-500 to-emerald-600'
]

function initialOf(title: string): string {
  return lsId(title).trim().charAt(0).toUpperCase() || '?'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <FolderKanban :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Kelola Projects</h2>
            <p class="mt-1 text-sm text-text-secondary">{{ projects?.length ?? 0 }} project tersimpan di content/projects/. Arsipkan yang lama agar daftar tetap rapi.</p>
            <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted">
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Aktif: {{ activeProjects.length }}</span>
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Arsip: {{ archivedProjects.length }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/admin/projects/new" class="btn-primary !py-2.5">
            <Plus :size="16" :stroke-width="2" />
            Tambah Project
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Buat project baru</span>
        </div>
      </div>
    </div>

    <!-- Tab -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="inline-flex items-center gap-1 rounded-btn border border-border bg-card p-1" role="tablist" aria-label="Filter project">
        <button
          type="button"
          role="tab"
          class="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"
          :class="tab === 'active' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-muted hover:text-text'"
          @click="tab = 'active'"
        >
          <ArchiveRestore :size="14" :stroke-width="2" />
          Aktif
          <span
            class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
            :class="tab === 'active' ? 'bg-white/20 text-white' : 'bg-bg-alt text-text-muted'"
          >{{ activeProjects.length }}</span>
        </button>
        <button
          type="button"
          role="tab"
          class="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors"
          :class="tab === 'archived' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-muted hover:text-text'"
          @click="tab = 'archived'"
        >
          <Archive :size="14" :stroke-width="2" />
          Arsip
          <span
            class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
            :class="tab === 'archived' ? 'bg-white/20 text-white' : 'bg-bg-alt text-text-muted'"
          >{{ archivedProjects.length }}</span>
        </button>
      </div>
      <p class="text-xs text-text-muted">
        <template v-if="tab === 'active'">Menampilkan {{ activeProjects.length }} project aktif.</template>
        <template v-else>Menampilkan {{ archivedProjects.length }} project di arsip.</template>
      </p>
    </div>

    <div class="card overflow-hidden p-0">
      <!-- Desktop: tabel -->
      <div class="hidden md:block">
        <div class="grid border-b border-border bg-card-alt/50 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted md:grid-cols-[minmax(0,1fr)_minmax(0,130px)_minmax(0,70px)_minmax(0,120px)_minmax(0,110px)_minmax(0,250px)] md:gap-6">
          <span>Project</span>
          <span>Kategori</span>
          <span>Tahun</span>
          <span>Demo</span>
          <span>Featured</span>
          <span class="text-right">Aksi</span>
        </div>
        <ul class="divide-y divide-border/60">
          <li v-for="(p, i) in currentProjects" :key="p.slug" class="px-7 py-5 transition-colors hover:bg-card/40">
            <div class="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,130px)_minmax(0,70px)_minmax(0,120px)_minmax(0,110px)_minmax(0,250px)]">
              <div class="flex min-w-0 items-center gap-4">
                <span
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"
                  :class="avatarGradients[i % avatarGradients.length]"
                  aria-hidden="true"
                >
                  {{ initialOf(p.title) }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-text">{{ lsId(p.title) }}</p>
                  <NuxtLink :to="`/projects/${p.slug}`" target="_blank" class="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-text-muted transition-colors hover:text-primary">
                    /projects/{{ p.slug }}
                    <ExternalLink :size="10" :stroke-width="1.75" />
                  </NuxtLink>
                </div>
              </div>
              <span class="truncate text-sm text-text-secondary">{{ lsId(p.category) }}</span>
              <span class="text-sm text-text-secondary">{{ p.year }}</span>
              <span>
                <span v-if="demoTypeOf(p)" class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary" :title="'Demo: ' + demoTypeOf(p)">
                  Demo · {{ demoTypeOf(p) }}
                </span>
                <span v-else class="text-xs text-text-muted">—</span>
              </span>
              <span>
                <span v-if="p.featured" class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                  <Star :size="10" :stroke-width="2" class="fill-amber-400" />
                  Featured
                </span>
                <span v-else class="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-text-muted">Tidak</span>
              </span>
              <div class="flex items-center justify-end gap-5">
                <template v-if="tab === 'active'">
                  <div class="flex flex-col items-center gap-1">
                    <NuxtLink :to="`/admin/projects/${p.slug}`" class="btn-outline shrink-0 !px-4 !py-2 text-xs">
                      <Pencil :size="13" :stroke-width="1.75" />
                      Edit
                    </NuxtLink>
                    <span class="text-[9px] text-text-muted">Ubah isi & pengaturan</span>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-amber-400/50 hover:text-amber-400"
                      :disabled="busy === p.slug"
                      @click="archive(p.slug)"
                    >
                      <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                      <Archive v-else :size="13" :stroke-width="1.75" />
                      Arsipkan
                    </button>
                    <span class="text-[9px] text-text-muted">Pindah ke arsip</span>
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
                      :disabled="busy === p.slug"
                      @click="restore(p.slug)"
                    >
                      <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                      <ArchiveRestore v-else :size="13" :stroke-width="1.75" />
                      Pulihkan
                    </button>
                    <span class="text-[9px] text-text-muted">Kembalikan ke aktif</span>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      class="inline-flex shrink-0 items-center gap-1.5 rounded-btn border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
                      @click="confirmDelete = p.slug"
                    >
                      <Trash2 :size="13" :stroke-width="1.75" />
                      Hapus Permanen
                    </button>
                    <span class="text-[9px] text-text-muted">Hapus selamanya</span>
                  </div>
                </template>
              </div>
            </div>
          </li>
          <li v-if="!currentProjects.length" class="px-7 py-12 text-center">
            <p class="text-sm font-medium text-text-secondary">
              <template v-if="tab === 'active'">Belum ada project. Klik "Tambah Project" untuk mulai.</template>
              <template v-else>Tidak ada project yang diarsipkan.</template>
            </p>
          </li>
        </ul>
      </div>

      <!-- Mobile: kartu project -->
      <ul class="divide-y divide-border/60 md:hidden">
        <li v-for="(p, i) in currentProjects" :key="p.slug" class="p-4">
          <div class="flex items-start gap-3">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white"
              :class="avatarGradients[i % avatarGradients.length]"
              aria-hidden="true"
            >
              {{ initialOf(p.title) }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-text">{{ lsId(p.title) }}</p>
                  <p class="mt-0.5 truncate text-xs text-text-muted">{{ lsId(p.category) }} • {{ p.year }}</p>
                </div>
                <div class="flex shrink-0 items-center gap-1.5">
                  <span
                    v-if="demoTypeOf(p)"
                    class="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                    :title="'Demo: ' + demoTypeOf(p)"
                  >
                    Demo · {{ demoTypeOf(p) }}
                  </span>
                  <span
                    v-if="p.featured"
                    class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400"
                  >
                    <Star :size="10" :stroke-width="2" class="fill-amber-400" />
                    Featured
                  </span>
                </div>
              </div>
              <NuxtLink :to="`/projects/${p.slug}`" target="_blank" class="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-text-muted hover:text-primary">
                /projects/{{ p.slug }}
                <ExternalLink :size="10" :stroke-width="1.75" />
              </NuxtLink>
              <div class="mt-3 flex flex-wrap items-start gap-3">
                <template v-if="tab === 'active'">
                  <div class="flex flex-col items-center gap-1">
                    <NuxtLink :to="`/admin/projects/${p.slug}`" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-text">
                      <Pencil :size="13" :stroke-width="1.75" />
                      Edit
                    </NuxtLink>
                    <span class="text-[9px] text-text-muted">Ubah isi & pengaturan</span>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-amber-400/50 hover:text-amber-400"
                      :disabled="busy === p.slug"
                      @click="archive(p.slug)"
                    >
                      <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                      <Archive v-else :size="13" :stroke-width="1.75" />
                      Arsipkan
                    </button>
                    <span class="text-[9px] text-text-muted">Pindah ke arsip</span>
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
                      :disabled="busy === p.slug"
                      @click="restore(p.slug)"
                    >
                      <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                      <ArchiveRestore v-else :size="13" :stroke-width="1.75" />
                      Pulihkan
                    </button>
                    <span class="text-[9px] text-text-muted">Kembalikan ke aktif</span>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
                      @click="confirmDelete = p.slug"
                    >
                      <Trash2 :size="13" :stroke-width="1.75" />
                      Hapus
                    </button>
                    <span class="text-[9px] text-text-muted">Hapus selamanya</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </li>
        <li v-if="!currentProjects.length" class="px-5 py-12 text-center">
          <p class="text-sm font-medium text-text-secondary">
            <template v-if="tab === 'active'">Belum ada project. Klik "Tambah Project" untuk mulai.</template>
            <template v-else>Tidak ada project yang diarsipkan.</template>
          </p>
        </li>
      </ul>
    </div>

    <!-- Modal konfirmasi hapus permanen -->
    <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus permanen">
      <div class="card w-full max-w-sm p-7">
        <h3 class="text-lg font-bold text-text">Hapus permanen project?</h3>
        <p class="mt-2 text-sm text-text-secondary">
          Project <strong class="text-text">{{ confirmDelete }}</strong> akan <strong class="text-red-400">dihapus permanen</strong> dari file konten dan tidak bisa dipulihkan. Lanjutkan?
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="btn-outline !px-4 !py-2.5" @click="confirmDelete = null">Batal</button>
          <button type="button" class="btn-primary !px-4 !py-2.5 !bg-red-600 !shadow-none" :disabled="busy === confirmDelete" @click="removePermanent(confirmDelete)">
            <LoaderCircle v-if="busy === confirmDelete" :size="15" class="animate-spin" />
            <Trash2 v-else :size="15" :stroke-width="2" />
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

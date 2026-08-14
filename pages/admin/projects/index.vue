<script setup lang="ts">
import { Plus, Star, ExternalLink, Pencil, Trash2, LoaderCircle, Archive, ArchiveRestore } from 'lucide-vue-next'
import { lsId } from '~/utils/localize'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Projects'
})

const { data: projects, refresh } = await useAsyncData('admin-projects-list', () =>
  useRequestFetch()('/api/admin/projects')
)

const tab = ref<'active' | 'archived'>('active')
const busy = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)

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
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-text">Kelola Projects</h2>
        <p class="mt-1 text-sm text-text-secondary">{{ projects?.length ?? 0 }} project tersimpan di content/projects/.</p>
      </div>
      <NuxtLink to="/admin/projects/new" class="btn-primary !py-2.5">
        <Plus :size="16" :stroke-width="2" />
        Tambah Project
      </NuxtLink>
    </div>

    <div class="flex items-center gap-1 border-b border-border">
      <button
        type="button"
        class="relative -mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors"
        :class="tab === 'active' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'"
        @click="tab = 'active'"
      >
        <ArchiveRestore :size="14" :stroke-width="2" />
        Aktif
        <span class="rounded-full bg-bg-alt px-1.5 py-0.5 text-[10px] font-bold">{{ activeProjects.length }}</span>
      </button>
      <button
        type="button"
        class="relative -mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors"
        :class="tab === 'archived' ? 'border-amber-400 text-amber-400' : 'border-transparent text-text-muted hover:text-text'"
        @click="tab = 'archived'"
      >
        <Archive :size="14" :stroke-width="2" />
        Arsip
        <span class="rounded-full bg-bg-alt px-1.5 py-0.5 text-[10px] font-bold">{{ archivedProjects.length }}</span>
      </button>
    </div>

    <div class="card overflow-hidden">
      <!-- Mobile: kartu project -->
      <ul class="divide-y divide-border/60 md:hidden">
        <li v-for="p in currentProjects" :key="p.slug" class="p-4">
          <div class="flex items-start gap-3">
            <img :src="`/ch.png`" alt="" class="h-11 w-11 shrink-0 rounded-lg object-cover" />
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-text">{{ lsId(p.title) }}</p>
                  <p class="mt-0.5 truncate text-xs text-text-muted">{{ lsId(p.category) }} • {{ p.year }}</p>
                </div>
                <span
                  v-if="p.featured"
                  class="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400"
                >
                  <Star :size="10" :stroke-width="2" class="fill-amber-400" />
                  Featured
                </span>
                <span v-else class="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-text-muted">Tidak</span>
              </div>
              <a :href="p.liveUrl" target="_blank" rel="noopener noreferrer" class="mt-1 flex items-center gap-1 truncate text-xs text-text-muted hover:text-primary">
                {{ p.liveUrl }}
                <ExternalLink :size="11" :stroke-width="1.5" />
              </a>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <template v-if="tab === 'active'">
                  <NuxtLink :to="`/admin/projects/${p.slug}`" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-text">
                    <Pencil :size="13" :stroke-width="1.5" />
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-amber-400/50 hover:text-amber-400"
                    :disabled="busy === p.slug"
                    @click="archive(p.slug)"
                  >
                    <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                    <Archive v-else :size="13" :stroke-width="1.5" />
                    Arsipkan
                  </button>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
                    :disabled="busy === p.slug"
                    @click="restore(p.slug)"
                  >
                    <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                    <ArchiveRestore v-else :size="13" :stroke-width="1.5" />
                    Pulihkan
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
                    @click="confirmDelete = p.slug"
                  >
                    <Trash2 :size="13" :stroke-width="1.5" />
                    Hapus
                  </button>
                </template>
              </div>
            </div>
          </div>
        </li>
        <li v-if="!currentProjects.length" class="px-5 py-10 text-center text-sm text-text-muted">
          <template v-if="tab === 'active'">Belum ada project. Klik "Tambah Project" untuk mulai.</template>
          <template v-else>Tidak ada project yang diarsipkan.</template>
        </li>
      </ul>

      <!-- Desktop: tabel -->
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-border bg-bg-alt text-xs uppercase tracking-wider text-text-muted">
              <th class="px-5 py-3.5 font-semibold">Project</th>
              <th class="px-5 py-3.5 font-semibold">Kategori</th>
              <th class="px-5 py-3.5 font-semibold">Tahun</th>
              <th class="px-5 py-3.5 font-semibold">Featured</th>
              <th class="px-5 py-3.5 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr v-for="p in currentProjects" :key="p.slug" class="transition-colors hover:bg-card">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img :src="`/ch.png`" alt="" class="hidden h-10 w-10 rounded-lg object-cover sm:block" />
                  <div class="min-w-0">
                    <p class="font-semibold text-text">{{ lsId(p.title) }}</p>
                    <a :href="p.liveUrl" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-xs text-text-muted hover:text-primary">
                      {{ p.liveUrl }}
                      <ExternalLink :size="11" :stroke-width="1.5" />
                    </a>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-text-secondary">{{ lsId(p.category) }}</td>
              <td class="px-5 py-4 text-text-secondary">{{ p.year }}</td>
              <td class="px-5 py-4">
                <span v-if="p.featured" class="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                  <Star :size="10" :stroke-width="2" class="fill-amber-400" />
                  Featured
                </span>
                <span v-else class="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-text-muted">Tidak</span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center justify-end gap-2">
                  <template v-if="tab === 'active'">
                    <NuxtLink :to="`/admin/projects/${p.slug}`" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-text">
                      <Pencil :size="13" :stroke-width="1.5" />
                      Edit
                    </NuxtLink>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-amber-400/50 hover:text-amber-400"
                      :disabled="busy === p.slug"
                      @click="archive(p.slug)"
                    >
                      <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                      <Archive v-else :size="13" :stroke-width="1.5" />
                      Arsipkan
                    </button>
                  </template>
                  <template v-else>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
                      :disabled="busy === p.slug"
                      @click="restore(p.slug)"
                    >
                      <LoaderCircle v-if="busy === p.slug" :size="13" class="animate-spin" />
                      <ArchiveRestore v-else :size="13" :stroke-width="1.5" />
                      Pulihkan
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
                      @click="confirmDelete = p.slug"
                    >
                      <Trash2 :size="13" :stroke-width="1.5" />
                      Hapus Permanen
                    </button>
                  </template>
                </div>
              </td>
            </tr>
            <tr v-if="!((tab === 'active' ? activeProjects : archivedProjects).length)">
              <td colspan="5" class="px-5 py-10 text-center text-sm text-text-muted">
                <template v-if="tab === 'active'">Belum ada project. Klik "Tambah Project" untuk mulai.</template>
                <template v-else>Tidak ada project yang diarsipkan.</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

<script setup lang="ts">
import { Plus, Star, ExternalLink, Pencil, Trash2, LoaderCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Projects'
})

const { data: projects, refresh } = await useAsyncData('admin-projects-list', () =>
  $fetch('/api/admin/projects')
)

const deleting = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)

async function remove(slug: string) {
  if (deleting.value) return
  deleting.value = slug
  try {
    await $fetch(`/api/admin/projects/${slug}`, { method: 'DELETE' })
    confirmDelete.value = null
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    alert(err.data?.statusMessage ?? 'Gagal menghapus project')
  } finally {
    deleting.value = null
  }
}
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

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
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
            <tr v-for="p in projects ?? []" :key="p.slug" class="transition-colors hover:bg-card">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img :src="`/ch.png`" alt="" class="hidden h-10 w-10 rounded-lg object-cover sm:block" />
                  <div class="min-w-0">
                    <p class="font-semibold text-text">{{ p.title }}</p>
                    <a :href="p.liveUrl" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-xs text-text-muted hover:text-primary">
                      {{ p.liveUrl }}
                      <ExternalLink :size="11" :stroke-width="1.5" />
                    </a>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-text-secondary">{{ p.category }}</td>
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
                  <NuxtLink :to="`/admin/projects/${p.slug}`" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-white">
                    <Pencil :size="13" :stroke-width="1.5" />
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
                    @click="confirmDelete = p.slug"
                  >
                    <Trash2 :size="13" :stroke-width="1.5" />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!(projects?.length)">
              <td colspan="5" class="px-5 py-10 text-center text-sm text-text-muted">
                Belum ada project. Klik "Tambah Project" untuk mulai.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal konfirmasi hapus -->
    <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Konfirmasi hapus">
      <div class="card w-full max-w-sm p-7">
        <h3 class="text-lg font-bold text-text">Hapus project?</h3>
        <p class="mt-2 text-sm text-text-secondary">
          Project <strong class="text-text">{{ confirmDelete }}</strong> akan dihapus permanen dari file konten. Lanjutkan?
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="btn-outline !px-4 !py-2.5" @click="confirmDelete = null">Batal</button>
          <button type="button" class="btn-primary !px-4 !py-2.5 !bg-red-600 !shadow-none" :disabled="deleting === confirmDelete" @click="remove(confirmDelete)">
            <LoaderCircle v-if="deleting === confirmDelete" :size="15" class="animate-spin" />
            <Trash2 v-else :size="15" :stroke-width="2" />
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

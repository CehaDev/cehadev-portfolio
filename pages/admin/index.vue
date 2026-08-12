<script setup lang="ts">
import { FolderKanban, Star, Tag, CalendarRange, Plus, ArrowRight, Layers, FileText } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Dashboard'
})

const { data: projects, refresh } = await useAsyncData('admin-projects', () =>
  $fetch('/api/admin/projects')
)

const stats = computed(() => {
  const list = projects.value ?? []
  return [
    { label: 'Total Projects', value: list.length, icon: FolderKanban, color: '#8B5CF6' },
    { label: 'Featured', value: list.filter((p) => p.featured).length, icon: Star, color: '#F59E0B' },
    { label: 'Kategori', value: new Set(list.map((p) => p.category)).size, icon: Tag, color: '#22C55E' },
    { label: 'Tahun', value: new Set(list.map((p) => p.year)).size, icon: CalendarRange, color: '#3B82F6' }
  ]
})

const latest = computed(() => [...(projects.value ?? [])].sort((a, b) => String(b.year).localeCompare(String(a.year))).slice(0, 5))
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-text">Selamat datang di Admin Panel</h2>
        <p class="mt-1 text-sm text-text-secondary">Kelola data project yang tampil di website portfolio Anda.</p>
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

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="s in stats" :key="s.label" class="card p-6">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl" :style="{ backgroundColor: s.color + '22', color: s.color }" aria-hidden="true">
          <component :is="s.icon" :size="20" :stroke-width="1.5" />
        </span>
        <p class="mt-4 text-3xl font-extrabold text-text">{{ s.value }}</p>
        <p class="mt-1 text-sm font-medium text-text-secondary">{{ s.label }}</p>
      </div>
    </div>

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
  </div>
</template>

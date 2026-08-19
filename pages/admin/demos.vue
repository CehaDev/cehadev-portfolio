<script setup lang="ts">
import { Play, ExternalLink, Monitor, Smartphone, FolderKanban } from 'lucide-vue-next'
import { lsId } from '~/utils/localize'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Demos'
})

const { data: projects } = await useAsyncData('admin-demos-list', () =>
  useRequestFetch()('/api/admin/projects')
)

const demoProjects = computed(() =>
  (projects.value ?? []).filter((p: any) => p.demo?.enabled && !p.archived)
)

const demoBadges: Record<string, string> = {
  store: 'Store',
  kanban: 'Kanban',
  dashboard: 'Dashboard',
  api: 'API',
  todo: 'Task',
  code: 'Code',
  studio: 'Studio'
}

function demoTypeOf(p: any): string {
  const d = p.demo
  if (!d?.type) return ''
  return demoBadges[d.type] || d.type
}

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
            <Play :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Demo Interaktif</h2>
            <p class="mt-1 text-sm text-text-secondary">{{ demoProjects.length }} project dengan demo aktif. Klik untuk melihat live preview.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(p, i) in demoProjects"
        :key="p.slug"
        class="card group relative overflow-hidden p-0 transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-primary/25"
      >
        <!-- Preview Thumbnail -->
        <div class="relative h-40 overflow-hidden bg-gradient-to-br from-bg-alt to-bg">
          <div class="absolute inset-0 flex items-center justify-center">
            <span
              class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-extrabold text-white shadow-lg"
              :class="avatarGradients[i % avatarGradients.length]"
              aria-hidden="true"
            >
              {{ initialOf(p.title) }}
            </span>
          </div>
          <!-- Demo Type Badge -->
          <div class="absolute left-3 top-3">
            <span class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary backdrop-blur-sm">
              <Play :size="9" :stroke-width="2.5" class="fill-primary" />
              {{ demoTypeOf(p) }}
            </span>
          </div>
          <!-- Device Icons -->
          <div class="absolute right-3 top-3 flex gap-1.5">
            <span class="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-bg/80 text-text-muted backdrop-blur-sm">
              <Monitor :size="11" :stroke-width="1.75" />
            </span>
            <span class="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-bg/80 text-text-muted backdrop-blur-sm">
              <Smartphone :size="11" :stroke-width="1.75" />
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="text-sm font-bold text-text">{{ lsId(p.title) }}</h3>
          <p class="mt-1 text-xs text-text-muted">{{ lsId(p.category) }} &middot; {{ p.year }}</p>

          <!-- Links -->
          <div class="mt-4 flex gap-2">
            <NuxtLink
              :to="`/projects/${p.slug}`"
              target="_blank"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text"
            >
              <ExternalLink :size="12" :stroke-width="1.75" />
              Detail
            </NuxtLink>
            <NuxtLink
              :to="`/admin/projects/${p.slug}`"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text"
            >
              Edit
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!demoProjects.length" class="card flex flex-col items-center justify-center py-16 text-center">
      <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-alt text-text-muted">
        <FolderKanban :size="28" :stroke-width="1.5" />
      </span>
      <p class="mt-4 text-sm font-medium text-text-secondary">Belum ada project dengan demo aktif.</p>
      <p class="mt-1 text-xs text-text-muted">Aktifkan demo di pengaturan project untuk melihatnya di sini.</p>
      <NuxtLink to="/admin/projects" class="btn-primary mt-5 !py-2.5 text-xs">
        Kelola Projects
      </NuxtLink>
    </div>
  </div>
</template>

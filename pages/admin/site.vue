<script setup lang="ts">
import { ExternalLink, Settings2, Languages, MessageSquareQuote, BarChart3, Mail, FolderKanban, HelpCircle, Search, Sparkles } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Pengaturan Website'
})

const { data: site, refresh } = await useAsyncData('admin-site', () => useRequestFetch()('/api/admin/site'))

async function onSaved() {
  await refresh()
  await navigateTo('/admin/site')
}

const sections = computed(() => [
  { label: 'Hero', icon: Sparkles, count: 6 },
  { label: 'Tentang', icon: Languages, count: (site.value?.aboutIntro?.length ?? 0) + (site.value?.aboutChecklist?.length ?? 0) },
  { label: 'Statistik', icon: BarChart3, count: site.value?.stats?.length ?? 0 },
  { label: 'Kontak', icon: Mail, count: 1 },
  { label: 'Project Stats', icon: FolderKanban, count: site.value?.projectStats?.length ?? 0 },
  { label: 'FAQ', icon: HelpCircle, count: site.value?.faqs?.length ?? 0 },
  { label: 'Headings', icon: MessageSquareQuote, count: Object.keys(site.value?.headings ?? {}).length },
  { label: 'SEO', icon: Search, count: Object.keys(site.value?.seo ?? {}).length }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Hero header -->
    <div class="card relative overflow-hidden p-8">
      <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-blue/10 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-6">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Settings2 :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles :size="12" :stroke-width="2" aria-hidden="true" />
              Site Settings
            </span>
            <h2 class="mt-3 text-xl font-extrabold tracking-tight text-text">Pengaturan Website</h2>
            <p class="mt-1.5 text-sm text-text-secondary">Kelola hero, tentang, statistik, kontak, sosial, dan FAQ website.</p>
            <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted">
              <span v-for="s in sections" :key="s.label" class="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
                <component :is="s.icon" :size="11" :stroke-width="2" class="text-primary" />
                {{ s.label }}: {{ s.count }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <NuxtLink to="/" target="_blank" class="btn-outline !py-2.5">
            <ExternalLink :size="16" :stroke-width="2" />
            Lihat Website
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Pratinjau halaman publik</span>
        </div>
      </div>
    </div>

    <AdminSiteForm v-if="site" :initial="site" @saved="onSaved" />
  </div>
</template>

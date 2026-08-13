<script setup lang="ts">
import { ArrowLeft, ExternalLink } from 'lucide-vue-next'

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
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text" aria-label="Kembali">
          <ArrowLeft :size="16" :stroke-width="2" />
        </NuxtLink>
        <div>
          <h2 class="text-xl font-bold text-text">Pengaturan Website</h2>
          <p class="mt-0.5 text-sm text-text-secondary">Kelola hero, tentang, statistik, kontak, sosial, dan FAQ website.</p>
        </div>
      </div>
      <NuxtLink to="/" target="_blank" class="btn-outline !px-4 !py-2.5">
        <ExternalLink :size="16" :stroke-width="2" />
        Lihat Website
      </NuxtLink>
    </div>

    <AdminSiteForm v-if="site" :initial="site" @saved="onSaved" />
  </div>
</template>

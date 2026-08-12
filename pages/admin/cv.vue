<script setup lang="ts">
import { ArrowLeft, ExternalLink, Save } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Kelola CV'
})

const { data: cv, refresh } = await useAsyncData('admin-cv', () => $fetch('/api/admin/cv'))

async function onSaved() {
  await refresh()
  await navigateTo('/admin/cv')
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text" aria-label="Kembali">
          <ArrowLeft :size="16" :stroke-width="2" />
        </NuxtLink>
        <div>
          <h2 class="text-xl font-bold text-text">Kelola CV</h2>
          <p class="mt-0.5 text-sm text-text-secondary">Data CV tersimpan di content/cv.json.</p>
        </div>
      </div>
      <NuxtLink to="/cv" target="_blank" class="btn-outline !px-4 !py-2.5">
        <ExternalLink :size="16" :stroke-width="2" />
        Lihat CV
      </NuxtLink>
    </div>

    <AdminCvForm v-if="cv" :initial="cv" @saved="onSaved" />
  </div>
</template>

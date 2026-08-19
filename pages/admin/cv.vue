<script setup lang="ts">
import { ArrowLeft, ExternalLink, FileText, User } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Kelola CV'
})

const { data: cv, refresh } = await useAsyncData('admin-cv', () => useRequestFetch()('/api/admin/cv'))

async function onSaved() {
  await refresh()
  await navigateTo('/admin/cv')
}
</script>

<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-primary-blue/10 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-gradient-to-tr from-primary-blue/15 to-primary/10 blur-2xl" aria-hidden="true" />

      <div class="relative flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin" class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-text-secondary transition-all hover:border-primary/50 hover:text-text hover:shadow-btn-glow" aria-label="Kembali">
            <ArrowLeft :size="18" :stroke-width="2" />
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow">
              <FileText :size="20" :stroke-width="2" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-text sm:text-2xl">Kelola CV</h2>
              <p class="mt-0.5 text-sm text-text-secondary">Perbarui data CV Anda secara lengkap</p>
            </div>
          </div>
        </div>
        <NuxtLink to="/cv" target="_blank" class="group btn-outline !px-5 !py-2.5">
          <ExternalLink :size="16" :stroke-width="2" class="transition-transform group-hover:rotate-12" />
          Lihat CV
        </NuxtLink>
      </div>
    </div>

    <AdminCvForm v-if="cv" :initial="cv" @saved="onSaved" />
  </div>
</template>

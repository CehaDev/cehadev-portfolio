<script setup lang="ts">
import { ArrowLeft, ExternalLink } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Kelola Skill'
})

const { data: skills, refresh } = await useAsyncData('admin-skills', () => useRequestFetch()('/api/admin/skills'))

async function onSaved() {
  await refresh()
  await navigateTo('/admin/skills')
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
          <h2 class="text-xl font-bold text-text">Kelola Skill</h2>
          <p class="mt-0.5 text-sm text-text-secondary">Data skill tersimpan di content/skills.json.</p>
        </div>
      </div>
      <NuxtLink to="/skills" target="_blank" class="btn-outline !px-4 !py-2.5">
        <ExternalLink :size="16" :stroke-width="2" />
        Lihat Skill
      </NuxtLink>
    </div>

    <AdminSkillsForm v-if="skills" :initial="skills" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, Sparkles } from 'lucide-vue-next'

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
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Sparkles :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Kelola Skill</h2>
            <p class="mt-1 text-sm text-text-secondary">Data skill tersimpan di content/skills.json. Atur skill beranda, teknis, ringkasan, dan perangkat.</p>
            <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-text-muted">
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Home: {{ skills?.homeSkills?.length ?? 0 }}</span>
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Teknis: {{ skills?.technicalSkills?.length ?? 0 }}</span>
              <span class="rounded-full border border-border bg-card px-2.5 py-1">Tools: {{ skills?.toolsList?.length ?? 0 }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/skills" target="_blank" class="btn-outline !py-2.5">
            <ExternalLink :size="16" :stroke-width="2" />
            Lihat Skill
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Buka halaman skill publik</span>
        </div>
      </div>
    </div>

    <AdminSkillsForm v-if="skills" :initial="skills" @saved="onSaved" />
  </div>
</template>

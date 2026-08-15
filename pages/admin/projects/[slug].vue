<script setup lang="ts">
import { ArrowLeft, Pencil } from 'lucide-vue-next'
import { lsId } from '~/utils/localize'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Edit Project'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: project } = await useAsyncData('admin-project-edit', () =>
  useRequestFetch()(`/api/admin/projects/${slug.value}`)
)

useHead({ title: `Edit ${lsId(project.value?.title) || slug.value} | Admin` })

async function onSaved(data: Record<string, unknown>) {
  const newSlug = String(data.slug)
  if (newSlug !== slug.value) await navigateTo(`/admin/projects/${newSlug}`, { replace: true })
  await navigateTo('/admin/projects')
}
</script>

<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Pencil :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Edit Project</h2>
            <p class="mt-1 text-sm text-text-secondary">{{ lsId(project?.title) || slug }}</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/admin/projects" class="btn-outline !py-2.5">
            <ArrowLeft :size="15" :stroke-width="2" />
            Kembali ke Daftar
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Kelola semua project</span>
        </div>
      </div>
    </div>
    <AdminProjectForm
      v-if="project"
      :initial="project"
      :endpoint="`/api/admin/projects/${slug}`"
      method="PUT"
      @saved="onSaved"
    />
  </div>
</template>

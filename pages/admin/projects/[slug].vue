<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

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

useHead({ title: `Edit ${project.value?.title ?? slug.value} | Admin` })

async function onSaved(data: Record<string, unknown>) {
  const newSlug = String(data.slug)
  if (newSlug !== slug.value) await navigateTo(`/admin/projects/${newSlug}`, { replace: true })
  await navigateTo('/admin/projects')
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/projects" class="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text" aria-label="Kembali">
        <ArrowLeft :size="16" :stroke-width="2" />
      </NuxtLink>
      <div>
        <h2 class="text-xl font-bold text-text">Edit Project</h2>
        <p class="mt-0.5 text-sm text-text-secondary">{{ project?.title ?? slug }}</p>
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

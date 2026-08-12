<script setup lang="ts">
import { ExternalLink, ArrowRight } from 'lucide-vue-next'

interface ProjectCardData {
  slug: string
  title: string
  year: string
  description: string
  tags: string[]
  category: string
  liveUrl: string
}

const props = defineProps<{ project: ProjectCardData }>()
</script>

<template>
  <article class="card group flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <NuxtLink :to="`/projects/${project.slug}`" class="block p-4">
      <ProjectThumb
        :seed="project.title.length + project.year.length"
        :label="project.category"
        height="h-44"
      />
    </NuxtLink>
    <div class="flex flex-1 flex-col gap-3 p-5 pt-2">
      <div class="flex items-start justify-between gap-3">
        <NuxtLink :to="`/projects/${project.slug}`" class="text-lg font-semibold text-text transition-colors hover:text-white">
          {{ project.title }}
        </NuxtLink>
        <a
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Lihat demo ${project.title}`"
          class="mt-0.5 shrink-0 text-text-muted transition-colors hover:text-primary"
        >
          <ExternalLink :size="18" :stroke-width="1.5" />
        </a>
      </div>
      <p class="text-sm leading-relaxed text-text-secondary">
        {{ project.description }}
      </p>
      <div class="mt-auto flex flex-wrap gap-2 pt-1">
        <TechBadge v-for="tag in project.tags.slice(0, 3)" :key="tag" :name="tag" />
      </div>
      <NuxtLink
        :to="`/projects/${project.slug}`"
        class="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      >
        View Project
        <ArrowRight :size="15" :stroke-width="2" class="transition-transform group-hover:translate-x-0.5" />
      </NuxtLink>
    </div>
  </article>
</template>

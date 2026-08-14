<script setup lang="ts">
import { ExternalLink, ArrowRight, Eye } from 'lucide-vue-next'

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

const { tiltRef, glareRef, onMove, onLeave } = useTilt(7)
const { viewsOf, formatCount } = useStats()
const { t } = useI18n()
</script>

<template>
  <article
    ref="tiltRef"
    class="card group relative flex flex-col overflow-hidden p-0 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <span
      ref="glareRef"
      class="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      aria-hidden="true"
    />
    <NuxtLink :to="`/projects/${project.slug}`" class="block p-4">
      <ProjectThumb
        :seed="project.title.length + project.year.length"
        :label="project.category"
        height="h-44"
      />
    </NuxtLink>
    <div class="flex flex-1 flex-col gap-3 p-5 pt-2">
      <div class="flex items-start justify-between gap-3">
        <NuxtLink :to="`/projects/${project.slug}`" class="text-lg font-semibold text-text transition-colors hover:text-primary">
          {{ project.title }}
        </NuxtLink>
        <a
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('projectCard.viewDemoAria', { title: project.title })"
          class="mt-0.5 shrink-0 text-text-muted transition-colors hover:text-primary"
        >
          <ExternalLink :size="18" :stroke-width="1.5" />
        </a>
      </div>
      <p class="text-sm leading-relaxed text-text-secondary">
        {{ project.description }}
      </p>
      <div class="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <TechBadge v-for="tag in project.tags.slice(0, 3)" :key="tag" :name="tag" />
        <span class="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-bg-alt px-2.5 py-1 text-[11px] font-medium text-text-muted">
          <Eye :size="12" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          {{ formatCount(viewsOf(project.slug)) }} {{ t('common.viewed') }}
        </span>
      </div>
      <NuxtLink
        :to="`/projects/${project.slug}`"
        class="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
      >
        {{ t('projectCard.viewProject') }}
        <ArrowRight :size="15" :stroke-width="2" class="transition-transform group-hover:translate-x-0.5" />
      </NuxtLink>
    </div>
  </article>
</template>

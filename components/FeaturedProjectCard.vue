<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

interface FeaturedProject {
  slug: string
  title: string
  tagline: string
  description: string
  tags: string[]
  category: string
  year: string
  liveUrl: string
}

const props = withDefaults(
  defineProps<{
    project: FeaturedProject
    index: number
    variant?: 'large' | 'small'
  }>(),
  { variant: 'small' }
)

const { tiltRef, glareRef, onMove, onLeave } = useTilt(6)
</script>

<template>
  <NuxtLink
    ref="tiltRef"
    :to="`/projects/${project.slug}`"
    class="group relative block h-full overflow-hidden rounded-card border border-border shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <span
      ref="glareRef"
      class="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      aria-hidden="true"
    />
    <ProjectThumb
      :seed="project.title.length + project.year.length"
      :label="project.category"
      :height="variant === 'large' ? 'h-80 md:h-full' : 'h-52'"
    />

    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />

    <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
      <div v-if="variant === 'large'" class="flex items-center gap-2 text-xs text-white/70">
        <span class="font-mono">0{{ index + 1 }}</span>
        <span class="h-1 w-1 rounded-full bg-white/50" aria-hidden="true" />
        <span>{{ project.year }}</span>
      </div>

      <h3 class="mt-2 text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-white md:text-3xl">
        {{ project.title }}
      </h3>
      <p class="mt-2 max-w-lg text-sm leading-relaxed text-white/75 line-clamp-2">
        {{ project.tagline }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="t in project.tags.slice(0, 3)"
          :key="t"
          class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
        >
          {{ t }}
        </span>
      </div>
    </div>

    <span
      class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-gradient-brand group-hover:shadow-btn-glow"
      aria-hidden="true"
    >
      <ArrowUpRight :size="18" :stroke-width="1.75" />
    </span>

    <span
      v-if="variant === 'large'"
      class="absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
    >
      Featured
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ArrowUpRight, CalendarDays, Eye, Folder, Star } from 'lucide-vue-next'

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
const { viewsOf, formatCount } = useStats()
const { t } = useI18n()

const isLarge = computed(() => props.variant === 'large')
const num = computed(() => String(props.index + 1).padStart(2, '0'))

function onPointer(e: MouseEvent) {
  const el = tiltRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  onMove(e)
}

function onOut() {
  const el = tiltRef.value
  el?.style.removeProperty('--mx')
  el?.style.removeProperty('--my')
  onLeave()
}
</script>

<template>
  <NuxtLink
    ref="tiltRef"
    :to="`/projects/${project.slug}`"
    class="featured-card group relative flex h-full overflow-hidden rounded-card border border-border bg-card shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
    @mousemove="onPointer"
    @mouseleave="onOut"
  >
    <span
      ref="glareRef"
      class="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      aria-hidden="true"
    />

    <!-- ============ LARGE / spotlight ============ -->
    <template v-if="isLarge">
      <div class="relative overflow-hidden">
        <div class="relative h-56 md:h-64">
          <ProjectThumb
            :seed="project.title.length + project.year.length"
            :label="project.category"
            height="h-full"
            class="!rounded-none !border-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />

          <span
            class="pointer-events-none absolute -bottom-8 -right-3 select-none font-mono text-[110px] font-extrabold leading-none text-white/15 transition-transform duration-700 group-hover:-translate-y-2"
            aria-hidden="true"
          >
            {{ num }}
          </span>

          <span
            class="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 font-mono text-xs font-semibold text-white backdrop-blur-sm"
          >
            <span class="text-primary-violet">{{ num }}</span>
            <span class="h-1 w-1 rounded-full bg-white/50" aria-hidden="true" />
            <span class="text-white/85">{{ project.year }}</span>
          </span>

          <span
            class="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1.5 text-[11px] font-bold text-white shadow-btn-glow"
          >
            <Star :size="12" :fill="'currentColor'" aria-hidden="true" />
            {{ t('projectCard.featured') }}
          </span>

          <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
            <span
              class="inline-flex translate-y-3 items-center gap-2 rounded-full bg-white/95 py-2.5 pl-4 pr-2.5 text-sm font-bold text-slate-900 opacity-0 shadow-2xl backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              {{ t('projectCard.viewProject') }}
              <span class="grid h-6 w-6 place-items-center rounded-full bg-gradient-brand text-white" aria-hidden="true">
                <ArrowUpRight :size="14" :stroke-width="2.5" />
              </span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text-secondary">
            <Folder :size="12" class="text-primary-violet" aria-hidden="true" />
            {{ project.category }}
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text-secondary">
            <CalendarDays :size="12" class="text-primary-violet" aria-hidden="true" />
            {{ project.year }}
          </span>
          <span v-if="project.liveUrl" class="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-success">
            <span class="relative flex h-2 w-2" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live
          </span>
        </div>

        <h3 class="text-2xl font-extrabold leading-tight tracking-tight text-text transition-colors group-hover:text-primary-blue md:text-[28px]">
          {{ project.title }}
        </h3>
        <p class="line-clamp-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          {{ project.tagline }}
        </p>

        <div class="mt-auto flex items-end justify-between gap-4 border-t border-border/70 pt-5">
          <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span
              v-for="tag in project.tags.slice(0, 3)"
              :key="tag"
              class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"
            >
              {{ tag }}
            </span>
          </div>
          <span class="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted">
            <Eye :size="14" class="text-primary-violet" aria-hidden="true" />
            {{ formatCount(viewsOf(project.slug)) }} {{ t('common.viewed') }}
          </span>
          <span
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-text-muted transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-btn-glow"
            aria-hidden="true"
          >
            <ArrowUpRight :size="19" :stroke-width="2" class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </template>

    <!-- ============ SMALL / compact row ============ -->
    <template v-else>
      <div class="flex h-full w-full">
        <div class="relative w-28 shrink-0 overflow-hidden sm:w-40">
          <ProjectThumb
            :seed="project.title.length + project.year.length * 2"
            :label="project.category"
            height="h-full"
            class="!rounded-none !border-0 transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span
            class="absolute bottom-3 left-4 select-none font-mono text-4xl font-extrabold leading-none text-white drop-shadow-lg"
            aria-hidden="true"
          >
            {{ num }}
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" aria-hidden="true" />
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <Folder :size="11" aria-hidden="true" />
              {{ project.category }}
            </span>
            <span class="text-[11px] font-medium text-text-muted">{{ project.year }}</span>
          </div>
          <h3 class="line-clamp-1 text-base font-extrabold leading-snug tracking-tight text-text transition-colors group-hover:text-primary-blue sm:text-lg">
            {{ project.title }}
          </h3>
          <p class="line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
            {{ project.tagline }}
          </p>
          <div class="mt-auto flex items-center justify-between gap-3 pt-1.5">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
              <Eye :size="13" class="text-primary-violet" aria-hidden="true" />
              {{ formatCount(viewsOf(project.slug)) }} {{ t('common.viewed') }}
            </span>
            <span
              class="grid h-9 w-9 place-items-center rounded-full border border-border text-text-muted transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-btn-glow"
              aria-hidden="true"
            >
              <ArrowUpRight :size="15" :stroke-width="2" class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </template>
  </NuxtLink>
</template>

<style scoped>
/* Border gradien yang mengikuti kursor (magnetic gradient border) */
.featured-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 30;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(
    220px circle at var(--mx, 50%) var(--my, 50%),
    rgba(139, 92, 246, 0.9),
    rgba(59, 130, 246, 0.45) 45%,
    transparent 70%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.featured-card:hover::after {
  opacity: 1;
}

@media (hover: none) {
  .featured-card::after {
    display: none;
  }
}
</style>
<script setup lang="ts">
import { findTechByName } from '~/composables/useSkills'

const props = withDefaults(
  defineProps<{
    name: string
    level: number
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' }
)

const tech = computed(() => findTechByName(props.name))
const width = ref(0)
const barEl = ref<HTMLElement | null>(null)

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  const node = barEl.value
  if (!node) return
  if (reduced()) {
    width.value = props.level
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()
      requestAnimationFrame(() => {
        width.value = props.level
      })
    },
    { threshold: 0.4 }
  )
  observer.observe(node)
})
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span
          class="flex items-center justify-center rounded-lg border border-border bg-bg"
          :class="size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'"
          :style="tech ? `color: ${tech.color}` : ''"
          aria-hidden="true"
        >
          <span v-if="tech" class="font-bold" :class="size === 'sm' ? 'text-[7px]' : 'text-[10px]'">{{ tech.glyph }}</span>
          <span v-else class="text-xs font-bold">•</span>
        </span>
        <span class="text-sm font-medium text-text">{{ name }}</span>
      </div>
      <span class="text-sm font-semibold text-text-secondary">{{ level }}%</span>
    </div>
    <div ref="barEl" class="h-2 w-full overflow-hidden rounded-full bg-bg" role="progressbar" :aria-valuenow="level" aria-valuemin="0" aria-valuemax="100" :aria-label="`${name}: ${level}%`">
      <div
        class="h-full rounded-full bg-gradient-brand transition-[width] duration-1000 ease-out"
        :style="{ width: width + '%' }"
      />
    </div>
  </div>
</template>

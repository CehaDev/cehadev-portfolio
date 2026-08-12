<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    delay?: number
    as?: string
  }>(),
  { delay: 0, as: 'div' }
)

const el = ref<HTMLElement | null>(null)
const visible = ref(false)

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (prefersReduced()) {
    visible.value = true
    return
  }
  const node = el.value
  if (!node) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer.disconnect()
        }
      })
    },
    { threshold: 0.12 }
  )
  observer.observe(node)
})
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="transition-all duration-700 ease-out"
    :class="[visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0']"
    :style="{ transitionDelay: delay + 'ms' }"
  >
    <slot />
  </component>
</template>

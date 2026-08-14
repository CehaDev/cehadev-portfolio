<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    delay?: number
    as?: string
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'none'
  }>(),
  { delay: 0, as: 'div', direction: 'up' }
)

const el = ref<HTMLElement | null>(null)
const visible = ref(false)

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const hiddenClass = computed(() => {
  switch (props.direction) {
    case 'none':
      return ''
    case 'down':
      return '-translate-y-6 opacity-0'
    case 'left':
      return 'translate-x-[-28px] opacity-0'
    case 'right':
      return 'translate-x-[28px] opacity-0'
    case 'scale':
      return 'scale-[0.93] opacity-0'
    case 'blur':
      return 'translate-y-2 scale-[1.01] opacity-0 blur-[8px]'
    default:
      return 'translate-y-4 opacity-0'
  }
})

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
    class="transition-all duration-700 ease-out will-change-transform"
    :class="[visible ? 'translate-x-0 translate-y-0 scale-100 blur-0 opacity-100' : hiddenClass]"
    :style="{ transitionDelay: delay + 'ms' }"
  >
    <slot />
  </component>
</template>

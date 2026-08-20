<script setup lang="ts">
const props = defineProps<{
  end: number
  suffix?: string
  duration?: number
}>()

const value = ref(0)
const el = ref<HTMLElement | null>(null)

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  const node = el.value
  if (!node) return
  if (reduced()) {
    value.value = props.end
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const dur = props.duration ?? 1200
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        value.value = Math.round(eased * props.end)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { threshold: 0.15 }
  )
  observer.observe(node)
})
</script>

<template>
  <span ref="el">{{ value }}{{ suffix ?? '' }}</span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    delay?: number
    duration?: number
    as?: string
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'none'
    parallax?: number
  }>(),
  { delay: 0, duration: 650, as: 'div', direction: 'up', parallax: 0 }
)

const el = ref<HTMLElement | null>(null)
const visible = ref(false)
const parallaxY = ref(0)

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const hiddenClass = computed(() => {
  switch (props.direction) {
    case 'none':
      return ''
    case 'down':
      return '-translate-y-5 opacity-0'
    case 'left':
      return 'translate-x-[-24px] opacity-0'
    case 'right':
      return 'translate-x-[24px] opacity-0'
    case 'scale':
      return 'scale-[0.96] opacity-0'
    case 'blur':
      return 'translate-y-2 scale-[1.01] opacity-0 blur-[6px]'
    default:
      return 'translate-y-6 opacity-0'
  }
})

onMounted(() => {
  if (prefersReduced()) {
    visible.value = true
    return
  }
  const node = el.value
  if (!node) return

  const show = () => { visible.value = true }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show()
          observer.disconnect()
          clearTimeout(fallbackTimer)
        }
      })
    },
    { threshold: 0.05, rootMargin: '0px 0px 120px 0px' }
  )
  observer.observe(node)

  const fallbackTimer = setTimeout(show, 1200) as unknown as ReturnType<typeof setTimeout>

  if (props.parallax !== 0) {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!node.isConnected) {
            window.removeEventListener('scroll', onScroll)
            return
          }
          const rect = node.getBoundingClientRect()
          const vh = window.innerHeight
          const center = rect.top + rect.height / 2
          const offset = (center - vh / 2) / vh
          parallaxY.value = offset * props.parallax * -1
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }
})
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="transition-all ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
    :class="[visible ? 'translate-x-0 translate-y-0 scale-100 blur-0 opacity-100' : hiddenClass]"
    :style="{
      transitionDuration: duration + 'ms',
      transitionDelay: delay + 'ms',
      transform: parallax !== 0 ? `translateY(${parallaxY}px)` : undefined
    }"
  >
    <slot />
  </component>
</template>

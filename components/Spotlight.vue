<script setup lang="ts">
const spot = ref<HTMLElement | null>(null)
let raf = 0
let tx = 0
let ty = 0
let cx = 0
let cy = 0

function onMove(e: PointerEvent) {
  tx = e.clientX
  ty = e.clientY
}

function loop() {
  cx += (tx - cx) * 0.14
  cy += (ty - cy) * 0.14
  if (spot.value) {
    spot.value.style.transform = `translate(${cx - 220}px, ${cy - 220}px)`
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  window.addEventListener('pointermove', onMove, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    ref="spot"
    class="pointer-events-none fixed left-0 top-0 -z-10 hidden h-[440px] w-[440px] rounded-full lg:block print:hidden"
    aria-hidden="true"
  >
    <div
      class="h-full w-full rounded-full"
      style="background: radial-gradient(circle, rgba(124, 58, 237, 0.09), rgba(59, 130, 246, 0.06) 40%, transparent 65%)"
    />
  </div>
</template>

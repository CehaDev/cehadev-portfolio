<script setup lang="ts">
const progress = ref(0)

function update() {
  const doc = document.documentElement
  const st = doc.scrollTop || document.body.scrollTop
  const sh = doc.scrollHeight - doc.clientHeight
  progress.value = sh > 0 ? st / sh : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div class="fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent print:hidden" aria-hidden="true">
    <div
      class="h-full rounded-r-full bg-gradient-brand transition-[width] duration-150 ease-out"
      :style="{ width: (progress * 100).toFixed(2) + '%' }"
    />
  </div>
</template>

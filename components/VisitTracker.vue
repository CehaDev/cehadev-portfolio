<script setup lang="ts">
const route = useRoute()

let reported = ''

onMounted(() => {
  const path = route.fullPath
  if (!path || path.startsWith('/admin') || reported === path) return
  reported = path

  let session = ''
  try {
    session = localStorage.getItem('cehadev-session') ?? ''
    if (!session) {
      session = crypto.randomUUID()
      localStorage.setItem('cehadev-session', session)
    }
  } catch {
    session = ''
  }

  const referrer = document.referrer
  $fetch('/api/track', {
    method: 'POST',
    body: { path, referrer, session },
    headers: { 'Content-Type': 'application/json' }
  }).catch(() => {})
})
</script>

<template>
  <div style="display: none" aria-hidden="true" />
</template>

<script setup lang="ts">
const { lang } = useLang()

useHead({ htmlAttrs: { lang: lang.value } })
</script>

<template>
  <div id="top" class="relative flex min-h-screen flex-col">
    <Spotlight />
    <ScrollProgress />
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <ChatWidget />
    <VisitTracker />
  </div>
</template>

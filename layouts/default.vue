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
  </div>
</template>

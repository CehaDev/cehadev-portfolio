<template>
  <div id="top" class="flex min-h-screen flex-col">
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <ChatWidget />
  </div>
</template>

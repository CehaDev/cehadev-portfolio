<script setup lang="ts">
import { ArrowUp, Heart } from 'lucide-vue-next'
</script>

<template>
  <footer class="mt-24 border-t border-border/60">
    <div class="container-site flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
      <p class="text-sm text-text-muted">© 2026 CehaDev. All rights reserved.</p>

      <p class="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Heart class="h-4 w-4 fill-red-500 text-red-500" aria-hidden="true" />
        Build. Learn. Break. Fix. Repeat.
      </p>

      <a
        href="#top"
        class="group flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-white"
      >
        Back to top
        <span class="flex items-center justify-center rounded-full border border-border p-2 transition-colors group-hover:border-primary/60">
          <ArrowUp :size="14" :stroke-width="2" />
        </span>
      </a>
    </div>
  </footer>
</template>

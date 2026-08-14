<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineProps<{
  title: string
  desc?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 py-8 text-center">
    <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
      <Inbox :size="18" :stroke-width="1.5" />
    </span>
    <p class="text-sm font-medium text-text-secondary">{{ title }}</p>
    <p v-if="desc" class="text-xs text-text-muted">{{ desc }}</p>
  </div>
</template>

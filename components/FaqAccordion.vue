<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

interface Faq {
  q: string
  a: string
}

const props = defineProps<{ faqs: Faq[] }>()

const open = ref<number | null>(0)

function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(f, i) in faqs"
      :key="i"
      class="overflow-hidden rounded-xl border transition-colors duration-300"
      :class="open === i ? 'border-primary/40 bg-card' : 'border-border bg-bg hover:border-primary/30'"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-text transition-colors hover:text-primary"
        :aria-expanded="open === i"
        :aria-controls="`faq-panel-${i}`"
        @click="toggle(i)"
      >
        <span class="leading-snug">{{ f.q }}</span>
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
          :class="open === i ? 'border-primary bg-primary text-white' : 'border-border text-text-secondary'"
          aria-hidden="true"
        >
          <ChevronDown :size="14" :class="open === i ? 'rotate-180' : ''" class="transition-transform duration-300" />
        </span>
      </button>
      <div
        :id="`faq-panel-${i}`"
        class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        :class="open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      >
        <div class="overflow-hidden">
          <p class="border-t border-border px-4 py-3.5 text-sm leading-relaxed text-text-secondary">{{ f.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

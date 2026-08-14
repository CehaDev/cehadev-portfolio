<script setup lang="ts">
import { ChevronDown, MessageCircleQuestion, ArrowRight } from 'lucide-vue-next'

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
  <div class="card p-6 md:p-8">
    <div class="flex items-start gap-3.5">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
        <MessageCircleQuestion :size="18" :stroke-width="1.5" />
      </span>
      <div>
        <h2 class="text-lg font-bold text-text">Frequently Asked Questions</h2>
        <p class="mt-0.5 text-sm text-text-secondary">Jawaban cepat untuk pertanyaan umum.</p>
      </div>
    </div>

    <div class="mt-5 space-y-3">
      <div
        v-for="(f, i) in faqs.slice(0, 3)"
        :key="i"
        class="overflow-hidden rounded-xl border transition-all duration-300"
        :class="open === i ? 'border-primary/40 bg-card' : 'border-border bg-bg hover:border-primary/30'"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-text transition-colors hover:text-primary"
          :aria-expanded="open === i"
          :aria-controls="`faq-panel-${i}`"
          @click="toggle(i)"
        >
          {{ f.q }}
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200"
            :class="open === i ? 'border-primary bg-primary text-white' : 'border-border text-text-secondary'"
            aria-hidden="true"
          >
            <ChevronDown :size="14" :class="open === i ? 'rotate-180' : ''" class="transition-transform duration-200" />
          </span>
        </button>
        <div v-if="open === i" :id="`faq-panel-${i}`" class="border-t border-border px-4 py-3.5 text-sm leading-relaxed text-text-secondary">
          {{ f.a }}
        </div>
      </div>
    </div>

    <NuxtLink to="/contact#faq" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
      View more FAQs
      <ArrowRight :size="15" :stroke-width="2" />
    </NuxtLink>
  </div>
</template>

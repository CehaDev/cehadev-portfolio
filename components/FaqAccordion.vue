<script setup lang="ts">
import { ChevronDown, MessageCircleQuestion, ArrowRight } from 'lucide-vue-next'

const faqs = [
  {
    q: 'Apakah Anda menerima project freelance?',
    a: 'Ya, saya terbuka untuk project freelance dan kolaborasi. Waktu respons biasanya cepat — silakan kirim detail kebutuhan Anda melalui form kontak.'
  },
  {
    q: 'Teknologi apa yang Anda kuasai?',
    a: 'Saya fokus pada ekosistem JavaScript: Nuxt.js, Vue.js, Node.js, dan Tailwind CSS. Saya juga terbiasa dengan berbagai tools seperti Docker, Git, dan CI/CD.'
  },
  {
    q: 'Bagaimana proses kerja sama berlangsung?',
    a: 'Prosesnya dimulai dari diskusi kebutuhan, estimasi, perencanaan, pengembangan, hingga testing dan deployment. Saya menjaga komunikasi yang jelas di setiap tahap.'
  },
  {
    q: 'Berapa lama waktu pengerjaan project?',
    a: 'Tergantung kompleksitas. Website landing biasanya 1–2 minggu, aplikasi web menengah 1–3 bulan. Estimasi detail diberikan setelah diskusi kebutuhan.'
  }
]

const open = ref<number | null>(0)

function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <div class="card p-6 md:p-7">
    <h2 class="flex items-center gap-2.5 text-lg font-bold text-text">
      <MessageCircleQuestion :size="20" :stroke-width="1.5" class="text-primary" aria-hidden="true" />
      Frequently Asked Questions
    </h2>

    <div class="mt-5 space-y-3">
      <div
        v-for="(f, i) in faqs.slice(0, 3)"
        :key="i"
        class="overflow-hidden rounded-lg border transition-colors"
        :class="open === i ? 'border-primary/40' : 'border-border'"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-text transition-colors hover:text-white"
          :aria-expanded="open === i"
          :aria-controls="`faq-panel-${i}`"
          @click="toggle(i)"
        >
          {{ f.q }}
          <ChevronDown
            :size="16"
            class="shrink-0 text-primary transition-transform duration-200"
            :class="open === i ? 'rotate-180' : ''"
            aria-hidden="true"
          />
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

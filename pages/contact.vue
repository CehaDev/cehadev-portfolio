<script setup lang="ts">
import { Mail, Phone, MapPin, CircleDot, Zap, Briefcase, Sparkles, Copy, Check, MessageCircle, Phone as PhoneIcon } from 'lucide-vue-next'

useSeoMeta({
  title: 'Contact | CehaDev',
  description: 'Hubungi CehaDev untuk kolaborasi, project freelance, atau sekadar menyapa. Respons cepat dan terbuka untuk peluang kerja sama.'
})

const { data: site } = await useSiteSettings()

const valueProps = [
  { icon: Zap, title: 'Fast Response', desc: 'Saya membalas pesan dalam 1–2 jam kerja.' },
  { icon: Briefcase, title: 'Open to Opportunities', desc: 'Terbuka untuk freelance, kolaborasi, dan full-time.' },
  { icon: Sparkles, title: "Let's Build Something", desc: 'Mari wujudkan ide Anda menjadi produk nyata.' }
]

const contacts = computed(() => [
  { icon: Mail, label: 'Email', value: site.value?.email ?? '', copy: true },
  { icon: Phone, label: 'Phone', value: site.value?.phone ?? '', copy: true },
  { icon: MapPin, label: 'Location', value: site.value?.location ?? '', copy: true }
])

const copied = ref(false)

async function copyValue(v: string) {
  try {
    await navigator.clipboard.writeText(v)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    /* clipboard tidak tersedia */
  }
}

const floatIcons = [
  { icon: Mail, color: '#8B5CF6', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
  { icon: MessageCircle, color: '#22C55E', pos: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' },
  { icon: PhoneIcon, color: '#3B82F6', pos: 'bottom-2 left-4' }
]
</script>

<template>
  <div class="container-site py-16 md:py-20">
    <!-- HERO -->
    <section class="grid items-center gap-12 lg:grid-cols-[55fr_45fr]">
      <Reveal>
        <span class="section-label"><span class="dot" aria-hidden="true" /> Let's work together</span>
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          Get In <span class="bg-gradient-brand bg-clip-text text-transparent">Touch</span>
        </h1>
        <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Ada pertanyaan, ide, atau project yang ingin dikerjakan? Jangan ragu untuk menghubungi saya. Saya selalu senang berdiskusi tentang teknologi dan peluang baru.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div v-for="v in valueProps" :key="v.title" class="rounded-card border border-border bg-card p-4">
            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary" aria-hidden="true">
              <component :is="v.icon" :size="17" :stroke-width="1.5" />
            </span>
            <h3 class="mt-3 text-sm font-semibold text-text">{{ v.title }}</h3>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ v.desc }}</p>
          </div>
        </div>
      </Reveal>

      <Reveal class="relative mx-auto" :delay="100">
        <AvatarIllustration :size="250" variant="code" />
        <div
          v-for="(f, i) in floatIcons"
          :key="i"
          class="absolute flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-card animate-float"
          :class="f.pos"
          :style="{ color: f.color, animationDelay: i * 0.7 + 's' }"
          role="img"
          :aria-label="'Ikon kontak'"
        >
          <component :is="f.icon" :size="20" :stroke-width="1.5" />
        </div>
        <div
          class="absolute inset-0 -z-10 grid gap-3 opacity-40"
          style="grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr)"
          aria-hidden="true"
        >
          <span v-for="n in 9" :key="n" class="h-2 w-2 rounded-sm bg-primary/50" :style="{ alignSelf: (n % 3) * 2 + 'px' }" />
        </div>
      </Reveal>
    </section>

    <!-- 3 KOLOM -->
    <section class="mt-14 grid items-start gap-6 lg:grid-cols-3">
      <Reveal>
        <ContactForm />
      </Reveal>

      <Reveal class="space-y-6" :delay="100">
        <div class="card p-6 md:p-7">
          <h2 class="text-lg font-bold text-text">Contact Information</h2>
          <ul class="mt-5 space-y-4">
            <li v-for="c in contacts" :key="c.label" class="flex items-center gap-3.5">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">
                <component :is="c.icon" :size="18" :stroke-width="1.5" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-text-muted">{{ c.label }}</p>
                <p class="truncate text-sm font-medium text-text">{{ c.value }}</p>
              </div>
              <button
                type="button"
                class="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-text"
                :aria-label="`Salin ${c.label}`"
                @click="copyValue(c.value)"
              >
                <span v-if="copied" class="flex items-center gap-1 text-success"><Check :size="12" />Copied</span>
                <span v-else>Copy</span>
              </button>
            </li>
            <li class="flex items-center gap-3.5">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success" aria-hidden="true">
                <CircleDot :size="18" :stroke-width="1.5" />
              </span>
              <div class="flex-1">
                <p class="text-xs text-text-muted">Availability</p>
                <p class="text-sm font-medium text-success">Online</p>
              </div>
              <span class="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
            </li>
          </ul>
        </div>
        <FaqAccordion :faqs="site?.faqs ?? []" />
      </Reveal>

      <Reveal :delay="200">
        <DarkMap :location="site?.location ?? 'Jakarta, Indonesia'" />
      </Reveal>
    </section>
  </div>
</template>

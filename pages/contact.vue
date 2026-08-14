<script setup lang="ts">
import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from 'lucide-vue-next'

useSeoMeta({
  title: 'Contact | CehaDev',
  description: 'Hubungi CehaDev untuk kolaborasi, project freelance, atau sekadar menyapa. Respons cepat dan terbuka untuk peluang kerja sama.'
})

const { data: site } = await useSiteSettings()

const contacts = computed(() => [
  { icon: Mail, label: 'Email', value: site.value?.email ?? '', href: `mailto:${site.value?.email ?? ''}` },
  { icon: Phone, label: 'Phone', value: site.value?.phone ?? '', href: `tel:${(site.value?.phone ?? '').replace(/[^+\d]/g, '')}` },
  { icon: MapPin, label: 'Location', value: site.value?.location ?? '', href: `https://maps.google.com/?q=${encodeURIComponent(site.value?.location ?? '')}` }
])

const socials = computed(() => {
  const s = site.value?.socials ?? { github: '', linkedin: '', instagram: '' }
  return [
    { label: 'GitHub', icon: Github, href: s.github || '#' },
    { label: 'LinkedIn', icon: Linkedin, href: s.linkedin || '#' },
    { label: 'Instagram', icon: Instagram, href: s.instagram || '#' }
  ]
})
</script>

<template>
  <div class="container-site py-16 md:py-24">
    <!-- HERO -->
    <section class="mx-auto max-w-2xl text-center">
      <Reveal>
        <span class="section-label"><span class="dot" aria-hidden="true" /> Let's work together</span>
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          Get In <span class="bg-gradient-brand bg-clip-text text-transparent">Touch</span>
        </h1>
        <p class="mt-4 text-[15px] leading-relaxed text-text-secondary">
          Ada pertanyaan, ide, atau project yang ingin dikerjakan? Saya selalu senang berdiskusi tentang teknologi dan peluang baru.
        </p>

        <span class="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5 text-xs font-medium text-success">
          <span class="relative flex h-2 w-2" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Available for new projects
        </span>

        <div class="mt-6 flex items-center justify-center gap-3">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-gradient-brand hover:text-white hover:shadow-btn-glow"
            :aria-label="s.label"
          >
            <component :is="s.icon" :size="17" :stroke-width="1.5" />
          </a>
        </div>
      </Reveal>
    </section>

    <!-- INFO TILES -->
    <section class="mt-14">
      <Reveal class="grid gap-6 sm:grid-cols-3">
        <a
          v-for="c in contacts"
          :key="c.label"
          :href="c.href"
          :target="c.href.startsWith('http') ? '_blank' : null"
          :rel="c.href.startsWith('http') ? 'noopener noreferrer' : null"
          class="group card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
        >
          <span
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-all duration-300 group-hover:bg-gradient-brand group-hover:text-white group-hover:shadow-btn-glow"
            aria-hidden="true"
          >
            <component :is="c.icon" :size="20" :stroke-width="1.5" />
          </span>
          <p class="mt-4 text-[11px] font-medium uppercase tracking-wider text-text-muted">{{ c.label }}</p>
          <p class="mt-1 truncate text-sm font-semibold text-text transition-colors group-hover:text-primary">{{ c.value }}</p>
        </a>
      </Reveal>
    </section>

    <!-- FORM + MAP -->
    <section class="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
      <Reveal class="h-full">
        <ContactForm class="h-full" />
      </Reveal>
      <Reveal class="h-full" :delay="100">
        <DarkMap class="h-full" :location="site?.location ?? 'Wirosari, Grobogan, Jawa Tengah'" />
      </Reveal>
    </section>

    <!-- FAQ -->
    <section class="mt-6">
      <Reveal class="mx-auto max-w-3xl">
        <FaqAccordion :faqs="site?.faqs ?? []" />
      </Reveal>
    </section>
  </div>
</template>

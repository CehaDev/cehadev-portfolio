<script setup lang="ts">
import { ArrowRight, Mail, ArrowUpRight, Github, Linkedin, Instagram, Sparkles, ArrowDown } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

useSeoMeta({
  title: 'CehaDev — Web Developer Portfolio',
  description: 'Portfolio CehaDev, Web Developer & Tech Enthusiast berbasis di Jakarta. Membangun produk digital modern dengan Nuxt.js, Vue.js, dan Tailwind CSS.'
})

const { data: site } = await useSiteSettings()
const { data: skills } = await useSkillsContent()
const { data: projects } = await useProjectsContent()

const featuredProjects = computed(() => {
  const list = projects.value ?? []
  const featured = list.filter((p) => p.featured)
  return featured.length >= 3 ? featured : list.slice(0, 3)
})

const marqueeTech = computed(() => {
  const list = skills.value?.marqueeTech
  return list?.length ? list : ['JavaScript', 'Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Node.js', 'Git & GitHub']
})

const heroStats = computed(() => site.value?.stats?.slice(0, 4) ?? [])

function techFor(name: string) {
  return techIcons[name.toLowerCase().replace('&', '').trim()]
}

const socials = computed(() => {
  const s = site.value?.socials ?? {}
  return [
    { label: 'GitHub', icon: Github, href: s.github ?? 'https://github.com' },
    { label: 'LinkedIn', icon: Linkedin, href: s.linkedin ?? 'https://linkedin.com' },
    { label: 'Instagram', icon: Instagram, href: s.instagram ?? 'https://instagram.com' },
    { label: 'Mail', icon: Mail, href: `mailto:${site.value?.email ?? ''}` }
  ]
})
</script>

<template>
  <div class="overflow-hidden">
    <!-- HERO -->
    <section class="relative flex min-h-[calc(100vh-76px)] flex-col justify-center">
      <div
        class="pointer-events-none absolute inset-0 -z-10"
        style="
          background-image:
            radial-gradient(circle at 18% 28%, rgba(124, 58, 237, 0.14), transparent 48%),
            radial-gradient(circle at 84% 62%, rgba(59, 130, 246, 0.12), transparent 44%);
        "
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern"
        style="mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)"
        aria-hidden="true"
      />

      <div class="container-site flex flex-col items-center gap-14 py-16 lg:flex-row lg:gap-20">
        <Reveal class="max-w-2xl text-center lg:flex-1 lg:text-left">
          <span class="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-text-secondary shadow-card">
            <span class="relative flex h-2 w-2" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {{ site?.heroBadge }}
          </span>

          <h1 class="mt-7 text-[52px] font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-[84px]">
            {{ site?.heroTitle1 }}
            <br />
            <span class="bg-gradient-brand bg-clip-text text-transparent">{{ site?.heroTitleGradient }}</span>
          </h1>

          <div class="mt-5 flex items-center justify-center gap-4 lg:justify-start">
            <span class="h-px w-10 bg-gradient-brand" aria-hidden="true" />
            <p class="text-xl font-semibold text-text-secondary md:text-2xl">{{ site?.heroSubtitle }}</p>
          </div>
          <p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary lg:mx-0">
            {{ site?.heroDescription }}
          </p>

          <div class="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <NuxtLink to="/projects" class="btn-primary">
              View My Work
              <ArrowRight :size="17" :stroke-width="2" />
            </NuxtLink>
            <NuxtLink to="/contact" class="btn-outline">
              <Mail :size="17" :stroke-width="1.75" />
              Contact Me
            </NuxtLink>
          </div>

          <div class="mt-10 flex items-center justify-center gap-3 lg:justify-start">
            <span class="h-px w-10 bg-border" aria-hidden="true" />
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-btn-glow"
              :aria-label="s.label"
            >
              <component :is="s.icon" :size="17" :stroke-width="1.5" />
            </a>
          </div>
        </Reveal>

        <Reveal class="relative mx-auto" :delay="120">
          <div class="relative flex items-center justify-center">
            <span
              class="animate-spin-slow absolute h-[360px] w-[360px] rounded-full border border-dashed border-primary/25"
              aria-hidden="true"
            />
            <span
              class="absolute h-[310px] w-[310px] rounded-full border border-primary/15"
              aria-hidden="true"
            />
            <div class="absolute h-[380px] w-[380px] rounded-full bg-glow-circle blur-3xl" aria-hidden="true" />
            <div class="relative rounded-full p-1.5" style="background: linear-gradient(135deg, #8B5CF6, #3B82F6)">
              <div class="rounded-full bg-bg p-2">
                <AvatarIllustration :size="280" variant="laptop" />
              </div>
            </div>

            <div class="absolute -right-2 top-6 flex items-center gap-2.5 rounded-card border border-border bg-card/90 px-4 py-3 shadow-card backdrop-blur md:-right-10">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white" aria-hidden="true">
                <Sparkles :size="16" :stroke-width="1.75" />
              </span>
              <div class="leading-tight">
                <p class="text-xs font-semibold text-text">Open to work</p>
                <p class="text-[11px] text-text-muted">Let's build something great</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div class="container-site pb-8">
        <Reveal class="card border-border/60 bg-card/70 px-8 py-6 backdrop-blur" :delay="200">
          <dl class="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div v-for="s in heroStats" :key="s.label" class="text-center sm:text-left">
              <dd class="text-2xl font-extrabold text-text md:text-3xl">
                <CountUp :end="s.end" :suffix="s.suffix ?? ''" />
              </dd>
              <dt class="mt-1 text-xs font-semibold uppercase tracking-wider text-text-muted">{{ s.label }}</dt>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>

    <!-- TECH MARQUEE -->
    <section class="border-y border-border/60 bg-bg-alt/60 py-6" aria-label="Teknologi yang dikuasai">
      <div class="marquee-container">
        <div class="marquee-track">
          <div v-for="n in 2" :key="n" class="marquee-group">
            <span
              v-for="name in marqueeTech"
              :key="`${n}-${name}`"
              class="marquee-item"
            >
              <span
                class="marquee-glyph"
                :style="{
                  color: techFor(name)?.color ?? '#8B5CF6',
                  backgroundColor: (techFor(name)?.color ?? '#8B5CF6') + '1F'
                }"
                aria-hidden="true"
              >
                {{ techFor(name)?.glyph ?? name.slice(0, 2).toUpperCase() }}
              </span>
              <span class="marquee-name">{{ techFor(name)?.name ?? name }}</span>
              <span class="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="container-site py-20 md:py-24">
      <Reveal class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span class="section-label"><span class="dot" aria-hidden="true" /> Featured Work</span>
          <h2 class="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Selected <span class="bg-gradient-brand bg-clip-text text-transparent">Projects</span>
          </h2>
          <p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            Beberapa project yang saya bangun dengan fokus pada kualitas, performa, dan pengalaman pengguna.
          </p>
        </div>
        <NuxtLink
          to="/projects"
          class="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-violet"
        >
          View All Projects
          <ArrowUpRight :size="17" :stroke-width="2" class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </NuxtLink>
      </Reveal>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(p, i) in featuredProjects" :key="p.slug" :delay="(i % 3) * 80">
          <ProjectCard :project="p" />
        </Reveal>
      </div>
    </section>

    <!-- CTA -->
    <section class="container-site pb-24">
      <Reveal class="relative overflow-hidden rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-blue/10 px-8 py-16 text-center md:px-16 md:py-20">
        <div class="absolute inset-0 bg-glow-circle opacity-40" style="mask-image: linear-gradient(to bottom, black, transparent)" aria-hidden="true" />
        <div class="relative">
          <h2 class="text-3xl font-extrabold tracking-tight text-text md:text-4xl">
            Have an idea? <span class="bg-gradient-brand bg-clip-text text-transparent">Let's build it together.</span>
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            Saya selalu terbuka untuk kolaborasi, project freelance, atau sekadar diskusi seputar teknologi.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <NuxtLink to="/contact" class="btn-primary">Start a Project</NuxtLink>
            <NuxtLink to="/cv" class="btn-outline">Download CV</NuxtLink>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgb(var(--color-border) / 0.4) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--color-border) / 0.4) 1px, transparent 1px);
  background-size: 56px 56px;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 28s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow {
    animation: none;
  }
}

.marquee-container {
  @apply relative overflow-hidden;
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}

.marquee-track {
  @apply flex w-max;
  animation: marquee 30s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

.marquee-group {
  @apply flex items-center;
}

.marquee-item {
  @apply flex items-center gap-3 px-8 text-sm font-medium text-text-secondary;
}

.marquee-glyph {
  @apply flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-[10px] font-bold;
}

.marquee-name {
  @apply whitespace-nowrap;
}

/* Warna ikon menyesuaikan mode terang agar tetap kontras */
html:not(.dark) .marquee-glyph {
  filter: brightness(0.62) saturate(1.05);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>

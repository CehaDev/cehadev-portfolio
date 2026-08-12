<script setup lang="ts">
import { ArrowRight, Mail, Rocket, ExternalLink, Github, Linkedin, Instagram } from 'lucide-vue-next'

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

const socials = computed(() => {
  const s = site.value?.socials ?? {}
  return [
    { label: 'GitHub', icon: Github, href: s.github ?? 'https://github.com' },
    { label: 'LinkedIn', icon: Linkedin, href: s.linkedin ?? 'https://linkedin.com' },
    { label: 'Instagram', icon: Instagram, href: s.instagram ?? 'https://instagram.com' },
    { label: 'Mail', icon: Mail, href: `mailto:${site.value?.email ?? ''}` }
  ]
})

const decoDots = [
  { top: '8%', left: '12%', size: 5, color: '#8B5CF6' },
  { top: '18%', right: '10%', size: 4, color: '#3B82F6' },
  { bottom: '16%', left: '6%', size: 6, color: '#22C55E' },
  { top: '40%', right: '2%', size: 3, color: '#F59E0B' },
  { top: '4%', right: '24%', size: 3, color: '#8B5CF6' },
  { bottom: '6%', right: '16%', size: 4, color: '#3B82F6' }
]
</script>

<template>
  <div class="overflow-hidden">
    <!-- HERO -->
    <section class="container-site grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[55fr_45fr]">
      <Reveal class="order-2 lg:order-1">
        <span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-text-secondary">
          <span class="relative flex h-2 w-2" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {{ site?.heroBadge }}
        </span>

        <h1 class="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight md:text-[52px]">
          {{ site?.heroTitle1 }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ site?.heroTitleGradient }}</span>
        </h1>
        <p class="mt-3 text-lg font-semibold text-text-secondary md:text-xl">{{ site?.heroSubtitle }}</p>
        <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {{ site?.heroDescription }}
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink to="/projects" class="btn-primary">
            View My Work
            <ArrowRight :size="17" :stroke-width="2" />
          </NuxtLink>
          <NuxtLink to="/contact" class="btn-outline">
            <Mail :size="17" :stroke-width="1.75" />
            Contact Me
          </NuxtLink>
        </div>
      </Reveal>

      <Reveal class="relative mx-auto order-1 lg:order-2" :delay="100">
        <div
          v-for="(d, i) in decoDots"
          :key="i"
          class="absolute rounded-full animate-float"
          :style="{
            top: d.top, bottom: d.bottom, left: d.left, right: d.right,
            width: d.size + 'px', height: d.size + 'px', backgroundColor: d.color,
            animationDelay: (i * 0.6) + 's'
          }"
          aria-hidden="true"
        />
        <AvatarIllustration :size="290" variant="laptop" />

        <div class="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-card border border-border bg-card p-4 shadow-card md:-left-12">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white" aria-hidden="true">
            <Rocket :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <p class="text-sm font-semibold text-text">Building ideas</p>
            <p class="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
              <span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Turning ideas into digital products
            </p>
          </div>
        </div>
      </Reveal>
    </section>

    <!-- CONTENT 3 KOLOM -->
    <section class="container-site grid gap-6 pb-8 lg:grid-cols-3">
      <!-- Kolom 1: About Me -->
      <Reveal class="card flex flex-col p-6">
        <div class="flex items-center justify-between">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> About Me</h2>
        </div>
        <p class="mt-4 text-[15px] leading-relaxed text-text-secondary">
          {{ site?.aboutIntro?.[0] ?? 'Web developer yang antusias membangun aplikasi modern.' }}
        </p>
        <NuxtLink to="/about" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-violet">
          More About Me
          <ArrowRight :size="15" :stroke-width="2" />
        </NuxtLink>

        <div class="mt-6 border-t border-border/60 pt-6">
          <p class="text-xs font-semibold uppercase tracking-wider text-text-muted">Connect With Me</p>
          <div class="mt-4 flex gap-3">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:scale-105 hover:border-primary/60 hover:text-text"
              :aria-label="s.label"
            >
              <component :is="s.icon" :size="18" :stroke-width="1.5" />
            </a>
          </div>
        </div>
      </Reveal>

      <!-- Kolom 2: Skills -->
      <Reveal class="card p-6" :delay="100">
        <h2 class="section-label"><span class="dot" aria-hidden="true" /> Skills</h2>
        <div class="mt-5 space-y-5">
          <ProgressBar v-for="s in skills?.homeSkills ?? []" :key="s.name" :name="s.name" :level="s.level" size="sm" />
        </div>
      </Reveal>

      <!-- Kolom 3: Projects -->
      <Reveal class="card p-6" :delay="200">
        <div class="flex items-center justify-between">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Projects</h2>
          <NuxtLink to="/projects" class="text-xs font-semibold text-primary hover:text-primary-violet">
            View All Projects →
          </NuxtLink>
        </div>
        <div class="mt-5 space-y-5">
          <div
            v-for="p in featuredProjects"
            :key="p.slug"
            class="group flex gap-4 rounded-card border border-border bg-bg p-3 transition-all hover:border-primary/50 hover:shadow-card"
          >
            <NuxtLink :to="`/projects/${p.slug}`" class="shrink-0">
              <ProjectThumb :seed="p.title.length" :label="p.category" height="h-20 w-20" />
            </NuxtLink>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <NuxtLink :to="`/projects/${p.slug}`" class="truncate text-sm font-semibold text-text hover:text-primary">
                  {{ p.title }}
                </NuxtLink>
                <a :href="p.liveUrl" target="_blank" rel="noopener noreferrer" :aria-label="`Lihat demo ${p.title}`" class="text-text-muted hover:text-primary">
                  <ExternalLink :size="14" :stroke-width="1.5" />
                </a>
              </div>
              <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">{{ p.description }}</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span v-for="tag in p.tags.slice(0, 3)" :key="tag" class="rounded-md bg-bg-alt px-2 py-0.5 text-[10px] font-medium text-text-muted">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
</template>

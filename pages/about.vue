<script setup lang="ts">
import { Quote, MapPin, Mail, Phone, Globe, CheckCircle2, Code2, Clock, FolderGit2, Target, Download } from 'lucide-vue-next'
import { findTechByName } from '~/composables/useSkills'

useSeoMeta({
  title: 'About | CehaDev',
  description: 'Kenali lebih dekat CehaDev — Web Developer yang berfokus pada Nuxt.js, Vue.js, dan Node.js.'
})

const { data: site } = await useSiteSettings()

const statIcons = {
  Clock,
  FolderGit2,
  Code2,
  Target
}

const facts = computed(() => [
  { icon: MapPin, label: 'Lokasi', value: site.value?.location },
  { icon: Mail, label: 'Email', value: site.value?.email },
  { icon: Globe, label: 'Website', value: site.value?.website },
  { icon: Phone, label: 'Telepon', value: site.value?.phone }
])

const stackNames = ['JavaScript', 'Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Node.js', 'TypeScript', 'Git & GitHub', 'Linux']

const stackCategories: Record<string, string> = {
  'JavaScript': 'Language',
  'TypeScript': 'Language',
  'Vue.js': 'Framework',
  'Nuxt.js': 'Framework',
  'Node.js': 'Runtime',
  'Tailwind CSS': 'Styling',
  'Git & GitHub': 'Tooling',
  'Linux': 'OS'
}

const stats = computed(() => {
  const list = site.value?.stats ?? []
  if (!list.length) return []
  const hours = list.find((s) => s.label === 'Hours')
  const rest = list.filter((s) => s.label !== 'Hours')
  return [hours, ...rest].filter(Boolean) as NonNullable<typeof hours>[]
})

function techColor(name: string) {
  return findTechByName(name)?.color ?? '#8B5CF6'
}

function statIcon(icon: string) {
  return statIcons[icon as keyof typeof statIcons]
}
</script>

<template>
  <div class="overflow-hidden">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 -z-10"
        style="
          background-image:
            radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.12), transparent 50%),
            radial-gradient(circle at 85% 60%, rgba(59, 130, 246, 0.1), transparent 42%);
        "
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern"
        style="mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)"
        aria-hidden="true"
      />

      <div class="container-site py-16 text-center md:py-24">
        <Reveal>
          <div class="relative mx-auto flex justify-center">
            <AvatarIllustration :size="180" variant="code" />

            <div class="animate-float absolute bottom-4 -left-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:left-10">
              <p class="font-mono text-base font-bold text-text">2<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">yrs</span></p>
            </div>

            <div class="animate-float absolute right-0 top-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:right-10" style="animation-delay: 0.8s">
              <p class="font-mono text-base font-bold text-text">10<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">projects</span></p>
            </div>
          </div>

          <span class="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card">
            <span class="relative flex h-2 w-2" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {{ site?.heroBadge }} · {{ site?.location }}
          </span>

          <h1 class="mt-6 text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
          </h1>

          <p class="mt-4 text-lg font-semibold text-text-secondary md:text-xl">{{ site?.role }}</p>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a :href="site?.cvUrl ? `${site.cvUrl}?download=1` : '/cv?download=1'" class="btn-primary">
              <Download :size="16" :stroke-width="2" />
              Download CV
            </a>
            <NuxtLink to="/contact" class="btn-outline">
              <Mail :size="16" :stroke-width="1.75" />
              Let's Talk
            </NuxtLink>
          </div>
        </Reveal>
      </div>

      <!-- STATS -->
      <div class="container-site pb-16">
        <Reveal class="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border/60 lg:grid-cols-4">
          <div
            v-for="s in stats"
            :key="s.label"
            class="flex flex-col items-center justify-center gap-1.5 bg-card p-6 text-center"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <component :is="statIcon(s.icon)" :size="20" :stroke-width="1.5" />
            </span>
            <dd class="font-mono text-2xl font-extrabold tracking-tight text-text">
              <CountUp :end="s.end" :suffix="s.suffix ?? ''" />
            </dd>
            <dt class="text-xs font-medium text-text-secondary">{{ s.label }} <span class="text-text-muted">· {{ s.sub }}</span></dt>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- 01 · TENTANG SAYA -->
    <section class="container-site pb-20">
      <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">01 · Tentang Saya</p>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text md:text-4xl">
              Why I love <span class="bg-gradient-brand bg-clip-text text-transparent">building for the web</span>
            </h2>
          </Reveal>

          <Reveal class="mt-6 space-y-4 text-[15px] leading-relaxed text-text-secondary">
            <p v-for="(para, i) in site?.aboutIntro ?? []" :key="i">{{ para }}</p>
          </Reveal>

          <ul class="mt-8 space-y-3">
            <Reveal
              v-for="item in site?.aboutChecklist ?? []"
              :key="item"
              class="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40"
            >
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/25"
                aria-hidden="true"
              >
                <CheckCircle2 :size="16" :stroke-width="2" />
              </span>
              <p class="text-sm leading-relaxed text-text-secondary">{{ item }}</p>
            </Reveal>
          </ul>
        </div>

        <Reveal class="lg:sticky lg:top-24">
          <div class="card overflow-hidden">
            <div class="relative flex flex-col items-center px-6 pb-6 pt-9 text-center">
              <div
                class="pointer-events-none absolute -top-14 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
                aria-hidden="true"
              />
              <AvatarIllustration :size="116" variant="code" class="relative" />
              <h3 class="mt-4 text-xl font-extrabold text-text">{{ site?.name }}</h3>
              <p class="mt-1 text-sm text-text-secondary">{{ site?.role }}</p>
              <span
                class="mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-medium text-success"
              >
                <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                {{ site?.heroBadge }}
              </span>
            </div>

            <div class="border-t border-border bg-bg/60 px-5 py-3">
              <div
                v-for="f in facts"
                :key="f.label"
                class="flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-card"
              >
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                  <component :is="f.icon" :size="18" :stroke-width="1.5" />
                </span>
                <div class="min-w-0">
                  <p class="text-xs text-text-muted">{{ f.label }}</p>
                  <p class="truncate text-sm font-semibold text-text">{{ f.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- QUOTE -->
    <section class="container-site pb-20">
      <Reveal class="mx-auto max-w-3xl text-center">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
          <Quote :size="22" :stroke-width="1.5" />
        </span>
        <blockquote class="mt-6 text-2xl font-bold leading-snug tracking-tight text-text md:text-3xl">
          {{ site?.quote }}
          <span class="bg-gradient-brand bg-clip-text text-transparent">{{ site?.quoteHighlight }}</span>
        </blockquote>
        <p class="mt-4 font-mono text-sm text-text-muted">— {{ site?.heroTitleGradient }}</p>
      </Reveal>
    </section>

    <!-- 02 · TECH STACK -->
    <section class="container-site pb-20 text-center">
      <Reveal>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">02 · Tech Stack</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
          Tools I <span class="bg-gradient-brand bg-clip-text text-transparent">work with</span>
        </h2>
      </Reveal>

      <Reveal class="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
        <span
          v-for="name in stackNames"
          :key="name"
          class="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-2 pl-2.5 pr-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
          :style="{ '--glyph-color': techColor(name) }"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-sm font-bold stack-glyph"
            :aria-label="name"
          >
            {{ findTechByName(name)?.glyph }}
          </span>
          <span class="text-sm font-semibold text-text">{{ name }}</span>
          <span class="hidden text-xs text-text-muted sm:inline">{{ stackCategories[name] }}</span>
        </span>
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

.stack-glyph {
  color: var(--glyph-color);
}

/* Mode terang: gelapkan warna logo agar tetap terbaca di background putih */
html:not(.dark) .stack-glyph {
  color: color-mix(in srgb, var(--glyph-color) 55%, #1e293b);
}
</style>

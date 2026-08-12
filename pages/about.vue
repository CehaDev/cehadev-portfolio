<script setup lang="ts">
import { Quote, MapPin, Mail, Globe, CheckCircle2, Code2, Clock, FolderGit2, Target, Download } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

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

const info = computed(() => [
  { icon: MapPin, label: 'Location', value: site.value?.location },
  { icon: Mail, label: 'Email', value: site.value?.email },
  { icon: Globe, label: 'Website', value: site.value?.website }
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

const bentoStats = computed(() => {
  const list = site.value?.stats ?? []
  if (!list.length) return []
  const hours = list.find((s) => s.label === 'Hours')
  const rest = list.filter((s) => s.label !== 'Hours')
  return [hours, ...rest].filter(Boolean) as NonNullable<typeof hours>[]
})

function techColor(name: string) {
  return techIcons[name.toLowerCase().replace('&', '').trim()]?.color ?? '#8B5CF6'
}

function statIcon(icon: string) {
  return statIcons[icon as keyof typeof statIcons]
}
</script>

<template>
  <div class="overflow-hidden">
    <!-- HERO -->
    <section class="relative flex min-h-[calc(100vh-76px)] flex-col justify-center overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 -z-10"
        style="
          background-image:
            radial-gradient(circle at 18% 28%, rgba(124, 58, 237, 0.13), transparent 46%),
            radial-gradient(circle at 84% 62%, rgba(59, 130, 246, 0.11), transparent 42%);
        "
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern"
        style="mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)"
        aria-hidden="true"
      />

      <div class="container-site py-16 text-center">
        <Reveal>
          <span class="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card">
            <span class="relative flex h-2 w-2" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {{ site?.heroBadge }} · {{ site?.location }}
          </span>

          <h1 class="mt-8 text-6xl font-extrabold leading-none tracking-tight md:text-8xl">
            <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
          </h1>

          <p class="mt-6 text-lg font-semibold text-text-secondary md:text-2xl">{{ site?.role }}</p>

          <div class="mx-auto mt-6 max-w-2xl space-y-3 text-[15px] leading-relaxed text-text-secondary">
            <p v-for="(para, i) in site?.aboutIntro ?? []" :key="i">
              {{ para }}
            </p>
          </div>

          <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
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

        <Reveal class="relative mx-auto mt-14 max-w-xl" :delay="150">
          <div class="absolute -inset-8 rounded-[28px] bg-glow-circle opacity-60 blur-3xl" aria-hidden="true" />

          <div class="relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card">
            <div class="flex items-center gap-1.5 border-b border-border bg-bg-alt px-4 py-3">
              <span class="h-3 w-3 rounded-full bg-red-400/70" aria-hidden="true" />
              <span class="h-3 w-3 rounded-full bg-amber-400/70" aria-hidden="true" />
              <span class="h-3 w-3 rounded-full bg-green-400/70" aria-hidden="true" />
              <span class="ml-3 font-mono text-[11px] text-text-muted">ceha@dev: ~</span>
            </div>

            <div class="space-y-1.5 p-5 font-mono text-[13px] leading-relaxed md:text-sm">
              <p class="text-text-secondary"><span class="text-success">➜</span> <span class="text-primary">~</span> whoami</p>
              <p class="text-text">cehadev <span class="text-text-muted">// web developer &amp; tech enthusiast</span></p>
              <p class="text-text-secondary"><span class="text-success">➜</span> <span class="text-primary">~</span> pwd</p>
              <p class="text-text">/jakarta/indonesia</p>
              <p class="text-text-secondary"><span class="text-success">➜</span> <span class="text-primary">~</span> cat stack.txt</p>
              <p class="text-text">nuxt · vue · tailwindcss · node · typescript</p>
              <p class="text-text-secondary"><span class="text-success">➜</span> <span class="text-primary">~</span> <span class="animate-pulse">▊</span></p>
            </div>
          </div>

          <div class="animate-float absolute -left-6 bottom-8 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur">
            <p class="font-mono text-base font-bold text-text">2<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">yrs</span></p>
          </div>

          <div class="animate-float absolute -right-5 -top-6 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur" style="animation-delay: 0.8s">
            <p class="font-mono text-base font-bold text-text">10<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">projects</span></p>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- STATUS BAR -->
    <section class="container-site">
      <Reveal class="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-y border-border/60 py-5">
        <span class="inline-flex items-center gap-2 text-xs font-medium text-text-secondary">
          <span class="relative flex h-2 w-2" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Available for collaboration
        </span>
        <span
          v-for="item in info"
          :key="item.label"
          class="inline-flex items-center gap-2 text-xs font-medium text-text-secondary"
        >
          <component :is="item.icon" :size="14" :stroke-width="1.75" class="text-primary" />
          {{ item.value }}
        </span>
      </Reveal>
    </section>

    <!-- 01 · HIGHLIGHTS -->
    <section class="container-site py-20">
      <Reveal class="mb-10">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">01 · Highlights</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
          Numbers that <span class="bg-gradient-brand bg-clip-text text-transparent">speak</span>
        </h2>
      </Reveal>

      <div class="grid grid-cols-2 auto-rows-[150px] gap-4 lg:auto-rows-[170px]">
        <Reveal
          v-for="(s, i) in bentoStats"
          :key="s.label"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300"
          :class="i === 0
            ? 'col-span-2 border-primary/25 bg-gradient-to-br from-primary/15 via-primary/5 to-blue/10 lg:row-span-2'
            : i === 1
              ? 'col-span-1 border-border bg-card hover:border-primary/40 lg:col-span-2'
              : 'col-span-1 border-border bg-card hover:border-primary/40'"
          :delay="i * 80"
        >
          <div v-if="i === 0" class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-glow-circle opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
          <span
            class="flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
            :class="i === 0 ? 'bg-gradient-brand text-white shadow-btn-glow' : 'bg-primary/10 text-primary'"
            aria-hidden="true"
          >
            <component :is="statIcon(s.icon)" :size="20" :stroke-width="1.5" />
          </span>
          <div>
            <dd class="font-mono text-5xl font-extrabold tracking-tight text-text md:text-6xl" :class="i === 0 ? 'bg-gradient-brand bg-clip-text text-transparent' : ''">
              <CountUp :end="s.end" :suffix="s.suffix ?? ''" />
            </dd>
            <dt class="mt-1 text-sm font-semibold text-text-secondary">{{ s.label }}</dt>
            <dd class="text-xs text-text-muted">{{ s.sub }}</dd>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- 02 · TENTANG SAYA -->
    <section class="container-site pb-20">
      <Reveal class="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">02 · Tentang Saya</p>
          <h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
            Why I love <span class="bg-gradient-brand bg-clip-text text-transparent">building for the web</span>
          </h2>
        </div>
      </Reveal>

      <div class="grid gap-4 sm:grid-cols-2">
        <Reveal
          v-for="item in site?.aboutChecklist ?? []"
          :key="item"
          class="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
        >
          <span
            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-gradient-brand group-hover:text-white"
            aria-hidden="true"
          >
            <CheckCircle2 :size="16" :stroke-width="2" />
          </span>
          <p class="text-sm leading-relaxed text-text-secondary">{{ item }}</p>
        </Reveal>
      </div>
    </section>

    <!-- QUOTE -->
    <section class="container-site pb-20">
      <Reveal class="relative overflow-hidden rounded-card border border-border bg-card p-8 text-center md:p-14">
        <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-brand" aria-hidden="true" />
        <Quote class="mx-auto h-10 w-10 text-primary/25" :stroke-width="1" aria-hidden="true" />
        <blockquote class="mx-auto mt-6 max-w-3xl text-2xl font-bold leading-snug tracking-tight text-text md:text-4xl">
          {{ site?.quote }}
          <span class="bg-gradient-brand bg-clip-text text-transparent">{{ site?.quoteHighlight }}</span>
        </blockquote>
        <p class="mt-6 font-mono text-sm text-text-muted">— {{ site?.heroTitleGradient }}</p>
      </Reveal>
    </section>

    <!-- 03 · TECH STACK -->
    <section class="container-site pb-20">
      <Reveal class="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">03 · Tech Stack</p>
          <h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
            Tools I <span class="bg-gradient-brand bg-clip-text text-transparent">work with</span>
          </h2>
        </div>
      </Reveal>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal
          v-for="name in stackNames"
          :key="name"
          class="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
          :style="{ '--glyph-color': techColor(name) }"
        >
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-sm font-bold transition-transform duration-300 group-hover:scale-110 stack-glyph"
            :aria-label="name"
          >
            {{ techIcons[name.toLowerCase().replace('&', '').trim()]?.glyph }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-text">{{ name }}</p>
            <p class="text-xs text-text-muted">{{ stackCategories[name] }}</p>
          </div>
        </Reveal>
      </div>
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

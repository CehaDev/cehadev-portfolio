<script setup lang="ts">
import { Quote, MapPin, Mail, Phone, Globe, CheckCircle2, Code2, Braces, Boxes, Terminal, Palette, Wrench, Monitor, Database, Download } from 'lucide-vue-next'
import { findTechByName } from '~/composables/useSkills'

const { data: site } = await useSiteSettings()
const { t } = useI18n()

useSeoMeta({
  title: () => site.value?.seo?.about?.title ?? 'About | CehaDev',
  description: () => site.value?.seo?.about?.description ?? 'Kenali lebih dekat CehaDev — Web Developer yang berfokus pada Nuxt.js, Vue.js, dan Node.js.'
})
useCanonical('/about')

const headings = computed(() => site.value?.headings?.about ?? {})

const { data: skills } = await useSkillsContent()

const facts = computed(() => [
  { icon: MapPin, label: headings.value.factLocation ?? 'Lokasi', value: site.value?.location },
  { icon: Mail, label: headings.value.factEmail ?? 'Email', value: site.value?.email },
  { icon: Globe, label: headings.value.factWebsite ?? 'Website', value: site.value?.website },
  { icon: Phone, label: headings.value.factPhone ?? 'Telepon', value: site.value?.phone }
])

const categoryIcons: Record<string, Component> = {
  Bahasa: Braces,
  Language: Braces,
  Framework: Boxes,
  Runtime: Terminal,
  Styling: Palette,
  Tooling: Wrench,
  OS: Monitor,
  Database,
  Lainnya: Code2,
  Others: Code2
}

const legacyCategory: Record<string, string> = {
  javascript: 'Bahasa',
  typescript: 'Bahasa',
  php: 'Bahasa',
  html5: 'Bahasa',
  vue: 'Framework',
  nuxt: 'Framework',
  node: 'Runtime',
  tailwind: 'Styling',
  css3: 'Styling',
  mysql: 'Database',
  git: 'Tooling',
  linux: 'OS'
}

const techSkills = computed(() => {
  const fallback = site.value?.headings?.about?.otherCategory ?? 'Lainnya'
  return (skills.value?.technicalSkills ?? []).map((s: any) => ({
    ...s,
    category: s.category || legacyCategory[s.tech] || fallback
  }))
})

const stackGroups = computed(() => {
  const fallback = site.value?.headings?.about?.otherCategory ?? 'Lainnya'
  const groups: { category: string; items: typeof techSkills.value }[] = []
  for (const item of techSkills.value) {
    const category = item.category || fallback
    let group = groups.find((g) => g.category === category)
    if (!group) {
      group = { category, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups.map((g) => ({ ...g, icon: categoryIcons[g.category] ?? Code2 }))
})

function techColor(name: string) {
  return findTechByName(name)?.color ?? '#8B5CF6'
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
        <Reveal :parallax="20">
          <div class="relative mx-auto flex justify-center">
            <AvatarIllustration :size="180" variant="code" src="/my.webp" alt="Foto CehaDev" />

            <div class="animate-float absolute bottom-4 -left-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:left-10">
              <p class="font-mono text-base font-bold text-text">2<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">{{ headings.yearsShort ?? 'yrs' }}</span></p>
            </div>

            <div class="animate-float absolute right-0 top-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:right-10" style="animation-delay: 0.8s">
              <p class="font-mono text-base font-bold text-text">10<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">{{ headings.projectsShort ?? 'projects' }}</span></p>
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
              {{ headings.downloadCv ?? t('nav.downloadCv') }}
            </a>
            <NuxtLink to="/contact" class="btn-outline">
              <Mail :size="16" :stroke-width="1.75" />
              {{ headings.letsTalk ?? 'Let\'s Talk' }}
            </NuxtLink>
          </div>
        </Reveal>
      </div>

    </section>

    <!-- 01 · TENTANG SAYA -->
    <section class="container-site pb-20">
      <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">{{ headings.aboutLabel ?? '01 · Tentang Saya' }}</p>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text md:text-4xl">
              {{ headings.whyHead1 ?? 'Why I love' }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ headings.whyHead2 ?? 'building for the web' }}</span>
            </h2>
          </Reveal>

          <Reveal class="mt-6 space-y-4 text-[15px] leading-relaxed text-text-secondary" direction="left" :parallax="12">
            <p v-for="(para, i) in site?.aboutIntro ?? []" :key="i">{{ para }}</p>
          </Reveal>

          <ul class="mt-8 space-y-3">
            <Reveal
              v-for="(item, idx) in site?.aboutChecklist ?? []"
              :key="item"
              class="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40"
              :delay="idx * 80"
              direction="left"
              :parallax="6 + idx * 3"
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

        <Reveal class="lg:sticky lg:top-24" direction="right">
          <IdCard
            :name="site?.name"
            :role="site?.role"
            :badge="site?.heroBadge"
            photo="/my.webp"
            photo-alt="Foto CehaDev"
            :facts="facts"
            footer-text="cehadev.id"
            hint="Geser ID card ke mana saja"
          />
        </Reveal>
      </div>
    </section>

    <!-- QUOTE -->
    <section class="container-site pb-20">
      <Reveal class="mx-auto max-w-3xl text-center" direction="blur" :parallax="18">
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
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">{{ headings.techLabel ?? '02 · Tech Stack' }}</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
          {{ headings.toolsHead1 ?? 'Tools I' }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ headings.toolsHead2 ?? 'work with' }}</span>
        </h2>
      </Reveal>

      <div class="mx-auto mt-12 grid max-w-5xl gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(group, gIdx) in stackGroups"
          :key="group.category"
          class="card group/card relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
          :delay="gIdx * 100"
          :direction="gIdx % 2 === 0 ? 'left' : 'right'"
          :parallax="10 + gIdx * 4"
        >
          <div
            class="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 opacity-0 group-hover/card:opacity-100"
            aria-hidden="true"
          />
          <div class="relative flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
              <component :is="group.icon" :size="18" :stroke-width="1.5" />
            </span>
            <h3 class="text-base font-bold text-text">{{ group.category }}</h3>
            <span class="ml-auto rounded-full border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] text-text-muted">{{ group.items.length }}</span>
          </div>

          <ul class="relative mt-6 flex-1 space-y-4">
            <li v-for="s in group.items" :key="s.name">
              <div class="flex items-center gap-3">
                <span
                  class="stack-glyph flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-[10px] font-bold"
                  :style="{ '--glyph-color': techColor(s.name) }"
                  :aria-label="s.name"
                >
                  {{ findTechByName(s.name)?.glyph ?? s.name.slice(0, 2).toUpperCase() }}
                </span>
                <span class="min-w-0 flex-1 truncate text-sm font-semibold text-text">{{ s.name }}</span>
                <span class="font-mono text-xs font-bold text-text-secondary">{{ s.level }}<span class="text-text-muted">%</span></span>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-alt" role="progressbar" :aria-label="(headings.levelAria ?? 'Tingkat {{name}}').replace('{{name}}', s.name)" :aria-valuenow="s.level" aria-valuemin="0" aria-valuemax="100">
                <div class="skill-bar h-full rounded-full bg-gradient-brand" :style="{ width: `${s.level}%` }" />
              </div>
            </li>
          </ul>
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

.skill-bar {
  transform-origin: left;
  animation: skillGrow 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes skillGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Mode terang: gelapkan warna logo agar tetap terbaca di background putih */
html:not(.dark) .stack-glyph {
  color: color-mix(in srgb, var(--glyph-color) 55%, #1e293b);
}
</style>

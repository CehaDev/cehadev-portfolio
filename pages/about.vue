<script setup lang="ts">
import { Quote, MapPin, Mail, Globe, CheckCircle2, Code2, Clock, FolderGit2, Target, FolderGit2 as FolderGit2Icon } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

useSeoMeta({
  title: 'About | CehaDev',
  description: 'Kenali lebih dekat CehaDev — Web Developer yang berfokus pada Nuxt.js, Vue.js, dan Node.js.'
})

const { data: site } = await useSiteSettings()

const statIcons = {
  Clock,
  FolderGit2: FolderGit2Icon,
  Code2,
  Target
}

const info = computed(() => [
  { icon: MapPin, label: 'Location', value: site.value?.location },
  { icon: Mail, label: 'Email', value: site.value?.email },
  { icon: Globe, label: 'Website', value: site.value?.website }
])

const stackNames = ['JavaScript', 'Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Node.js', 'Git & GitHub', 'Linux']
</script>

<template>
  <div class="container-site py-16 md:py-20">
    <!-- HERO 2 KOLOM -->
    <section class="grid min-h-[calc(100vh-76px)] items-center gap-12 lg:grid-cols-[55fr_45fr]">
      <Reveal>
        <span class="section-label"><span class="dot" aria-hidden="true" /> About Me</span>
        <h1 class="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Get to know<br />
          <span class="bg-gradient-brand bg-clip-text text-transparent">{{ site?.heroTitleGradient }}</span>
        </h1>
        <div class="mt-4 flex items-center gap-2" aria-hidden="true">
          <span class="h-px w-16 bg-border" />
          <span class="h-2 w-2 rounded-full bg-primary" />
        </div>
        <p v-for="(para, i) in site?.aboutIntro ?? []" :key="i" class="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {{ para }}
        </p>
      </Reveal>

      <Reveal class="mx-auto" :delay="100">
        <AvatarIllustration :size="260" variant="default" />
      </Reveal>
    </section>

    <!-- STATISTIK 2x2 -->
    <section class="mt-16 grid grid-cols-2 gap-4 md:mt-20 lg:grid-cols-4">
      <Reveal v-for="(s, i) in site?.stats ?? []" :key="s.label" class="card p-6 text-center" :delay="i * 80">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
          <component :is="statIcons[s.icon as keyof typeof statIcons]" :size="22" :stroke-width="1.5" />
        </span>
        <p class="mt-4 text-3xl font-extrabold text-text">
          <CountUp :end="s.end" :suffix="s.suffix ?? ''" />
        </p>
        <p class="mt-1 text-sm font-semibold text-text-secondary">{{ s.label }}</p>
        <p class="mt-0.5 text-xs text-text-muted">{{ s.sub }}</p>
      </Reveal>
    </section>

    <!-- QUOTE CARD -->
    <Reveal class="mt-6 flex items-start gap-4 rounded-card border border-primary/25 bg-primary/5 p-6 md:p-8" :delay="100">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
        <Quote :size="20" :stroke-width="1.5" />
      </span>
      <p class="text-lg font-medium leading-relaxed text-text md:text-xl">
        {{ site?.quote }}
        <span class="bg-gradient-brand bg-clip-text font-bold text-transparent">{{ site?.quoteHighlight }}</span>
      </p>
    </Reveal>

    <!-- PROFIL + KONTEN -->
    <section class="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
      <!-- Info Card Profil -->
      <Reveal class="card flex flex-col items-center p-8">
        <AvatarIllustration :size="150" variant="default" />
        <h2 class="mt-6 text-xl font-bold text-text">{{ site?.heroTitleGradient }}</h2>
        <p class="mt-1 text-sm text-text-secondary">Web Developer</p>
        <span class="mt-3 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          Available for work
        </span>
        <ul class="mt-6 w-full space-y-3 border-t border-border/60 pt-6">
          <li v-for="item in info" :key="item.label" class="flex items-center gap-3 text-sm">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-primary" aria-hidden="true">
              <component :is="item.icon" :size="16" :stroke-width="1.5" />
            </span>
            <div>
              <p class="text-xs text-text-muted">{{ item.label }}</p>
              <p class="font-medium text-text">{{ item.value }}</p>
            </div>
          </li>
        </ul>
      </Reveal>

      <div class="space-y-6">
        <!-- Tentang Saya -->
        <Reveal class="card p-7">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Tentang Saya</h2>
          <ul class="mt-5 space-y-3.5">
            <li v-for="item in site?.aboutChecklist ?? []" :key="item" class="flex items-start gap-3">
              <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">
                <CheckCircle2 :size="14" :stroke-width="2" />
              </span>
              <p class="text-sm leading-relaxed text-text-secondary">{{ item }}</p>
            </li>
          </ul>
        </Reveal>

        <!-- Tech Stack -->
        <Reveal class="card p-7" :delay="100">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Tech Stack yang Saya Gunakan</h2>
          <div class="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
            <div
              v-for="name in stackNames"
              :key="name"
              class="group flex flex-col items-center gap-2"
            >
              <span
                class="flex h-14 w-14 items-center justify-center rounded-card border border-border bg-bg transition-all group-hover:-translate-y-1 group-hover:border-primary/40"
                :style="techIcons[name.toLowerCase().replace('&', '').trim()] ? `color: ${techIcons[name.toLowerCase().replace('&', '').trim()].color}` : ''"
                :aria-label="name"
              >
                <span class="text-sm font-bold">{{ techIcons[name.toLowerCase().replace('&', '').trim()]?.glyph }}</span>
              </span>
              <span class="text-center text-[11px] font-medium leading-tight text-text-muted">{{ name }}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
</template>

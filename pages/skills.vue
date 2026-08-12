<script setup lang="ts">
import { Code2, TerminalSquare, Globe2, Code2 as Code, Clock, FolderGit2, GraduationCap } from 'lucide-vue-next'
import { skillCategories } from '~/composables/useSkills'

useSeoMeta({
  title: 'Skills | CehaDev',
  description: 'Keahlian dan teknologi yang dikuasai CehaDev — JavaScript, Vue.js, Nuxt.js, Node.js, dan berbagai tools pengembangan lainnya.'
})

const { data: skills } = await useSkillsContent()

const activeCat = ref('all')

const filteredSkills = computed(() => {
  const all = skills.value?.technicalSkills ?? []
  if (activeCat.value === 'all') return all
  if (activeCat.value === 'frontend') {
    return all.filter((s) => ['JavaScript', 'CSS3', 'Vue.js', 'Nuxt.js', 'Tailwind CSS', 'HTML5'].includes(s.name))
  }
  if (activeCat.value === 'backend') {
    return all.filter((s) => ['Node.js', 'PHP', 'MySQL'].includes(s.name))
  }
  return all.filter((s) => ['Git & GitHub'].includes(s.name))
})

const summaryIcons = {
  'Code2': Code,
  'Clock': Clock,
  'FolderGit2': FolderGit2,
  'GraduationCap': GraduationCap
}

const floatingBoxes = [
  { icon: Code2, label: 'Code', pos: 'left-0 top-8', delay: '0s', color: '#8B5CF6' },
  { icon: TerminalSquare, label: 'Terminal', pos: 'right-0 top-20', delay: '0.8s', color: '#22C55E' },
  { icon: Globe2, label: 'Web', pos: 'left-4 bottom-4', delay: '1.6s', color: '#3B82F6' }
]
</script>

<template>
  <div class="container-site py-16 md:py-20">
    <!-- HERO -->
    <section class="grid min-h-[calc(100vh-76px)] items-center gap-12 lg:grid-cols-[55fr_45fr]">
      <Reveal>
        <span class="section-label"><span class="dot" aria-hidden="true" /> Always learning and improving</span>
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          My <span class="bg-gradient-brand bg-clip-text text-transparent">Skills</span>
        </h1>
        <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Berikut adalah teknologi dan tools yang saya kuasai untuk membangun aplikasi web modern — dari frontend yang interaktif hingga backend yang handal, serta tools yang mendukung alur kerja yang efisien.
        </p>
      </Reveal>

      <Reveal class="relative mx-auto" :delay="100">
        <AvatarIllustration :size="250" variant="laptop" />
        <div
          v-for="b in floatingBoxes"
          :key="b.label"
          class="absolute flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-card animate-float"
          :class="b.pos"
          :style="{ color: b.color, animationDelay: b.delay }"
          role="img"
          :aria-label="`Ikon ${b.label}`"
        >
          <component :is="b.icon" :size="22" :stroke-width="1.5" />
        </div>
      </Reveal>
    </section>

    <!-- TABS KATEGORI -->
    <div class="mt-14 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter kategori skill">
      <button
        v-for="cat in skillCategories"
        :key="cat.id"
        type="button"
        role="tab"
        :aria-selected="activeCat === cat.id"
        class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        :class="activeCat === cat.id
          ? 'border-transparent bg-gradient-brand text-white shadow-btn-glow'
          : 'border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text'"
        @click="activeCat = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- KONTEN -->
    <section class="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
      <!-- Kolom kiri: Technical Skills + Banner -->
      <div class="space-y-6">
        <Reveal class="card p-7">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Technical Skills</h2>
          <div class="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <ProgressBar v-for="s in filteredSkills" :key="s.name" :name="s.name" :level="s.level" />
          </div>
        </Reveal>

        <Reveal class="flex flex-col items-center justify-between gap-4 rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 to-blue/10 p-6 sm:flex-row" :delay="100">
          <p class="text-center font-semibold text-text sm:text-left">Want to work together?</p>
          <NuxtLink to="/contact" class="btn-primary shrink-0 !py-2.5">Contact Me</NuxtLink>
        </Reveal>
      </div>

      <!-- Kolom kanan -->
      <div class="space-y-6">
        <Reveal class="card p-6">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Skills Summary</h2>
          <div class="mt-5 grid grid-cols-2 gap-4">
            <div v-for="s in skills?.skillsSummary ?? []" :key="s.label" class="rounded-card border border-border bg-bg p-4">
              <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary" aria-hidden="true">
                <component :is="summaryIcons[s.icon as keyof typeof summaryIcons]" :size="17" :stroke-width="1.5" />
              </span>
              <p class="mt-3 text-xl font-extrabold text-text">{{ s.value }}</p>
              <p class="mt-0.5 text-xs font-medium text-text-muted">{{ s.label }}</p>
            </div>
          </div>
        </Reveal>

        <Reveal class="card p-6" :delay="80">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Tools &amp; Others</h2>
          <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              v-for="tool in skills?.toolsList ?? []"
              :key="tool"
              class="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2.5 transition-colors hover:border-primary/40"
            >
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-brand text-[9px] font-bold text-white" aria-hidden="true">
                {{ tool.slice(0, 2).toUpperCase() }}
              </span>
              <span class="truncate text-xs font-medium text-text-secondary">{{ tool }}</span>
            </div>
          </div>
        </Reveal>

        <Reveal class="card p-6" :delay="160">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> Soft Skills</h2>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="soft in skills?.softSkills ?? []"
              :key="soft"
              class="rounded-full border border-border bg-bg px-3.5 py-1.5 text-xs font-medium text-text-secondary"
            >
              {{ soft }}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
</template>

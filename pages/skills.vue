<script setup lang="ts">
import { Code2, TerminalSquare, Globe2, Clock, FolderGit2, GraduationCap } from 'lucide-vue-next'
import { findTechByName } from '~/composables/useSkills'

const { data: site } = await useSiteSettings()

useSeoMeta({
  title: () => site.value?.seo?.skills?.title ?? 'Skills | CehaDev',
  description: () => site.value?.seo?.skills?.description ?? 'Keahlian dan teknologi yang dikuasai CehaDev — JavaScript, Vue.js, Nuxt.js, Node.js, dan berbagai tools pengembangan lainnya.'
})

const headings = computed(() => site.value?.headings?.skills ?? {})

const { data: skills } = await useSkillsContent()

const activeCat = ref('all')

const techSkills = computed(() => (skills.value?.technicalSkills ?? []))

const categories = computed(() => {
  const set = new Set(techSkills.value.map((s: any) => s.category).filter(Boolean))
  return ['all', ...set] as string[]
})

const filteredSkills = computed(() => {
  if (activeCat.value === 'all') return techSkills.value
  return techSkills.value.filter((s: any) => s.category === activeCat.value)
})

const groups = computed(() => {
  const map = new Map<string, typeof techSkills.value>()
  for (const s of filteredSkills.value) {
    const cat = s.category || 'Lainnya'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(s)
  }
  return [...map.entries()]
})

function techFor(name: string) {
  return findTechByName(name)
}

function techColor(name: string) {
  return findTechByName(name)?.color ?? '#8B5CF6'
}

const summaryIcons = {
  'Code2': Code2,
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
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          {{ headings.myHead1 ?? 'My' }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ headings.myHead2 ?? 'Skills' }}</span>
        </h1>
        <p class="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {{ headings.heroDesc ?? 'Berikut adalah teknologi dan tools yang saya kuasai untuk membangun aplikasi web modern — dari frontend yang interaktif hingga backend yang handal, serta tools yang mendukung alur kerja yang efisien.' }}
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
    <div class="mt-14 flex flex-wrap gap-2.5" role="tablist" :aria-label="headings.filterAria ?? 'Filter kategori skill'">
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        role="tab"
        :aria-selected="activeCat === cat"
        class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        :class="activeCat === cat
          ? 'border-transparent bg-gradient-brand text-white shadow-btn-glow'
          : 'border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text'"
        @click="activeCat = cat"
      >
        {{ cat === 'all' ? (headings.allSkills ?? 'All Skills') : cat }}
      </button>
    </div>

    <!-- KONTEN -->
    <section class="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
      <!-- Kolom kiri: Technical Skills + Banner -->
      <div class="space-y-6">
        <Reveal class="card p-7">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> {{ headings.technicalSkills ?? 'Technical Skills' }}</h2>

          <div v-if="activeCat === 'all'" class="mt-6 space-y-8">
            <div v-for="[cat, items] in groups" :key="cat">
              <div class="mb-3 flex items-center gap-2">
                <h3 class="text-sm font-bold text-text">{{ cat }}</h3>
                <span class="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-text-muted">{{ items.length }}</span>
              </div>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                <div
                  v-for="s in items"
                  :key="s.name"
                  class="skill-tile group"
                  :style="{ '--tile-color': techColor(s.name) }"
                >
                  <span
                    class="skill-tile-glyph"
                    :style="{ color: techColor(s.name), backgroundColor: `${techColor(s.name)}1f` }"
                    aria-hidden="true"
                  >
                    {{ techFor(s.name)?.glyph ?? s.name.slice(0, 2).toUpperCase() }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-text">{{ s.name }}</p>
                    <p class="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-text-muted">
                      <span class="h-1 w-1 rounded-full" :style="{ backgroundColor: techColor(s.name) }" aria-hidden="true" />
                      {{ s.level }}%
                    </p>
                  </div>
                  <span class="ml-auto h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              v-for="s in filteredSkills"
              :key="s.name"
              class="skill-tile group"
              :style="{ '--tile-color': techColor(s.name) }"
            >
              <span
                class="skill-tile-glyph"
                :style="{ color: techColor(s.name), backgroundColor: `${techColor(s.name)}1f` }"
                aria-hidden="true"
              >
                {{ techFor(s.name)?.glyph ?? s.name.slice(0, 2).toUpperCase() }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-text">{{ s.name }}</p>
                <p class="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-text-muted">
                  <span class="h-1 w-1 rounded-full" :style="{ backgroundColor: techColor(s.name) }" aria-hidden="true" />
                  {{ s.level }}%
                </p>
              </div>
              <span class="ml-auto h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary" aria-hidden="true" />
            </div>
          </div>

          <p v-if="!filteredSkills.length" class="mt-6 rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
            {{ headings.emptyCategory ?? 'Belum ada skill pada kategori ini.' }}
          </p>
        </Reveal>

        <Reveal class="flex flex-col items-center justify-between gap-4 rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 to-blue/10 p-6 sm:flex-row" :delay="100">
          <p class="text-center font-semibold text-text sm:text-left">{{ headings.wantWork ?? 'Want to work together?' }}</p>
          <NuxtLink to="/contact" class="btn-primary shrink-0 !py-2.5">{{ headings.contactMe ?? 'Contact Me' }}</NuxtLink>
        </Reveal>
      </div>

      <!-- Kolom kanan -->
      <div class="space-y-6">
        <Reveal class="card p-6">
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> {{ headings.skillsSummary ?? 'Skills Summary' }}</h2>
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
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> {{ headings.toolsOthers ?? 'Tools & Others' }}</h2>
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
          <h2 class="section-label"><span class="dot" aria-hidden="true" /> {{ headings.softSkills ?? 'Soft Skills' }}</h2>
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

<style scoped>
.skill-tile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-card, 14px);
  background: rgb(var(--color-card));
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.skill-tile:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--tile-color) 55%, rgb(var(--color-border)));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px color-mix(in srgb, var(--tile-color) 40%, transparent);
}

.skill-tile-glyph {
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-size: 10px;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.skill-tile:hover .skill-tile-glyph {
  transform: scale(1.08) rotate(-4deg);
}
</style>

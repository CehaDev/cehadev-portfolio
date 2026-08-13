<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
import { findTechByName } from '~/composables/useSkills'

useSeoMeta({
  title: 'Projects | CehaDev',
  description: 'Kumpulan project yang pernah dikerjakan CehaDev — dari web app, e-commerce, dashboard, hingga backend API.'
})

const { data: projects } = await useProjectsContent()

const categories = computed(() => ['All', ...new Set((projects.value ?? []).map((p) => p.category))])
const activeCategory = ref('All')

const filtered = computed(() =>
  activeCategory.value === 'All' ? projects.value ?? [] : (projects.value ?? []).filter((p) => p.category === activeCategory.value)
)

function categoryCount(cat: string) {
  return cat === 'All' ? (projects.value?.length ?? 0) : (projects.value ?? []).filter((p) => p.category === cat).length
}

const totalProjects = computed(() => projects.value?.length ?? 0)
const totalCategories = computed(() => categories.value.length - 1)
const yearsRange = computed(() => {
  const list = (projects.value ?? []).map((p) => Number(p.year)).filter(Number.isFinite)
  return list.length ? `${Math.min(...list)} – ${Math.max(...list)}` : ''
})

const techStats = computed(() => {
  const counts = new Map<string, number>()
  for (const p of projects.value ?? []) {
    for (const key of p.tech ?? []) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  return [...counts.entries()]
    .map(([key, count]) => {
      const t = findTechByName(key)
      return {
        key,
        name: t?.name ?? key,
        glyph: t?.glyph ?? key.slice(0, 2).toUpperCase(),
        color: t?.color ?? '#8B5CF6',
        count,
        pct: Math.round((count / total) * 100)
      }
    })
    .sort((a, b) => b.count - a.count)
})
</script>

<template>
  <div class="container-site min-h-[calc(100vh-76px)] py-16 md:py-20">
    <!-- HERO -->
    <div class="text-center">
      <span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card">
        <span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        Portofolio
      </span>
      <h1 class="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
        My <span class="bg-gradient-brand bg-clip-text text-transparent">Projects</span>
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
        Kumpulan project yang saya kerjakan — dari aplikasi web, e-commerce, dashboard, hingga backend API. Setiap project dibangun dengan fokus pada kualitas, performa, dan pengalaman pengguna.
      </p>

      <div class="mx-auto mt-8 flex max-w-lg divide-x divide-border overflow-hidden rounded-card border border-border bg-card shadow-card">
        <div class="flex-1 px-3 py-4 text-center">
          <p class="font-mono text-2xl font-extrabold text-text">{{ totalProjects }}</p>
          <p class="mt-0.5 text-xs text-text-muted">Project</p>
        </div>
        <div class="flex-1 px-3 py-4 text-center">
          <p class="font-mono text-2xl font-extrabold text-text">{{ totalCategories }}</p>
          <p class="mt-0.5 text-xs text-text-muted">Kategori</p>
        </div>
        <div class="flex-1 px-3 py-4 text-center">
          <p class="font-mono text-2xl font-extrabold text-text">{{ yearsRange }}</p>
          <p class="mt-0.5 text-xs text-text-muted">Tahun</p>
        </div>
        <div class="flex-1 px-3 py-4 text-center">
          <p class="font-mono text-2xl font-extrabold text-text">{{ techStats.length }}</p>
          <p class="mt-0.5 text-xs text-text-muted">Tech</p>
        </div>
      </div>
    </div>

    <div class="mt-12 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
      <!-- FILTER + GRID PROJECT -->
      <div class="min-w-0 lg:order-1">
        <div class="flex flex-wrap justify-center gap-2.5 lg:justify-start" role="tablist" aria-label="Filter kategori project">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="activeCategory === cat"
            class="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300"
            :class="activeCategory === cat
              ? 'border-transparent bg-gradient-brand text-white shadow-btn-glow'
              : 'border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text'"
            @click="activeCategory = cat"
          >
            {{ cat }}
            <span class="ml-1.5 text-xs" :class="activeCategory === cat ? 'text-white/80' : 'text-text-muted'">({{ categoryCount(cat) }})</span>
          </button>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <Reveal v-for="(p, i) in filtered" :key="p.slug" :delay="(i % 2) * 80">
            <ProjectCard :project="p" />
          </Reveal>
        </div>
      </div>

      <!-- GRAFIK BAHASA & TEKNOLOGI -->
      <aside class="lg:order-2">
        <section class="card p-6 md:p-7">
          <div class="flex items-center gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
              <BarChart3 :size="20" :stroke-width="1.5" />
            </span>
            <div>
              <h2 class="text-lg font-extrabold text-text">Bahasa & Teknologi</h2>
              <p class="text-xs text-text-muted">Frekuensi pemakaian di seluruh project</p>
            </div>
          </div>

          <div class="mt-7 space-y-5">
            <div v-for="t in techStats" :key="t.key" class="min-w-0">
              <div class="mb-1.5 flex items-center justify-between gap-3">
                <span class="flex min-w-0 items-center gap-2 text-sm font-medium text-text">
                  <span
                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-[10px] font-bold tech-glyph"
                    :style="{ '--glyph-color': t.color }"
                    aria-hidden="true"
                  >
                    {{ t.glyph }}
                  </span>
                  <span class="truncate">{{ t.name }}</span>
                </span>
                <span class="shrink-0 font-mono text-xs text-text-muted">{{ t.count }}× · {{ t.pct }}%</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-bg-alt" role="img" :aria-label="`${t.name} ${t.pct}%`">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: t.pct + '%', background: `linear-gradient(90deg, ${t.color}, ${t.color}99)` }"
                />
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.tech-glyph {
  color: var(--glyph-color);
}

/* Mode terang: gelapkan warna logo agar tetap terbaca di background putih */
html:not(.dark) .tech-glyph {
  color: color-mix(in srgb, var(--glyph-color) 55%, #1e293b);
}
</style>

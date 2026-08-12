<script setup lang="ts">
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
</script>

<template>
  <div class="container-site py-16 md:py-20">
    <div class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <span class="section-label"><span class="dot" aria-hidden="true" /> Projects</span>
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
          My <span class="bg-gradient-brand bg-clip-text text-transparent">Projects</span>
        </h1>
        <p class="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          Kumpulan project yang saya kerjakan — dari aplikasi web, e-commerce, dashboard, hingga backend API. Setiap project dibangun dengan fokus pada kualitas, performa, dan pengalaman pengguna.
        </p>
      </div>
    </div>

    <!-- Filter kategori -->
    <div class="mb-8 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter kategori project">
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        role="tab"
        :aria-selected="activeCategory === cat"
        class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        :class="activeCategory === cat
          ? 'border-transparent bg-gradient-brand text-white shadow-btn-glow'
          : 'border-border bg-card text-text-secondary hover:border-primary/50 hover:text-white'"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal v-for="(p, i) in filtered" :key="p.slug" :delay="(i % 3) * 80">
        <ProjectCard :project="p" />
      </Reveal>
    </div>
  </div>
</template>

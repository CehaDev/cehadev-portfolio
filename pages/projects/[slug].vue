<script setup lang="ts">
import {
  ArrowLeft, Star, ExternalLink, Github, Monitor, Calendar, Clock3, FolderKanban,
  Search, LayoutDashboard, MessageSquare, ShieldCheck, Users, FolderCheck, Activity,
  Bug, Code2, ClipboardList, PenTool, Rocket, Bell
} from 'lucide-vue-next'
import { projects, mageransDetail } from '~/composables/useProjects'
import { techIcons } from '~/composables/useSkills'

const route = useRoute()
const project = computed(() => projects.find((p) => p.slug === route.params.slug))
const detail = mageransDetail

useSeoMeta({
  title: () => `${project.value?.title ?? 'Project'} | CehaDev`,
  description: () => project.value?.tagline ?? ''
})

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project tidak ditemukan', fatal: true })
}

const tabs = ['Overview', 'Fitur', 'Teknologi', 'Proses', 'Tantangan', 'Hasil', 'Galeri'] as const
const activeTab = ref<(typeof tabs)[number]>('Overview')

const metaItems = computed(() => [
  { icon: Monitor, label: 'Peran', value: project.value?.role },
  { icon: Calendar, label: 'Tahun', value: project.value?.year },
  { icon: Clock3, label: 'Durasi', value: project.value?.duration },
  { icon: FolderKanban, label: 'Kategori', value: project.value?.category }
])

const featureIcons = {
  Search, LayoutDashboard, MessageSquare, ShieldCheck,
  FolderKanban, Star, Bell, Users, FolderCheck, Activity,
  Code2, ClipboardList, PenTool, Rocket, Bug
}

const challenges = [
  { title: 'Sinkronisasi data real-time', desc: 'Memastikan pesan dan update status tim tampil hampir instan di semua perangkat menggunakan WebSocket dan optimasi payload.' },
  { title: 'Performa pada data besar', desc: 'Mengatasi kelambatan saat dataset besar dengan pagination, virtual scrolling, dan indeks database yang tepat.' },
  { title: 'Keamanan autentikasi', desc: 'Menerapkan JWT dengan refresh token, proteksi CSRF, dan enkripsi data sensitif untuk menjaga keamanan akun.' },
  { title: 'Skalabilitas & maintenance', desc: 'Arsitektur modular dengan code splitting dan dokumentasi yang jelas agar mudah dikembangkan tim lain.' }
]

const gallery = [
  { label: 'Dashboard', seed: 1 },
  { label: 'Kanban Board', seed: 2 },
  { label: 'Chat Real-time', seed: 3 },
  { label: 'Detail Project', seed: 4 },
  { label: 'Halaman Auth', seed: 5 }
]
</script>

<template>
  <div v-if="project" class="container-site py-12 md:py-16">
    <NuxtLink to="/projects" class="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-white">
      <ArrowLeft :size="16" :stroke-width="2" />
      Kembali ke Projects
    </NuxtLink>

    <!-- HEADER -->
    <section class="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
      <div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
          <Star :size="12" :stroke-width="2" class="fill-amber-400" />
          Featured Project
        </span>
        <h1 class="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">{{ project.title }}</h1>
        <p class="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">{{ project.tagline }}</p>

        <div class="mt-5 flex flex-wrap gap-2">
          <TechBadge v-for="tag in project.tags" :key="tag" :name="tag" />
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="item in metaItems" :key="item.label" class="flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-primary" aria-hidden="true">
              <component :is="item.icon" :size="18" :stroke-width="1.5" />
            </span>
            <div>
              <p class="text-xs text-text-muted">{{ item.label }}</p>
              <p class="text-sm font-semibold text-text">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-4">
          <a :href="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
            Live Demo
            <ExternalLink :size="16" :stroke-width="2" />
          </a>
          <a :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="btn-outline">
            <Github :size="16" :stroke-width="1.5" />
            View on GitHub
          </a>
        </div>
      </div>

      <Reveal class="mx-auto w-full max-w-[420px]">
        <div class="overflow-hidden rounded-card border border-border bg-card shadow-card">
          <div class="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true">
            <span class="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span class="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span class="h-3 w-3 rounded-full bg-[#28C840]" />
            <span class="ml-3 flex-1 rounded-md bg-bg px-3 py-1 text-[11px] text-text-muted">{{ project.liveUrl }}</span>
          </div>
          <ProjectThumb :seed="project.title.length + 7" :label="project.title" height="h-64 md:h-72" />
        </div>
      </Reveal>
    </section>

    <!-- TABS -->
    <section class="mt-14">
      <div class="flex gap-1 overflow-x-auto border-b border-border pb-px" role="tablist" aria-label="Navigasi konten project">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab"
          :aria-controls="`panel-${tab}`"
          class="relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors"
          :class="activeTab === tab ? 'text-white' : 'text-text-muted hover:text-text-secondary'"
          @click="activeTab = tab"
        >
          {{ tab }}
          <span
            v-if="activeTab === tab"
            class="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-brand rounded-full"
            aria-hidden="true"
          />
        </button>
      </div>

      <div class="mt-10">
        <!-- OVERVIEW -->
        <div v-if="activeTab === 'Overview'" id="panel-Overview" role="tabpanel">
          <div class="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div class="space-y-4 text-[15px] leading-relaxed text-text-secondary">
              <p v-for="(para, i) in detail.overview.split('\n\n')" :key="i">{{ para }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Reveal v-for="(f, i) in detail.featureHighlights" :key="f.title" class="card p-5" :delay="i * 60">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl" :style="{ backgroundColor: f.color + '22', color: f.color }" aria-hidden="true">
                  <component :is="featureIcons[f.icon as keyof typeof featureIcons]" :size="20" :stroke-width="1.5" />
                </span>
                <h3 class="mt-3 text-sm font-semibold text-text">{{ f.title }}</h3>
                <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ f.desc }}</p>
              </Reveal>
            </div>
          </div>
        </div>

        <!-- FITUR -->
        <div v-else-if="activeTab === 'Fitur'" id="panel-Fitur" role="tabpanel">
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal v-for="(f, i) in detail.mainFeatures" :key="f.title" class="card p-6" :delay="(i % 3) * 60">
              <span class="flex h-11 w-11 items-center justify-center rounded-xl" :style="{ backgroundColor: f.color + '22', color: f.color }" aria-hidden="true">
                <component :is="featureIcons[f.icon as keyof typeof featureIcons]" :size="22" :stroke-width="1.5" />
              </span>
              <h3 class="mt-4 text-base font-semibold text-text">{{ f.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ f.desc }}</p>
            </Reveal>
          </div>
        </div>

        <!-- TEKNOLOGI -->
        <div v-else-if="activeTab === 'Teknologi'" id="panel-Teknologi" role="tabpanel">
          <div class="flex flex-wrap gap-3">
            <div
              v-for="t in detail.techStack"
              :key="t"
              class="flex items-center gap-2.5 rounded-card border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-bg text-sm font-bold" :style="`color: ${techIcons[t]?.color}`" aria-hidden="true">
                {{ techIcons[t]?.glyph }}
              </span>
              <span class="text-sm font-medium text-text">{{ techIcons[t]?.name ?? t }}</span>
            </div>
          </div>
        </div>

        <!-- PROSES -->
        <div v-else-if="activeTab === 'Proses'" id="panel-Proses" role="tabpanel">
          <ol class="grid gap-6 md:grid-cols-5">
            <Reveal v-for="(p, i) in detail.process" :key="p.num" class="relative" :delay="i * 70">
              <div class="flex flex-col items-center text-center">
                <span class="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary" aria-hidden="true">
                  <component :is="featureIcons[p.icon as keyof typeof featureIcons]" :size="22" :stroke-width="1.5" />
                  <span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white">{{ p.num }}</span>
                </span>
                <h3 class="mt-4 text-sm font-semibold text-text">{{ p.title }}</h3>
                <p class="mt-1.5 text-xs leading-relaxed text-text-secondary">{{ p.desc }}</p>
              </div>
            </Reveal>
          </ol>
        </div>

        <!-- TANTANGAN -->
        <div v-else-if="activeTab === 'Tantangan'" id="panel-Tantangan" role="tabpanel">
          <div class="grid gap-5 md:grid-cols-2">
            <Reveal v-for="(c, i) in challenges" :key="c.title" class="card p-6" :delay="(i % 2) * 60">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
                <Bug :size="20" :stroke-width="1.5" />
              </span>
              <h3 class="mt-3 text-sm font-semibold text-text">{{ c.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ c.desc }}</p>
            </Reveal>
          </div>
        </div>

        <!-- HASIL -->
        <div v-else-if="activeTab === 'Hasil'" id="panel-Hasil" role="tabpanel">
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Reveal v-for="(r, i) in detail.results" :key="r.label" class="card p-6 text-center" :delay="i * 70">
              <span class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
                <component :is="featureIcons[r.icon as keyof typeof featureIcons]" :size="20" :stroke-width="1.5" />
              </span>
              <p class="mt-3 text-2xl font-extrabold text-text md:text-3xl">{{ r.value }}</p>
              <p class="mt-1 text-xs font-medium text-text-muted md:text-sm">{{ r.label }}</p>
            </Reveal>
          </div>
        </div>

        <!-- GALERI -->
        <div v-else id="panel-Galeri" role="tabpanel">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal v-for="(g, i) in gallery" :key="g.label" :class="i === 0 ? 'sm:col-span-2 lg:row-span-2' : ''" :delay="(i % 3) * 60">
              <ProjectThumb :seed="g.seed" :label="g.label" :height="i === 0 ? 'h-full min-h-56' : 'h-44'" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mt-16 rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-blue/10 p-8 text-center md:p-12">
      <h2 class="text-2xl font-extrabold text-text md:text-3xl">Tertarik untuk bekerja sama?</h2>
      <p class="mx-auto mt-3 max-w-md text-[15px] text-text-secondary">
        Punya ide atau project yang ingin diwujudkan? Mari diskusikan dan bangun sesuatu yang hebat bersama.
      </p>
      <div class="mt-7 flex flex-wrap justify-center gap-4">
        <NuxtLink to="/contact" class="btn-primary">Hubungi Saya</NuxtLink>
        <NuxtLink to="/projects" class="btn-outline">Lihat Project Lainnya</NuxtLink>
      </div>
    </section>
  </div>
</template>

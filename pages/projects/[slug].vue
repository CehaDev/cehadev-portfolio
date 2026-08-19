<script setup lang="ts">
import {
  ArrowLeft, Star, ExternalLink, Github, Monitor, Calendar, Clock3, FolderKanban, Eye, Play,
  Search, LayoutDashboard, MessageSquare, ShieldCheck, Users, FolderCheck, Activity,
  Bug, Code2, ClipboardList, PenTool, Rocket, Bell
} from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

const route = useRoute()
const { viewsOf, formatCount } = useStats()

const { data: projects } = await useProjectsContent()
const { data: site } = await useSiteSettings()
const { t } = useI18n()
const headings = computed(() => site.value?.headings?.projectDetail ?? {})

const project = computed(() => (projects.value ?? []).find((p: any) => p.slug === route.params.slug))

useSeoMeta({
  title: () => `${project.value?.title ?? 'Project'} | CehaDev`,
  description: () => project.value?.tagline ?? ''
})

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: headings.value.notFound ?? 'Project tidak ditemukan', fatal: true })
}

const detail = computed(() => project.value?.detail as Record<string, unknown> | undefined)

const demoConfig = computed(
  () =>
    (project.value?.demo as { enabled?: boolean; type?: string; title?: string; note?: string; code?: { files?: Array<{ name: string; language: string; content: string }> } } | undefined) ??
    {}
)
const demoEnabled = computed(() => Boolean(demoConfig.value.enabled))
const demoFiles = computed(() => demoConfig.value.code?.files ?? [])

const tabLabels = computed<Record<string, string>>(() => ({
  Demo: headings.value.tabDemo ?? 'Demo Interaktif',
  Overview: headings.value.tabOverview ?? 'Overview',
  Fitur: headings.value.tabFeatures ?? 'Fitur',
  Teknologi: headings.value.tabTech ?? 'Teknologi',
  Proses: headings.value.tabProcess ?? 'Proses',
  Tantangan: headings.value.tabChallenges ?? 'Tantangan',
  Hasil: headings.value.tabResults ?? 'Hasil',
  Galeri: headings.value.tabGallery ?? 'Galeri'
}))

const tabDefs = [
  { key: 'Demo', has: () => demoEnabled.value },
  { key: 'Overview', has: () => true },
  { key: 'Fitur', has: () => Boolean(detail.value?.mainFeatures) },
  { key: 'Teknologi', has: () => Boolean(detail.value?.techStack) },
  { key: 'Proses', has: () => Boolean(detail.value?.process) },
  { key: 'Tantangan', has: () => Boolean(detail.value?.challenges) },
  { key: 'Hasil', has: () => Boolean(detail.value?.results) },
  { key: 'Galeri', has: () => Boolean(detail.value?.gallery) }
] as const

const tabs = computed(() => tabDefs.filter((t) => t.has()).map((t) => t.key))
const activeTab = ref<(typeof tabDefs)[number]['key']>('Overview')

const metaItems = computed(() => [
  { icon: Monitor, label: headings.value.metaRole ?? 'Peran', value: project.value?.role },
  { icon: Calendar, label: headings.value.metaYear ?? 'Tahun', value: project.value?.year },
  { icon: Clock3, label: headings.value.metaDuration ?? 'Durasi', value: project.value?.duration },
  { icon: FolderKanban, label: headings.value.metaCategory ?? 'Kategori', value: project.value?.category }
])

const featureIcons = {
  Search, LayoutDashboard, MessageSquare, ShieldCheck,
  FolderKanban, Star, Bell, Users, FolderCheck, Activity,
  Code2, ClipboardList, PenTool, Rocket, Bug
}

const gallery = computed(() => {
  const g = detail.value?.gallery as Array<{ label: string; seed: number }> | undefined
  return g?.length ? g : [{ label: project.value?.title ?? 'Preview', seed: 1 }]
})

const externalLive = computed(() => {
  const url = project.value?.liveUrl
  return typeof url === 'string' && /^https?:\/\//.test(url) && !/example\.(com|org|net)/i.test(url)
})

function openDemo() {
  activeTab.value = 'Demo'
  nextTick(() => {
    const el = document.getElementById('demo-panel')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>

<template>
  <div v-if="project" class="container-site py-12 md:py-16">
    <NuxtLink to="/projects" class="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text">
      <ArrowLeft :size="16" :stroke-width="2" />
      {{ headings.backToProjects ?? 'Kembali ke Projects' }}
    </NuxtLink>

    <!-- HEADER -->
    <section class="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
      <div>
        <span v-if="project.featured" class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
          <Star :size="12" :stroke-width="2" class="fill-amber-400" />
          {{ headings.featured ?? 'Featured Project' }}
        </span>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-text-secondary">
          <Eye :size="12" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          {{ formatCount(viewsOf(project.slug)) }} {{ t('common.viewed') }}
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
          <button
            v-if="demoEnabled"
            type="button"
            class="btn-primary"
            @click="openDemo"
          >
            <Play :size="16" :stroke-width="2" />
            {{ headings.tryDemo ?? 'Coba Demo' }}
          </button>
          <a v-if="externalLive" :href="project.liveUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
            {{ headings.liveDemo ?? 'Live Demo' }}
            <ExternalLink :size="16" :stroke-width="2" />
          </a>
          <a :href="project.githubUrl" target="_blank" rel="noopener noreferrer" class="btn-outline">
            <Github :size="16" :stroke-width="1.5" />
            {{ headings.viewGithub ?? 'View on GitHub' }}
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
      <div class="flex gap-1 overflow-x-auto border-b border-border pb-px" role="tablist" :aria-label="headings.tabAria ?? 'Navigasi konten project'">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab"
          :aria-controls="`panel-${tab}`"
          class="relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors"
          :class="activeTab === tab ? 'text-text' : 'text-text-muted hover:text-text-secondary'"
          @click="activeTab = tab"
        >
          {{ tabLabels[tab] }}
          <span
            v-if="activeTab === tab"
            class="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-brand rounded-full"
            aria-hidden="true"
          />
        </button>
      </div>

      <div class="mt-10">
        <!-- DEMO -->
        <div v-if="activeTab === 'Demo'" id="demo-panel" role="tabpanel">
          <div class="rounded-card border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-blue/10 p-6 md:p-8">
            <DemoRunner
              :type="demoConfig.type || 'store'"
              :slug="project.slug"
              :title="demoConfig.title"
              :note="demoConfig.note"
              :url="externalLive ? project.liveUrl : `/demo/${project.slug}`"
              :files="demoFiles"
            />
          </div>
        </div>

        <!-- OVERVIEW -->
        <div v-else-if="activeTab === 'Overview'" id="panel-Overview" role="tabpanel">
          <div class="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div class="space-y-4 text-[15px] leading-relaxed text-text-secondary">
              <template v-if="(detail?.overview as string | undefined)">
                <p v-for="(para, i) in (detail!.overview as string).split('\n\n')" :key="i">{{ para }}</p>
              </template>
              <p v-else>{{ project.description }}</p>
            </div>
            <div v-if="(detail?.featureHighlights as unknown[] | undefined)?.length" class="grid grid-cols-2 gap-4">
              <Reveal
                v-for="(f, i) in (detail!.featureHighlights as Array<{ icon: string; color: string; title: string; desc: string }>)"
                :key="f.title"
                class="card p-5"
                :delay="i * 60"
              >
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
            <Reveal
              v-for="(f, i) in (detail!.mainFeatures as Array<{ icon: string; color: string; title: string; desc: string }>)"
              :key="f.title"
              class="card p-6"
              :delay="(i % 3) * 60"
            >
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
              v-for="t in (detail!.techStack as string[])"
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
            <Reveal
              v-for="(p, i) in (detail!.process as Array<{ num: string; icon: string; title: string; desc: string }>)"
              :key="p.num"
              class="relative"
              :delay="i * 70"
            >
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
            <Reveal
              v-for="(c, i) in (detail!.challenges as Array<{ title: string; desc: string }>)"
              :key="c.title"
              class="card p-6"
              :delay="(i % 2) * 60"
            >
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
            <Reveal
              v-for="(r, i) in (detail!.results as Array<{ icon: string; value: string; label: string }>)"
              :key="r.label"
              class="card p-6 text-center"
              :delay="i * 70"
            >
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
            <Reveal
              v-for="(g, i) in gallery"
              :key="g.label"
              :class="i === 0 ? 'sm:col-span-2 lg:row-span-2' : ''"
              :delay="(i % 3) * 60"
            >
              <ProjectThumb :seed="g.seed" :label="g.label" :height="i === 0 ? 'h-full min-h-56' : 'h-44'" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mt-16 rounded-card border border-primary/25 bg-gradient-to-r from-primary/15 via-primary/5 to-blue/10 p-8 text-center md:p-12">
      <h2 class="text-2xl font-extrabold text-text md:text-3xl">{{ headings.ctaHead ?? 'Tertarik untuk bekerja sama?' }}</h2>
      <p class="mx-auto mt-3 max-w-md text-[15px] text-text-secondary">
        {{ headings.ctaDesc ?? 'Punya ide atau project yang ingin diwujudkan? Mari diskusikan dan bangun sesuatu yang hebat bersama.' }}
      </p>
      <div class="mt-7 flex flex-wrap justify-center gap-4">
        <NuxtLink to="/contact" class="btn-primary">{{ headings.contactMe ?? 'Hubungi Saya' }}</NuxtLink>
        <NuxtLink to="/projects" class="btn-outline">{{ headings.otherProjects ?? 'Lihat Project Lainnya' }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

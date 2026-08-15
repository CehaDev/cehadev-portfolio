<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch, computed } from 'vue'
import { LoaderCircle, Save, Plus, Trash2, ListChecks, GitBranch, Bug, BarChart3, Images, MonitorPlay, FileText, Settings2, Tags, Check, FileCode2, ChevronUp, ChevronDown } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'
import { CODE_LANGS, detectLangFromName } from '~/utils/demoCode'
import type { CodeFile } from '~/utils/demoCode'

interface LS {
  id: string
  en: string
}
interface FeatureItem {
  icon: string
  color: string
  title: LS
  desc: LS
}
interface ProcessItem {
  num: string
  icon: string
  title: LS
  desc: LS
}
interface ChallengeItem {
  title: LS
  desc: LS
}
interface ResultItem {
  icon: string
  value: LS
  label: LS
}
interface GalleryItem {
  label: LS
  seed: number
}
interface DetailState {
  overview: LS
  featureHighlights: FeatureItem[]
  mainFeatures: FeatureItem[]
  techStack: string[]
  process: ProcessItem[]
  challenges: ChallengeItem[]
  results: ResultItem[]
  gallery: GalleryItem[]
}

const props = withDefaults(
  defineProps<{
    initial?: Record<string, any>
    endpoint: string
    method?: 'POST' | 'PUT'
  }>(),
  { method: 'POST', initial: undefined }
)
const emit = defineEmits<{ saved: [data: Record<string, unknown>] }>()

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}
function ls(v: unknown): LS {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const o = v as Record<string, unknown>
    return { id: str(o.id), en: str(o.en) }
  }
  const s = str(v)
  return { id: s, en: s }
}

const initialDetail = props.initial?.detail ?? {}

const form = reactive({
  title: ls(props.initial?.title),
  slug: str(props.initial?.slug),
  tagline: ls(props.initial?.tagline),
  description: ls(props.initial?.description),
  category: ls(props.initial?.category),
  year: str(props.initial?.year) || String(new Date().getFullYear()),
  role: ls(props.initial?.role),
  duration: ls(props.initial?.duration),
  liveUrl: str(props.initial?.liveUrl),
  githubUrl: str(props.initial?.githubUrl),
  featured: Boolean(props.initial?.featured),
  archived: Boolean(props.initial?.archived),
  tags: (props.initial?.tags ?? []).map(ls),
  tech: [...(props.initial?.tech ?? [])]
})

const detail = reactive<DetailState>({
  overview: ls(initialDetail.overview),
  featureHighlights: (initialDetail.featureHighlights ?? []).map((f: any) => ({ icon: str(f?.icon) || 'Star', color: str(f?.color) || '#8B5CF6', title: ls(f?.title), desc: ls(f?.desc) })),
  mainFeatures: (initialDetail.mainFeatures ?? []).map((f: any) => ({ icon: str(f?.icon) || 'Star', color: str(f?.color) || '#8B5CF6', title: ls(f?.title), desc: ls(f?.desc) })),
  techStack: [...(initialDetail.techStack ?? [])],
  process: (initialDetail.process ?? []).map((p: any) => ({ num: str(p?.num), icon: str(p?.icon) || 'Code2', title: ls(p?.title), desc: ls(p?.desc) })),
  challenges: (initialDetail.challenges ?? []).map((c: any) => ({ title: ls(c?.title), desc: ls(c?.desc) })),
  results: (initialDetail.results ?? []).map((r: any) => ({ icon: str(r?.icon) || 'Activity', value: ls(r?.value), label: ls(r?.label) })),
  gallery: (initialDetail.gallery ?? []).map((g: any) => ({ label: ls(g?.label), seed: Number(g?.seed) || 1 }))
})

const initialDemo = props.initial?.demo ?? {}
const demo = reactive({
  enabled: Boolean(initialDemo.enabled),
  type: str(initialDemo.type) || 'studio',
  title: ls(initialDemo.title),
  note: ls(initialDemo.note),
  files: ((initialDemo.code as { files?: unknown[] } | undefined)?.files ?? []).map((f) => {
    const o = (f && typeof f === 'object' ? f : {}) as Record<string, unknown>
    return { name: str(o.name), language: str(o.language) || 'javascript', content: str(o.content) }
  }) as CodeFile[]
})

const demoTypeOptions = [
  { value: 'store', label: 'Toko Online (Cehava Store)', desc: 'Katalog, keranjang, & checkout' },
  { value: 'kanban', label: 'Kanban Board (Magerans)', desc: 'Manajemen tugas tim' },
  { value: 'dashboard', label: 'Dashboard Analitik (DevBoard)', desc: 'Metrik & grafik real-time' },
  { value: 'api', label: 'API Playground (NuTech API)', desc: 'Konsol REST API interaktif' },
  { value: 'todo', label: 'Task Manager (TaskFlow)', desc: 'Tugas harian gaya mobile' },
  { value: 'code', label: 'Code Viewer', desc: 'File kode berbagai bahasa pemrograman' },
  { value: 'studio', label: 'Studio Live Preview', desc: 'File tree + editor + hasil project berjalan (HTML/CSS/JS)' }
]

const activeFileIndex = ref(0)
const activeFile = computed(() => demo.files[activeFileIndex.value])

function ensureIndexHtmlFirst() {
  const idx = demo.files.findIndex((f) => f.name.trim().toLowerCase() === 'index.html')
  if (idx > 0) {
    const [f] = demo.files.splice(idx, 1)
    demo.files.unshift(f)
    activeFileIndex.value = 0
  }
}

function addDemoFile() {
  demo.files.push({ name: '', language: 'javascript', content: '' })
  activeFileIndex.value = demo.files.length - 1
  ensureIndexHtmlFirst()
}
function removeDemoFile(i: number) {
  demo.files.splice(i, 1)
  if (activeFileIndex.value >= demo.files.length) activeFileIndex.value = Math.max(0, demo.files.length - 1)
}
function moveDemoFile(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= demo.files.length) return
  const tmp = demo.files[i]
  demo.files[i] = demo.files[j]
  demo.files[j] = tmp
  activeFileIndex.value = j
}
function onFileNameChange(i: number) {
  const lang = detectLangFromName(demo.files[i].name)
  if (lang) demo.files[i].language = lang
  ensureIndexHtmlFirst()
}

const techKeys = Object.keys(techIcons)
const categoryOptions = ['Web App', 'E-Commerce', 'Dashboard', 'Mobile App', 'Backend API', 'Landing Page']
const iconOptions = ['Search', 'LayoutDashboard', 'MessageSquare', 'ShieldCheck', 'FolderKanban', 'Star', 'Bell', 'Users', 'FolderCheck', 'Activity', 'Code2', 'ClipboardList', 'PenTool', 'Rocket', 'Bug']

const error = ref('')
const saving = ref(false)

const sectionNav = [
  { id: 'pf-sec-basic', num: 1, label: 'Informasi Dasar' },
  { id: 'pf-sec-meta', num: 2, label: 'Metadata & Status' },
  { id: 'pf-sec-demo', num: 3, label: 'Demo Interaktif' },
  { id: 'pf-sec-content', num: 4, label: 'Konten & Tech' },
  { id: 'pf-sec-detail', num: 5, label: 'Detail Halaman' }
] as const
const activeSection = ref('pf-sec-basic')
let observer: IntersectionObserver | null = null

const sectionsFilled = computed<Record<string, boolean>>(() => ({
  'pf-sec-basic': Boolean(form.title.id.trim() || form.slug.trim()),
  'pf-sec-meta': Boolean(form.category.id.trim() || form.liveUrl.trim() || form.featured),
  'pf-sec-demo': demo.enabled,
  'pf-sec-content': form.tags.some(hasText) || form.tech.length > 0,
  'pf-sec-detail':
    Boolean(detail.overview.id.trim()) ||
    detail.featureHighlights.length > 0 ||
    detail.mainFeatures.length > 0 ||
    detail.techStack.length > 0 ||
    detail.process.length > 0 ||
    detail.challenges.length > 0 ||
    detail.results.length > 0 ||
    detail.gallery.length > 0
}))

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  ensureIndexHtmlFirst()
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) activeSection.value = visible[0].target.id
    },
    { rootMargin: '-12% 0px -68% 0px', threshold: [0, 0.1, 0.25, 0.5] }
  )
  sectionNav.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer!.observe(el)
  })
})
onBeforeUnmount(() => observer?.disconnect())

function cleanLs(v: LS): { id: string; en: string } {
  return { id: v.id.trim(), en: v.en.trim() }
}

function autoSlug() {
  if (!form.slug && form.title.id) {
    form.slug = form.title.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }
}
watch(() => form.title.id, () => autoSlug())

function toggleTech(key: string) {
  const i = form.tech.indexOf(key)
  if (i >= 0) form.tech.splice(i, 1)
  else form.tech.push(key)
}

function toggleStack(key: string) {
  const i = detail.techStack.indexOf(key)
  if (i >= 0) detail.techStack.splice(i, 1)
  else detail.techStack.push(key)
}

function validate() {
  if (!form.title.id.trim() || !form.slug.trim()) {
    error.value = 'Judul dan slug wajib diisi'
    return false
  }
  error.value = ''
  return true
}

function hasText(v: LS): boolean {
  return Boolean(v.id.trim() || v.en.trim())
}

function payload() {
  const d = detail
  const detailPayload = {
    overview: cleanLs(d.overview),
    featureHighlights: d.featureHighlights
      .map((f) => ({ icon: f.icon, color: f.color, title: cleanLs(f.title), desc: cleanLs(f.desc) }))
      .filter((f) => hasText(f.title)),
    mainFeatures: d.mainFeatures
      .map((f) => ({ icon: f.icon, color: f.color, title: cleanLs(f.title), desc: cleanLs(f.desc) }))
      .filter((f) => hasText(f.title)),
    techStack: d.techStack,
    process: d.process
      .map((p) => ({ num: p.num.trim(), icon: p.icon, title: cleanLs(p.title), desc: cleanLs(p.desc) }))
      .filter((p) => hasText(p.title)),
    challenges: d.challenges
      .map((c) => ({ title: cleanLs(c.title), desc: cleanLs(c.desc) }))
      .filter((c) => hasText(c.title)),
    results: d.results
      .map((r) => ({ icon: r.icon, value: cleanLs(r.value), label: cleanLs(r.label) }))
      .filter((r) => hasText(r.label)),
    gallery: d.gallery
      .map((g) => ({ label: cleanLs(g.label), seed: Number(g.seed) || 1 }))
      .filter((g) => hasText(g.label))
  }
  const hasDetail =
    hasText(detailPayload.overview) ||
    detailPayload.featureHighlights.length ||
    detailPayload.mainFeatures.length ||
    detailPayload.techStack.length ||
    detailPayload.process.length ||
    detailPayload.challenges.length ||
    detailPayload.results.length ||
    detailPayload.gallery.length

  return {
    title: cleanLs(form.title),
    slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''),
    tagline: cleanLs(form.tagline),
    description: cleanLs(form.description),
    category: cleanLs(form.category),
    year: form.year.trim(),
    role: cleanLs(form.role),
    duration: cleanLs(form.duration),
    liveUrl: form.liveUrl.trim(),
    githubUrl: form.githubUrl.trim(),
    featured: form.featured,
    archived: form.archived,
    demo: {
      enabled: demo.enabled,
      type: demo.type,
      title: cleanLs(demo.title),
      note: cleanLs(demo.note),
      ...(demo.type === 'code' || demo.type === 'studio'
        ? {
            code: {
              files: demo.files
                .map((f) => ({ name: f.name.trim(), language: f.language, content: f.content }))
                .filter((f) => f.name && f.content)
            }
          }
        : {})
    },
    tags: form.tags.map(cleanLs).filter(hasText),
    tech: form.tech,
    ...(hasDetail ? { detail: detailPayload } : {})
  }
}

function addItem<T>(list: T[], empty: () => T) {
  list.push(empty())
}
function removeItem<T>(list: T[], index: number) {
  list.splice(index, 1)
}
function emptyLS(): LS {
  return { id: '', en: '' }
}
function emptyFeature(): FeatureItem {
  return { icon: 'Star', color: '#8B5CF6', title: { id: '', en: '' }, desc: { id: '', en: '' } }
}
function emptyProcess(): ProcessItem {
  return { num: String(detail.process.length + 1).padStart(2, '0'), icon: 'Code2', title: { id: '', en: '' }, desc: { id: '', en: '' } }
}
function emptyChallenge(): ChallengeItem {
  return { title: { id: '', en: '' }, desc: { id: '', en: '' } }
}
function emptyResult(): ResultItem {
  return { icon: 'Activity', value: { id: '', en: '' }, label: { id: '', en: '' } }
}
function emptyGallery(): GalleryItem {
  return { label: { id: '', en: '' }, seed: 1 }
}

async function save() {
  if (saving.value || !validate()) return
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    const res = await $fetch<{ ok: boolean }>(props.endpoint, { method: props.method, body })
    if (res.ok) emit('saved', body)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal menyimpan, coba lagi'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form novalidate @submit.prevent="save">
    <div class="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
      <aside class="sticky top-24 mb-8 hidden lg:block" aria-label="Navigasi bagian form">
        <nav class="card space-y-1.5 p-4">
          <p class="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Isi Project</p>
          <button
            v-for="s in sectionNav"
            :key="s.id"
            type="button"
            class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium transition-colors"
            :class="activeSection === s.id ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:bg-card hover:text-text'"
            :aria-current="activeSection === s.id ? 'step' : undefined"
            @click="scrollToSection(s.id)"
          >
            <span
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              :class="activeSection === s.id ? 'bg-white/20 text-white' : sectionsFilled[s.id] ? 'bg-success/15 text-success' : 'bg-bg-alt text-text-muted'"
              aria-hidden="true"
            >
              <Check v-if="sectionsFilled[s.id] && activeSection !== s.id" :size="12" :stroke-width="2.5" />
              <template v-else>{{ s.num }}</template>
            </span>
            {{ s.label }}
          </button>
          <div class="flex flex-col items-stretch gap-1 pt-3">
            <button type="submit" class="btn-primary w-full !py-2.5" :disabled="saving">
              <LoaderCircle v-if="saving" :size="15" class="animate-spin" />
              <Save v-else :size="15" :stroke-width="2" />
              {{ saving ? 'Menyimpan...' : 'Simpan Project' }}
            </button>
            <span class="text-center text-[9px] text-text-muted">Simpan perubahan ke file JSON</span>
          </div>
        </nav>
      </aside>

      <div class="space-y-8">
    <div id="pf-sec-basic" class="card scroll-mt-24 p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <FileText :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Informasi Dasar
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 1</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Semua kolom teks dapat diisi dua bahasa. Kosongkan kolom EN agar otomatis memakai teks Indonesia.</p>
        </div>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Judul Project</label>
          <LocaleInput v-model="form.title" placeholder="Nama project" />
        </div>
        <div>
          <label for="pf-slug" class="mb-1.5 block text-sm font-medium text-text">Slug (URL)</label>
          <input id="pf-slug" v-model="form.slug" type="text" class="input-field" placeholder="nama-project" />
        </div>
        <div class="sm:col-span-2 xl:col-span-1">
          <label class="mb-1.5 block text-sm font-medium text-text">Tagline</label>
          <LocaleInput v-model="form.tagline" placeholder="Satu kalimat deskripsi singkat" />
        </div>
        <div class="sm:col-span-2 xl:col-span-3">
          <label class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
          <LocaleTextarea v-model="form.description" :rows="3" placeholder="Deskripsi project untuk kartu & halaman detail" />
        </div>
      </div>
    </div>

    <div id="pf-sec-meta" class="card scroll-mt-24 p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <Settings2 :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Metadata &amp; Status
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 2</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Kategori, tautan, dan status tampilan project.</p>
        </div>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div>
          <label for="pf-cat" class="mb-1.5 block text-sm font-medium text-text">Kategori</label>
          <select
            id="pf-cat"
            v-model="form.category.id"
            class="input-field"
            @change="form.category.en = form.category.id"
          >
            <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label for="pf-year" class="mb-1.5 block text-sm font-medium text-text">Tahun</label>
          <input id="pf-year" v-model="form.year" type="text" class="input-field" placeholder="2025" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Durasi</label>
          <LocaleInput v-model="form.duration" placeholder="3 Bulan" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Peran</label>
          <LocaleInput v-model="form.role" placeholder="Full-Stack Developer" />
        </div>
        <div class="lg:col-span-2 xl:col-span-2">
          <label for="pf-live" class="mb-1.5 block text-sm font-medium text-text">URL Live Demo</label>
          <input id="pf-live" v-model="form.liveUrl" type="url" class="input-field" placeholder="https://..." />
        </div>
        <div class="lg:col-span-2 xl:col-span-2">
          <label for="pf-gh" class="mb-1.5 block text-sm font-medium text-text">URL GitHub</label>
          <input id="pf-gh" v-model="form.githubUrl" type="url" class="input-field" placeholder="https://github.com/..." />
        </div>
        <div class="xl:col-span-2">
          <label for="pf-featured" class="mb-1.5 block text-sm font-medium text-text">Featured</label>
          <button
            id="pf-featured"
            type="button"
            role="switch"
            :aria-checked="form.featured"
            class="flex h-11 w-full items-center justify-between rounded-btn border px-4 text-sm font-medium transition-colors"
            :class="form.featured ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-bg text-text-secondary'"
            @click="form.featured = !form.featured"
          >
            {{ form.featured ? 'Ya, featured' : 'Tidak' }}
            <span class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" :class="form.featured ? 'bg-primary' : 'bg-border'">
              <span class="absolute h-3.5 w-3.5 rounded-full bg-white transition-all" :class="form.featured ? 'left-[18px]' : 'left-1'" />
            </span>
          </button>
        </div>
        <div class="xl:col-span-2">
          <label for="pf-archived" class="mb-1.5 block text-sm font-medium text-text">Arsip</label>
          <button
            id="pf-archived"
            type="button"
            role="switch"
            :aria-checked="form.archived"
            class="flex h-11 w-full items-center justify-between rounded-btn border px-4 text-sm font-medium transition-colors"
            :class="form.archived ? 'border-amber-400/50 bg-amber-400/10 text-amber-400' : 'border-border bg-bg text-text-secondary'"
            @click="form.archived = !form.archived"
          >
            {{ form.archived ? 'Ya, diarsipkan' : 'Tidak' }}
            <span class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" :class="form.archived ? 'bg-amber-400' : 'bg-border'">
              <span class="absolute h-3.5 w-3.5 rounded-full bg-white transition-all" :class="form.archived ? 'left-[18px]' : 'left-1'" />
            </span>
          </button>
        </div>
      </div>
    </div>

    <div id="pf-sec-demo" class="card scroll-mt-24 p-7">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <MonitorPlay :size="20" :stroke-width="1.75" />
          </span>
          <div>
            <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
              Demo Interaktif
              <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 3</span>
            </h3>
            <p class="mt-0.5 text-xs text-text-muted">Demo berjalan penuh di browser pengunjung (tanpa server tambahan). Aktifkan agar pengunjung bisa mencoba versi mini aplikasi langsung di halaman project.</p>
          </div>
        </div>
        <button
          id="pf-demo-enabled"
          type="button"
          role="switch"
          :aria-checked="demo.enabled"
          class="flex h-11 items-center gap-2 rounded-btn border px-4 text-sm font-medium transition-colors"
          :class="demo.enabled ? 'border-success/60 bg-success/10 text-success' : 'border-border bg-bg text-text-secondary'"
          @click="demo.enabled = !demo.enabled"
        >
          {{ demo.enabled ? 'Aktif' : 'Nonaktif' }}
          <span class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" :class="demo.enabled ? 'bg-success' : 'bg-border'">
            <span class="absolute h-3.5 w-3.5 rounded-full bg-white transition-all" :class="demo.enabled ? 'left-[18px]' : 'left-1'" />
          </span>
        </button>
      </div>
      <div class="grid gap-5 sm:grid-cols-2" :class="!demo.enabled ? 'pointer-events-none opacity-40' : ''">
        <div class="sm:col-span-2">
          <label for="pf-demo-type" class="mb-1.5 block text-sm font-medium text-text">Tipe Demo</label>
          <select id="pf-demo-type" v-model="demo.type" class="input-field">
            <option v-for="d in demoTypeOptions" :key="d.value" :value="d.value">
              {{ d.label }} — {{ d.desc }}
            </option>
          </select>
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-text">Judul Demo (opsional)</label>
          <LocaleInput v-model="demo.title" placeholder="Coba demo aplikasi ini" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-text">Catatan / Keterangan (opsional)</label>
          <LocaleInput v-model="demo.note" placeholder="Demo berjalan penuh di browser Anda." />
        </div>
        <div v-if="demo.type === 'code' || demo.type === 'studio'" class="sm:col-span-2">
          <div class="mb-3">
            <p class="text-sm font-medium text-text">File Kode</p>
            <p v-if="demo.type === 'studio'" class="mt-0.5 text-xs text-text-muted">Upload project web Anda (index.html + CSS + JS). Pengunjung bisa menjelajah file & melihat hasilnya berjalan langsung di Live Preview. Bahasa terdeteksi otomatis dari ekstensi file.</p>
            <p v-else class="mt-0.5 text-xs text-text-muted">Tampilkan potongan kode project dalam berbagai bahasa pemrograman. Bahasa terdeteksi otomatis dari ekstensi file.</p>
          </div>
          <div v-if="demo.files.length" class="overflow-hidden rounded-lg border border-border bg-bg">
            <div class="md:grid md:grid-cols-[230px_minmax(0,1fr)]">
              <div class="border-b border-border bg-card/50 md:border-b-0 md:border-r">
                <div class="flex items-center justify-between border-b border-border px-3 py-2.5">
                  <p class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    <FileCode2 :size="12" :stroke-width="2" aria-hidden="true" />
                    Explorer
                  </p>
                  <span class="rounded-full bg-bg-alt px-1.5 py-0.5 text-[10px] font-bold text-text-muted">{{ demo.files.length }} file</span>
                </div>
                <ul class="max-h-80 divide-y divide-border/40 overflow-y-auto">
                  <li v-for="(f, i) in demo.files" :key="i">
                    <div
                      class="group flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs transition-colors"
                      :class="activeFileIndex === i ? 'bg-primary/15 text-primary' : 'text-text-secondary hover:bg-card hover:text-text'"
                      @click="activeFileIndex = i"
                    >
                      <FileCode2 :size="13" :stroke-width="1.75" class="shrink-0" :class="activeFileIndex === i ? 'text-primary' : 'text-text-muted'" aria-hidden="true" />
                      <span class="min-w-0 flex-1 truncate font-mono">{{ f.name || `file-${i + 1}` }}</span>
                      <span class="hidden shrink-0 items-center gap-0.5 sm:flex">
                        <button
                          type="button"
                          class="rounded p-1 text-text-muted transition-colors hover:bg-bg-alt hover:text-text disabled:opacity-30"
                          :disabled="i === 0"
                          :aria-label="`Naikkan file ${f.name || i + 1}`"
                          title="Pindah ke atas"
                          @click.stop="moveDemoFile(i, -1)"
                        >
                          <ChevronUp :size="12" :stroke-width="2" />
                        </button>
                        <button
                          type="button"
                          class="rounded p-1 text-text-muted transition-colors hover:bg-bg-alt hover:text-text disabled:opacity-30"
                          :disabled="i === demo.files.length - 1"
                          :aria-label="`Turunkan file ${f.name || i + 1}`"
                          title="Pindah ke bawah"
                          @click.stop="moveDemoFile(i, 1)"
                        >
                          <ChevronDown :size="12" :stroke-width="2" />
                        </button>
                        <button
                          type="button"
                          class="rounded p-1 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          :aria-label="`Hapus file ${f.name || i + 1}`"
                          title="Hapus file"
                          @click.stop="removeDemoFile(i)"
                        >
                          <Trash2 :size="12" :stroke-width="1.75" />
                        </button>
                      </span>
                    </div>
                  </li>
                </ul>
                <div class="flex flex-col items-center gap-1 border-t border-border p-2.5">
                  <button type="button" class="btn-outline w-full !py-2 text-xs" @click="addDemoFile">
                    <Plus :size="14" :stroke-width="2" />
                    Tambah File
                  </button>
                  <span class="text-[9px] text-text-muted">Tambah file kode baru</span>
                </div>
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5">
                  <div class="min-w-0 flex-1">
                    <label :for="`pf-demo-file-name-${activeFileIndex}`" class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Nama File</label>
                    <input
                      :id="`pf-demo-file-name-${activeFileIndex}`"
                      v-model="activeFile.name"
                      type="text"
                      class="input-field w-full font-mono !py-2 !text-xs"
                      placeholder="src/middleware/auth.ts"
                      @change="onFileNameChange(activeFileIndex)"
                    />
                  </div>
                  <div class="w-40">
                    <label :for="`pf-demo-file-lang-${activeFileIndex}`" class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Bahasa</label>
                    <select :id="`pf-demo-file-lang-${activeFileIndex}`" v-model="activeFile.language" class="input-field w-full !py-2 !text-xs">
                      <option v-for="l in CODE_LANGS" :key="l.id" :value="l.id">{{ l.label }}</option>
                    </select>
                  </div>
                </div>
                <textarea
                  :key="activeFileIndex"
                  v-model="activeFile.content"
                  rows="10"
                  spellcheck="false"
                  class="block w-full resize-y px-4 py-3 font-mono !text-xs text-text placeholder:text-text-muted focus:outline-none"
                  placeholder="Tulis kode di sini..."
                ></textarea>
              </div>
            </div>
          </div>
          <p v-else class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-xs text-text-muted">
            Belum ada file kode. Klik "Tambah File" untuk menambahkan.
          </p>
        </div>
      </div>
    </div>

    <div id="pf-sec-content" class="card scroll-mt-24 p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <Tags :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Konten &amp; Tech
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 4</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Label project dan teknologi yang dipakai.</p>
        </div>
      </div>
      <div>
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm font-medium text-text">Tags (kategori / label project)</p>
          <div class="flex flex-col items-end gap-1">
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.tags, emptyLS)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
            <span class="text-[9px] text-text-muted">Tambah tag baru</span>
          </div>
        </div>
        <ul class="space-y-2">
          <li v-for="(tag, i) in form.tags" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-2.5">
            <div class="min-w-0 flex-1">
              <LocaleInput v-model="form.tags[i]" placeholder="Nama tag..." />
            </div>
            <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus tag ${Number(i) + 1}`" @click="removeItem(form.tags, Number(i))">
              <Trash2 :size="14" :stroke-width="1.5" />
            </button>
          </li>
          <p v-if="!form.tags.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
            Belum ada tag. Klik "Tambah" untuk menambahkan.
          </p>
        </ul>
      </div>

      <div class="mt-6">
        <p class="mb-3 text-sm font-medium text-text">Tech Stack</p>
        <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <button
            v-for="key in techKeys"
            :key="key"
            type="button"
            class="flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
            :class="form.tech.includes(key) ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-bg text-text-secondary hover:border-primary/40'"
            @click="toggleTech(key)"
          >
            <span class="flex h-6 w-6 items-center justify-center rounded bg-bg-alt text-[9px] font-bold" :style="`color: ${techIcons[key].color}`" aria-hidden="true">
              {{ techIcons[key].glyph }}
            </span>
            {{ techIcons[key].name }}
          </button>
        </div>
      </div>
    </div>

    <div id="pf-sec-detail" class="card scroll-mt-24 p-7">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <ListChecks :size="20" :stroke-width="1.75" />
          </span>
          <div>
            <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
              Konten Detail Halaman
              <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 5</span>
            </h3>
            <p class="mt-0.5 text-xs text-text-muted">Konten tab Overview, Fitur, Teknologi, Proses, Tantangan, Hasil, dan Galeri pada halaman detail project.</p>
          </div>
        </div>
      </div>

      <div class="grid gap-5">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Overview (paragraf dipisah baris kosong)</label>
          <LocaleTextarea v-model="detail.overview" :rows="5" placeholder="Deskripsi panjang untuk tab Overview. Gunakan baris kosong untuk membuat paragraf baru." />
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Feature Highlights (tab Overview)</p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.featureHighlights, emptyFeature)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah highlight</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(f, i) in detail.featureHighlights" :key="i" class="rounded-lg border border-border bg-bg p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Highlight {{ i + 1 }}</span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(detail.featureHighlights, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <div class="grid gap-3 sm:grid-cols-3">
                <div>
                  <label :for="`pf-fh-icon-${i}`" class="mb-1 block text-xs font-medium text-text">Ikon</label>
                  <select :id="`pf-fh-icon-${i}`" v-model="f.icon" class="input-field !py-2">
                    <option v-for="ic in iconOptions" :key="ic" :value="ic">{{ ic }}</option>
                  </select>
                </div>
                <div>
                  <label :for="`pf-fh-color-${i}`" class="mb-1 block text-xs font-medium text-text">Warna</label>
                  <input :id="`pf-fh-color-${i}`" v-model="f.color" type="color" class="h-11 w-full cursor-pointer rounded-btn border border-border bg-bg p-1" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Judul</label>
                  <LocaleInput :id="`pf-fh-title-${i}`" v-model="f.title" placeholder="Pencarian Cepat" />
                </div>
                <div class="sm:col-span-3">
                  <label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>
                  <LocaleInput :id="`pf-fh-desc-${i}`" v-model="f.desc" placeholder="Deskripsi singkat fitur" />
                </div>
              </div>
            </div>
            <p v-if="!detail.featureHighlights.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada feature highlight.
            </p>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Main Features (tab Fitur)</p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.mainFeatures, emptyFeature)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah fitur</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(f, i) in detail.mainFeatures" :key="i" class="rounded-lg border border-border bg-bg p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Fitur {{ i + 1 }}</span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(detail.mainFeatures, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <div class="grid gap-3 sm:grid-cols-3">
                <div>
                  <label :for="`pf-mf-icon-${i}`" class="mb-1 block text-xs font-medium text-text">Ikon</label>
                  <select :id="`pf-mf-icon-${i}`" v-model="f.icon" class="input-field !py-2">
                    <option v-for="ic in iconOptions" :key="ic" :value="ic">{{ ic }}</option>
                  </select>
                </div>
                <div>
                  <label :for="`pf-mf-color-${i}`" class="mb-1 block text-xs font-medium text-text">Warna</label>
                  <input :id="`pf-mf-color-${i}`" v-model="f.color" type="color" class="h-11 w-full cursor-pointer rounded-btn border border-border bg-bg p-1" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Judul</label>
                  <LocaleInput :id="`pf-mf-title-${i}`" v-model="f.title" placeholder="Dashboard Intuitif" />
                </div>
                <div class="sm:col-span-3">
                  <label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>
                  <LocaleInput :id="`pf-mf-desc-${i}`" v-model="f.desc" placeholder="Deskripsi singkat fitur" />
                </div>
              </div>
            </div>
            <p v-if="!detail.mainFeatures.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada fitur utama.
            </p>
          </div>
        </div>

        <div>
          <p class="mb-3 text-sm font-medium text-text">Tech Stack Detail (tab Teknologi)</p>
          <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            <button
              v-for="key in techKeys"
              :key="key"
              type="button"
              class="flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors"
              :class="detail.techStack.includes(key) ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border bg-bg text-text-secondary hover:border-primary/40'"
              @click="toggleStack(key)"
            >
              <span class="flex h-6 w-6 items-center justify-center rounded bg-bg-alt text-[9px] font-bold" :style="`color: ${techIcons[key].color}`" aria-hidden="true">
                {{ techIcons[key].glyph }}
              </span>
              {{ techIcons[key].name }}
            </button>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="flex items-center gap-2 text-sm font-medium text-text">
              <GitBranch :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Proses (tab Proses)
            </p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.process, emptyProcess)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah langkah</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(p, i) in detail.process" :key="i" class="rounded-lg border border-border bg-bg p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Langkah {{ p.num || i + 1 }}</span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(detail.process, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <div class="grid gap-3 sm:grid-cols-4">
                <div>
                  <label :for="`pf-pr-num-${i}`" class="mb-1 block text-xs font-medium text-text">Nomor</label>
                  <input :id="`pf-pr-num-${i}`" v-model="p.num" type="text" class="input-field !py-2" placeholder="01" />
                </div>
                <div>
                  <label :for="`pf-pr-icon-${i}`" class="mb-1 block text-xs font-medium text-text">Ikon</label>
                  <select :id="`pf-pr-icon-${i}`" v-model="p.icon" class="input-field !py-2">
                    <option v-for="ic in iconOptions" :key="ic" :value="ic">{{ ic }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-medium text-text">Judul</label>
                  <LocaleInput :id="`pf-pr-title-${i}`" v-model="p.title" placeholder="Perencanaan" />
                </div>
                <div class="sm:col-span-4">
                  <label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>
                  <LocaleInput :id="`pf-pr-desc-${i}`" v-model="p.desc" placeholder="Deskripsi langkah" />
                </div>
              </div>
            </div>
            <p v-if="!detail.process.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada langkah proses.
            </p>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="flex items-center gap-2 text-sm font-medium text-text">
              <Bug :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Tantangan (tab Tantangan)
            </p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.challenges, emptyChallenge)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah tantangan</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(c, i) in detail.challenges" :key="i" class="rounded-lg border border-border bg-bg p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Tantangan {{ i + 1 }}</span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(detail.challenges, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <div class="grid gap-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Judul</label>
                  <LocaleInput :id="`pf-ch-title-${i}`" v-model="c.title" placeholder="Sinkronisasi data real-time" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Deskripsi</label>
                  <LocaleTextarea :id="`pf-ch-desc-${i}`" v-model="c.desc" :rows="2" placeholder="Deskripsi tantangan dan solusinya..." />
                </div>
              </div>
            </div>
            <p v-if="!detail.challenges.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada tantangan.
            </p>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="flex items-center gap-2 text-sm font-medium text-text">
              <BarChart3 :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Hasil (tab Hasil)
            </p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.results, emptyResult)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah hasil</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(r, i) in detail.results" :key="i" class="rounded-lg border border-border bg-bg p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Hasil {{ i + 1 }}</span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(detail.results, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <div class="grid gap-3 sm:grid-cols-3">
                <div>
                  <label :for="`pf-rs-icon-${i}`" class="mb-1 block text-xs font-medium text-text">Ikon</label>
                  <select :id="`pf-rs-icon-${i}`" v-model="r.icon" class="input-field !py-2">
                    <option v-for="ic in iconOptions" :key="ic" :value="ic">{{ ic }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Nilai</label>
                  <LocaleInput :id="`pf-rs-value-${i}`" v-model="r.value" placeholder="500+" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Label</label>
                  <LocaleInput :id="`pf-rs-label-${i}`" v-model="r.label" placeholder="Pengguna Aktif" />
                </div>
              </div>
            </div>
            <p v-if="!detail.results.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada hasil.
            </p>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="flex items-center gap-2 text-sm font-medium text-text">
              <Images :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Galeri (tab Galeri)
            </p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.gallery, emptyGallery)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah item</span>
            </div>
          </div>
          <div class="space-y-3">
            <div v-for="(g, i) in detail.gallery" :key="i" class="rounded-lg border border-border bg-bg p-3">
              <div class="mb-3 flex items-center gap-3">
                <span class="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border">
                  <ProjectThumb :seed="g.seed || 1" :label="g.label.id || 'Galeri'" height="h-10" />
                </span>
                <button type="button" class="ml-auto shrink-0 rounded-lg border border-red-500/30 p-2 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus galeri ${i + 1}`" @click="removeItem(detail.gallery, i)">
                  <Trash2 :size="14" :stroke-width="1.5" />
                </button>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Label</label>
                  <LocaleInput :id="`pf-gl-label-${i}`" v-model="g.label" placeholder="Label galeri" />
                </div>
                <div>
                  <label :for="`pf-gl-seed-${i}`" class="mb-1 block text-xs font-medium text-text">Seed</label>
                  <input :id="`pf-gl-seed-${i}`" v-model.number="g.seed" type="number" class="input-field !py-2" placeholder="Seed" />
                </div>
              </div>
            </div>
            <p v-if="!detail.gallery.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada item galeri.
            </p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="sticky bottom-4 z-20 rounded-card border border-border bg-card/95 p-4 shadow-card backdrop-blur lg:static lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
      <div class="flex flex-wrap items-center justify-end gap-6">
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/admin/projects" class="btn-outline">Batal</NuxtLink>
          <span class="text-[9px] text-text-muted">Batalkan &amp; kembali</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <button type="submit" class="btn-primary" :disabled="saving">
            <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
            <Save v-else :size="16" :stroke-width="2" />
            {{ saving ? 'Menyimpan...' : 'Simpan Project' }}
          </button>
          <span class="text-[9px] text-text-muted">Simpan perubahan ke file JSON</span>
        </div>
      </div>
    </div>
      </div>
    </div>
  </form>
</template>

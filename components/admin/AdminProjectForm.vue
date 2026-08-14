<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { LoaderCircle, Save, Plus, Trash2, Layers, ListChecks, GitBranch, Bug, BarChart3, Images } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

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

const techKeys = Object.keys(techIcons)
const categoryOptions = ['Web App', 'E-Commerce', 'Dashboard', 'Mobile App', 'Backend API', 'Landing Page']
const iconOptions = ['Search', 'LayoutDashboard', 'MessageSquare', 'ShieldCheck', 'FolderKanban', 'Star', 'Bell', 'Users', 'FolderCheck', 'Activity', 'Code2', 'ClipboardList', 'PenTool', 'Rocket', 'Bug']

const error = ref('')
const saving = ref(false)

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
  <form class="space-y-8" novalidate @submit.prevent="save">
    <div class="card p-7">
      <div class="mb-5 flex items-center gap-2">
        <Layers :size="16" :stroke-width="2" class="text-primary" />
        <h3 class="text-base font-bold text-text">Informasi Dasar</h3>
      </div>
      <p class="mb-5 text-xs text-text-muted">Semua kolom teks dapat diisi dua bahasa. Kosongkan kolom EN agar otomatis memakai teks Indonesia.</p>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Judul Project</label>
          <LocaleInput v-model="form.title" placeholder="Nama project" />
        </div>
        <div>
          <label for="pf-slug" class="mb-1.5 block text-sm font-medium text-text">Slug (URL)</label>
          <input id="pf-slug" v-model="form.slug" type="text" class="input-field" placeholder="nama-project" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-text">Tagline</label>
          <LocaleInput v-model="form.tagline" placeholder="Satu kalimat deskripsi singkat" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
          <LocaleTextarea v-model="form.description" :rows="3" placeholder="Deskripsi project untuk kartu & halaman detail" />
        </div>
      </div>
    </div>

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Metadata</h3>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <div class="lg:col-span-2">
          <label for="pf-live" class="mb-1.5 block text-sm font-medium text-text">URL Live Demo</label>
          <input id="pf-live" v-model="form.liveUrl" type="url" class="input-field" placeholder="https://..." />
        </div>
        <div class="lg:col-span-2">
          <label for="pf-gh" class="mb-1.5 block text-sm font-medium text-text">URL GitHub</label>
          <input id="pf-gh" v-model="form.githubUrl" type="url" class="input-field" placeholder="https://github.com/..." />
        </div>
        <div>
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
        <div>
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

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Konten</h3>
      <div>
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm font-medium text-text">Tags (kategori / label project)</p>
          <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.tags, emptyLS)">
            <Plus :size="14" :stroke-width="2" />
            Tambah
          </button>
        </div>
        <ul class="space-y-2">
          <li v-for="(tag, i) in form.tags" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-2.5">
            <div class="min-w-0 flex-1">
              <LocaleInput v-model="form.tags[i]" placeholder="Nama tag..." />
            </div>
            <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus tag ${i + 1}`" @click="removeItem(form.tags, i)">
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
        <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
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

    <div class="card p-7">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 class="flex items-center gap-2 text-base font-bold text-text">
            <ListChecks :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Konten Detail Halaman
          </h3>
          <p class="mt-1 text-sm text-text-secondary">Konten tab Overview, Fitur, Teknologi, Proses, Tantangan, Hasil, dan Galeri pada halaman detail project.</p>
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
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.featureHighlights, emptyFeature)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
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
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.mainFeatures, emptyFeature)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
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
          <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
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
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.process, emptyProcess)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
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
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.challenges, emptyChallenge)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
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
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.results, emptyResult)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
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
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(detail.gallery, emptyGallery)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
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

    <div class="flex items-center justify-end gap-3">
      <NuxtLink to="/admin/projects" class="btn-outline">Batal</NuxtLink>
      <button type="submit" class="btn-primary" :disabled="saving">
        <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" :stroke-width="2" />
        {{ saving ? 'Menyimpan...' : 'Simpan Project' }}
      </button>
    </div>
  </form>
</template>

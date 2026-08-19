<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Trash2, LoaderCircle, Save, Languages, Sparkles, User, BarChart3, Mail, FolderKanban, HelpCircle, MessageSquareQuote, Search, Quote, CheckSquare } from 'lucide-vue-next'

interface LS {
  id: string
  en: string
}
interface StatItem {
  icon: string
  label: LS
  sub: LS
  end: number
  suffix: LS
}
interface FaqItem {
  q: LS
  a: LS
}
interface ProjectStatItem {
  icon: string
  label: LS
  value: LS
}

const props = defineProps<{
  initial?: Record<string, any>
}>()

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
function lsList(v: unknown): LS[] {
  return Array.isArray(v) ? v.map((x) => ls(x)) : []
}
function toStats(v: unknown): StatItem[] {
  return Array.isArray(v)
    ? v.map((s) => {
        const o = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>
        return { icon: str(o.icon), label: ls(o.label), sub: ls(o.sub), end: Number(o.end) || 0, suffix: ls(o.suffix) }
      })
    : []
}
function toProjectStats(v: unknown): ProjectStatItem[] {
  return Array.isArray(v)
    ? v.map((s) => {
        const o = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>
        return { icon: str(o.icon), label: ls(o.label), value: ls(o.value) }
      })
    : []
}
function toFaqs(v: unknown): FaqItem[] {
  return Array.isArray(v)
    ? v.map((f) => {
        const o = (f && typeof f === 'object' ? f : {}) as Record<string, unknown>
        return { q: ls(o.q), a: ls(o.a) }
      })
    : []
}

const form = reactive({
  name: str(props.initial?.name),
  role: ls(props.initial?.role),
  heroBadge: ls(props.initial?.heroBadge),
  heroTitle1: ls(props.initial?.heroTitle1),
  heroTitleGradient: ls(props.initial?.heroTitleGradient),
  heroSubtitle: ls(props.initial?.heroSubtitle),
  heroDescription: ls(props.initial?.heroDescription),
  aboutIntro: lsList(props.initial?.aboutIntro),
  aboutChecklist: lsList(props.initial?.aboutChecklist),
  quote: ls(props.initial?.quote),
  quoteHighlight: ls(props.initial?.quoteHighlight),
  stats: toStats(props.initial?.stats),
  email: str(props.initial?.email),
  phone: str(props.initial?.phone),
  location: ls(props.initial?.location),
  website: str(props.initial?.website),
  cvUrl: str(props.initial?.cvUrl),
  socials: {
    github: str(props.initial?.socials?.github),
    linkedin: str(props.initial?.socials?.linkedin),
    instagram: str(props.initial?.socials?.instagram)
  },
  projectStats: toProjectStats(props.initial?.projectStats),
  faqs: toFaqs(props.initial?.faqs),
  headings: reactive(props.initial?.headings ?? {}),
  seo: reactive(props.initial?.seo ?? {})
})

const error = ref('')
const saving = ref(false)

function cleanLs(v: LS): { id: string; en: string } {
  return { id: v.id.trim(), en: v.en.trim() }
}

function emptyStat(): StatItem {
  return { icon: 'Activity', label: { id: '', en: '' }, sub: { id: '', en: '' }, end: 0, suffix: { id: '+', en: '+' } }
}
function emptyFaq(): FaqItem {
  return { q: { id: '', en: '' }, a: { id: '', en: '' } }
}
function emptyProjectStat(): ProjectStatItem {
  return { icon: 'FolderKanban', label: { id: '', en: '' }, value: { id: '', en: '' } }
}
function emptyParagraph(): LS {
  return { id: '', en: '' }
}
function addItem<T>(list: T[], empty: () => T) {
  list.push(empty())
}
function removeItem<T>(list: T[], index: number) {
  list.splice(index, 1)
}

function addKey(parent: Record<string, unknown>) {
  const key = window.prompt('Nama key (contoh: home)')?.trim()
  if (key && !(key in parent)) {
    parent[key] = { id: '', en: '' }
  }
}

function validate() {
  if (!form.name.trim()) {
    error.value = 'Nama website wajib diisi'
    return false
  }
  error.value = ''
  return true
}

function payload() {
  return {
    name: form.name.trim(),
    role: cleanLs(form.role),
    heroBadge: cleanLs(form.heroBadge),
    heroTitle1: cleanLs(form.heroTitle1),
    heroTitleGradient: cleanLs(form.heroTitleGradient),
    heroSubtitle: cleanLs(form.heroSubtitle),
    heroDescription: cleanLs(form.heroDescription),
    aboutIntro: form.aboutIntro.map(cleanLs).filter((i) => i.id || i.en),
    aboutChecklist: form.aboutChecklist.map(cleanLs).filter((i) => i.id || i.en),
    quote: cleanLs(form.quote),
    quoteHighlight: cleanLs(form.quoteHighlight),
    stats: form.stats
      .map((s) => ({
        icon: s.icon.trim(),
        label: cleanLs(s.label),
        sub: cleanLs(s.sub),
        end: Number(s.end) || 0,
        suffix: cleanLs(s.suffix)
      }))
      .filter((s) => s.label.id || s.label.en),
    email: form.email.trim(),
    phone: form.phone.trim(),
    location: cleanLs(form.location),
    website: form.website.trim(),
    cvUrl: form.cvUrl.trim(),
    socials: {
      github: form.socials.github.trim(),
      linkedin: form.socials.linkedin.trim(),
      instagram: form.socials.instagram.trim()
    },
    projectStats: form.projectStats
      .map((s) => ({
        icon: s.icon.trim(),
        label: cleanLs(s.label),
        value: cleanLs(s.value)
      }))
      .filter((s) => s.label.id || s.label.en),
    faqs: form.faqs
      .map((f) => ({ q: cleanLs(f.q), a: cleanLs(f.a) }))
      .filter((f) => f.q.id || f.q.en),
    headings: form.headings,
    seo: form.seo
  }
}

async function save() {
  if (saving.value || !validate()) return
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    const res = await $fetch<{ ok: boolean }>('/api/admin/site', { method: 'PUT', body })
    if (res.ok) emit('saved', body)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal menyimpan pengaturan, coba lagi'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="space-y-6" novalidate @submit.prevent="save">
    <!-- Hero & Identitas — full width -->
    <div class="card overflow-hidden p-0">
      <div class="relative overflow-hidden border-b border-border px-7 py-6">
        <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div class="relative flex items-center gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Sparkles :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h3 class="text-base font-bold text-text">Identitas & Hero</h3>
            <p class="mt-1 text-xs text-text-muted">Nama, badge, judul hero, dan deskripsi. Semua kolom mendukung dua bahasa (ID / EN).</p>
          </div>
        </div>
      </div>
      <div class="grid gap-6 p-7 lg:grid-cols-2">
        <div class="lg:col-span-2">
          <label for="site-name" class="mb-1.5 block text-sm font-medium text-text">Nama / Brand</label>
          <input id="site-name" v-model="form.name" type="text" class="input-field" placeholder="CehaDev" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Role / Profesi</label>
          <LocaleInput v-model="form.role" placeholder="Web Developer & Tech Enthusiast" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Badge Hero</label>
          <LocaleInput v-model="form.heroBadge" placeholder="Available for collaboration" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Teks Hero (sebelum gradient)</label>
          <LocaleInput v-model="form.heroTitle1" placeholder="Hi, I'm" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Teks Hero Gradient</label>
          <LocaleInput v-model="form.heroTitleGradient" placeholder="CehaDev" />
        </div>
        <div class="lg:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-text">Subtitle Hero</label>
          <LocaleInput v-model="form.heroSubtitle" placeholder="Web Developer & Tech Enthusiast" />
        </div>
        <div class="lg:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-text">Deskripsi Hero</label>
          <LocaleTextarea v-model="form.heroDescription" :rows="3" placeholder="Deskripsi singkat di bagian hero..." />
        </div>
      </div>
    </div>

    <!-- Tentang — full width -->
    <div class="card overflow-hidden p-0">
      <div class="relative overflow-hidden border-b border-border px-7 py-6">
        <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl" aria-hidden="true" />
        <div class="relative flex items-center gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white" aria-hidden="true">
            <User :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h3 class="text-base font-bold text-text">Tentang</h3>
            <p class="mt-1 text-xs text-text-muted">Paragraf pengenalan, poin checklist, dan kutipan profil.</p>
          </div>
        </div>
      </div>
      <div class="space-y-6 p-7">
        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text flex items-center gap-2">
              <MessageSquareQuote :size="14" class="text-primary" />
              Paragraf Pengantar
            </p>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.aboutIntro, emptyParagraph)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(p, i) in form.aboutIntro" :key="i" class="rounded-xl border border-border bg-bg p-4">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Paragraf {{ i + 1 }}</span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.aboutIntro, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <LocaleTextarea v-model="form.aboutIntro[i]" :rows="3" placeholder="Tulis paragraf..." />
            </div>
            <p v-if="!form.aboutIntro.length" class="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada paragraf. Klik "Tambah" untuk menambahkan.
            </p>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text flex items-center gap-2">
              <CheckSquare :size="14" class="text-primary" />
              Checklist Tentang
            </p>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.aboutChecklist, emptyParagraph)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
          <ul class="space-y-2">
            <li v-for="(item, i) in form.aboutChecklist" :key="i" class="flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-2.5">
              <div class="min-w-0 flex-1">
                <LocaleInput v-model="form.aboutChecklist[i]" placeholder="Tulis poin checklist..." />
              </div>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus poin ${i + 1}`" @click="removeItem(form.aboutChecklist, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </li>
            <p v-if="!form.aboutChecklist.length" class="rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada poin checklist.
            </p>
          </ul>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-text flex items-center gap-2">
              <Quote :size="14" class="text-primary" />
              Kutipan
            </label>
            <LocaleInput v-model="form.quote" placeholder="Code is not just about how it works..." />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-text flex items-center gap-2">
              <Quote :size="14" class="text-primary" />
              Kutipan (highlight)
            </label>
            <LocaleInput v-model="form.quoteHighlight" placeholder="how it's built." />
          </div>
        </div>
      </div>
    </div>

    <!-- Statistik & Kontak — 2 column -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Statistik Beranda -->
      <div class="card overflow-hidden p-0">
        <div class="relative overflow-hidden border-b border-border px-7 py-6">
          <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true" />
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-lime-600 text-white" aria-hidden="true">
                <BarChart3 :size="22" :stroke-width="1.75" />
              </span>
              <div>
                <h3 class="text-base font-bold text-text">Statistik Beranda</h3>
                <p class="mt-1 text-xs text-text-muted">Ikon: Clock, FolderGit2, Code2, Target</p>
              </div>
            </div>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.stats, emptyStat)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
        </div>
        <div class="space-y-4 p-7">
          <div v-for="(s, i) in form.stats" :key="i" class="rounded-xl border border-border bg-bg p-5">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Statistik {{ i + 1 }}</span>
              <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.stats, i)">
                <Trash2 :size="12" :stroke-width="1.5" />
                Hapus
              </button>
            </div>
            <div class="grid gap-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label :for="`site-stat-icon-${i}`" class="mb-1.5 block text-sm font-medium text-text">Ikon</label>
                  <input :id="`site-stat-icon-${i}`" v-model="s.icon" type="text" class="input-field" placeholder="Activity / Clock / Code2" />
                </div>
                <div>
                  <label :for="`site-stat-end-${i}`" class="mb-1.5 block text-sm font-medium text-text">Angka Akhir</label>
                  <input :id="`site-stat-end-${i}`" v-model.number="s.end" type="number" class="input-field" placeholder="2" />
                </div>
              </div>
              <div>
                <label :for="`site-stat-label-${i}`" class="mb-1.5 block text-sm font-medium text-text">Label</label>
                <LocaleInput :id="`site-stat-label-${i}`" v-model="s.label" placeholder="Years" />
              </div>
              <div>
                <label :for="`site-stat-sub-${i}`" class="mb-1.5 block text-sm font-medium text-text">Sub</label>
                <LocaleInput :id="`site-stat-sub-${i}`" v-model="s.sub" placeholder="Learning & Building" />
              </div>
              <div>
                <label :for="`site-stat-suffix-${i}`" class="mb-1.5 block text-sm font-medium text-text">Sufiks</label>
                <LocaleInput :id="`site-stat-suffix-${i}`" v-model="s.suffix" placeholder="+" />
              </div>
            </div>
          </div>
          <p v-if="!form.stats.length" class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
            Belum ada statistik. Klik "Tambah" untuk menambahkan.
          </p>
        </div>
      </div>

      <!-- Kontak & Sosial -->
      <div class="card overflow-hidden p-0">
        <div class="relative overflow-hidden border-b border-border px-7 py-6">
          <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true" />
          <div class="relative flex items-center gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white" aria-hidden="true">
              <Mail :size="22" :stroke-width="1.75" />
            </span>
            <div>
              <h3 class="text-base font-bold text-text">Kontak & Sosial</h3>
              <p class="mt-1 text-xs text-text-muted">Email, telepon, lokasi, dan tautan media sosial.</p>
            </div>
          </div>
        </div>
        <div class="space-y-5 p-7">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="site-email" class="mb-1.5 block text-sm font-medium text-text">Email</label>
              <input id="site-email" v-model="form.email" type="email" class="input-field" placeholder="hello@cehadev.id" />
            </div>
            <div>
              <label for="site-phone" class="mb-1.5 block text-sm font-medium text-text">Telepon</label>
              <input id="site-phone" v-model="form.phone" type="text" class="input-field" placeholder="+62 812-3456-7890" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Lokasi</label>
              <LocaleInput v-model="form.location" placeholder="Wirosari, Grobogan, Jawa Tengah" />
            </div>
            <div>
              <label for="site-website" class="mb-1.5 block text-sm font-medium text-text">Website</label>
              <input id="site-website" v-model="form.website" type="text" class="input-field" placeholder="cehadev.id" />
            </div>
            <div>
              <label for="site-cv-url" class="mb-1.5 block text-sm font-medium text-text">URL CV</label>
              <input id="site-cv-url" v-model="form.cvUrl" type="text" class="input-field" placeholder="/cv" />
            </div>
          </div>
          <div class="rounded-xl border border-border bg-bg p-4 space-y-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-text-muted">Media Sosial</p>
            <div>
              <label for="site-social-github" class="mb-1.5 block text-sm font-medium text-text">GitHub</label>
              <input id="site-social-github" v-model="form.socials.github" type="url" class="input-field" placeholder="https://github.com/..." />
            </div>
            <div>
              <label for="site-social-linkedin" class="mb-1.5 block text-sm font-medium text-text">LinkedIn</label>
              <input id="site-social-linkedin" v-model="form.socials.linkedin" type="url" class="input-field" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label for="site-social-instagram" class="mb-1.5 block text-sm font-medium text-text">Instagram</label>
              <input id="site-social-instagram" v-model="form.socials.instagram" type="url" class="input-field" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Stats & FAQ — 2 column -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Statistik Halaman Project -->
      <div class="card overflow-hidden p-0">
        <div class="relative overflow-hidden border-b border-border px-7 py-6">
          <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl" aria-hidden="true" />
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white" aria-hidden="true">
                <FolderKanban :size="22" :stroke-width="1.75" />
              </span>
              <div>
                <h3 class="text-base font-bold text-text">Statistik Project</h3>
                <p class="mt-1 text-xs text-text-muted">4 kartu di halaman project</p>
              </div>
            </div>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.projectStats, emptyProjectStat)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
        </div>
        <div class="space-y-4 p-7">
          <div v-for="(s, i) in form.projectStats" :key="i" class="rounded-xl border border-border bg-bg p-5">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Kartu {{ i + 1 }}</span>
              <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.projectStats, i)">
                <Trash2 :size="12" :stroke-width="1.5" />
                Hapus
              </button>
            </div>
            <div class="grid gap-4">
              <div>
                <label :for="`site-ps-icon-${i}`" class="mb-1.5 block text-sm font-medium text-text">Ikon</label>
                <select :id="`site-ps-icon-${i}`" v-model="s.icon" class="input-field">
                  <option value="FolderKanban">FolderKanban</option>
                  <option value="Tag">Tag</option>
                  <option value="CalendarRange">CalendarRange</option>
                  <option value="Code2">Code2</option>
                </select>
              </div>
              <div>
                <label :for="`site-ps-label-${i}`" class="mb-1.5 block text-sm font-medium text-text">Label</label>
                <LocaleInput :id="`site-ps-label-${i}`" v-model="s.label" placeholder="Project" />
              </div>
              <div>
                <label :for="`site-ps-value-${i}`" class="mb-1.5 block text-sm font-medium text-text">Nilai</label>
                <LocaleInput :id="`site-ps-value-${i}`" v-model="s.value" placeholder="6" />
              </div>
            </div>
          </div>
          <p v-if="!form.projectStats.length" class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
            Belum ada kartu statistik. Jika kosong, nilai otomatis dihitung dari data project.
          </p>
        </div>
      </div>

      <!-- FAQ -->
      <div class="card overflow-hidden p-0">
        <div class="relative overflow-hidden border-b border-border px-7 py-6">
          <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" aria-hidden="true" />
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white" aria-hidden="true">
                <HelpCircle :size="22" :stroke-width="1.75" />
              </span>
              <div>
                <h3 class="text-base font-bold text-text">FAQ</h3>
                <p class="mt-1 text-xs text-text-muted">Pertanyaan & jawaban umum.</p>
              </div>
            </div>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.faqs, emptyFaq)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
        </div>
        <div class="space-y-4 p-7">
          <div v-for="(f, i) in form.faqs" :key="i" class="rounded-xl border border-border bg-bg p-5">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">FAQ {{ i + 1 }}</span>
              <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.faqs, i)">
                <Trash2 :size="12" :stroke-width="1.5" />
                Hapus
              </button>
            </div>
            <div class="grid gap-4">
              <div>
                <label :for="`site-faq-q-${i}`" class="mb-1.5 block text-sm font-medium text-text">Pertanyaan</label>
                <LocaleInput :id="`site-faq-q-${i}`" v-model="f.q" placeholder="Apakah Anda menerima project freelance?" />
              </div>
              <div>
                <label :for="`site-faq-a-${i}`" class="mb-1.5 block text-sm font-medium text-text">Jawaban</label>
                <LocaleTextarea :id="`site-faq-a-${i}`" v-model="f.a" :rows="2" placeholder="Jawaban..." />
              </div>
            </div>
          </div>
          <p v-if="!form.faqs.length" class="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
            Belum ada FAQ. Klik "Tambah" untuk menambahkan.
          </p>
        </div>
      </div>
    </div>

    <!-- Headings & SEO — 2 column -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Heading & Label Halaman -->
      <div class="card overflow-hidden p-0">
        <div class="relative overflow-hidden border-b border-border px-7 py-6">
          <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white" aria-hidden="true">
                <MessageSquareQuote :size="22" :stroke-width="1.75" />
              </span>
              <div>
                <h3 class="text-base font-bold text-text">Heading & Label</h3>
                <p class="mt-1 text-xs text-text-muted">Teks antarmuka per halaman.</p>
              </div>
            </div>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addKey(form.headings)">
              <Plus :size="14" :stroke-width="2" />
              Tambah Halaman
            </button>
          </div>
        </div>
        <div class="p-7">
          <LocaleTreeEditor :data="form.headings" />
        </div>
      </div>

      <!-- SEO / Meta -->
      <div class="card overflow-hidden p-0">
        <div class="relative overflow-hidden border-b border-border px-7 py-6">
          <div class="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" aria-hidden="true" />
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white" aria-hidden="true">
                <Search :size="22" :stroke-width="1.75" />
              </span>
              <div>
                <h3 class="text-base font-bold text-text">SEO / Meta</h3>
                <p class="mt-1 text-xs text-text-muted">Judul & deskripsi SEO per halaman.</p>
              </div>
            </div>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addKey(form.seo)">
              <Plus :size="14" :stroke-width="2" />
              Tambah Halaman
            </button>
          </div>
        </div>
        <div class="p-7">
          <LocaleTreeEditor :data="form.seo" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="card flex items-start gap-3 border-red-500/30 bg-red-500/10 px-5 py-4" role="alert">
      <span class="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
      <p class="text-sm text-red-400">{{ error }}</p>
    </div>

    <!-- Save footer -->
    <div class="card flex items-center justify-between p-5">
      <NuxtLink to="/admin" class="btn-outline">Batal</NuxtLink>
      <button type="submit" class="btn-primary" :disabled="saving">
        <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" :stroke-width="2" />
        {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
      </button>
    </div>
  </form>
</template>

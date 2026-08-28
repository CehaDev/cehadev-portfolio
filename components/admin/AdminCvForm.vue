<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Trash2, LoaderCircle, Save, Upload, Briefcase, GraduationCap, Languages, Award, User, ChevronDown, Sparkles, X } from 'lucide-vue-next'

interface LS {
  id: string
  en: string
}
interface ExperienceItem {
  role: LS
  company: LS
  period: LS
  description: LS
}
interface EducationItem {
  degree: LS
  school: LS
  period: LS
  description: LS
}
interface LanguageItem {
  name: LS
  level: LS
}
interface CertificationItem {
  name: LS
  issuer: LS
  year: LS
}
interface CvFormState {
  fullName: string
  title: LS
  photo: string
  email: string
  phone: string
  location: LS
  website: string
  linkedin: string
  github: string
  summary: LS
  experiences: ExperienceItem[]
  education: EducationItem[]
  skills: LS[]
  languages: LanguageItem[]
  certifications: CertificationItem[]
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

const form = reactive<CvFormState>({
  fullName: str(props.initial?.fullName),
  title: ls(props.initial?.title),
  photo: str(props.initial?.photo),
  email: str(props.initial?.email),
  phone: str(props.initial?.phone),
  location: ls(props.initial?.location),
  website: str(props.initial?.website),
  linkedin: str(props.initial?.linkedin),
  github: str(props.initial?.github),
  summary: ls(props.initial?.summary),
  experiences: (props.initial?.experiences ?? []).map((e: any) => ({
    role: ls(e?.role),
    company: ls(e?.company),
    period: ls(e?.period),
    description: ls(e?.description)
  })),
  education: (props.initial?.education ?? []).map((e: any) => ({
    degree: ls(e?.degree),
    school: ls(e?.school),
    period: ls(e?.period),
    description: ls(e?.description)
  })),
  skills: (props.initial?.skills ?? []).map(ls),
  languages: (props.initial?.languages ?? []).map((l: any) => ({ name: ls(l?.name), level: ls(l?.level) })),
  certifications: (props.initial?.certifications ?? []).map((c: any) => ({ name: ls(c?.name), issuer: ls(c?.issuer), year: ls(c?.year) }))
})

const error = ref('')
const saving = ref(false)
const uploadingPhoto = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)

const sections = reactive({
  personal: true,
  experience: true,
  education: true,
  skills: true
})

function toggleSection(key: keyof typeof sections) {
  sections[key] = !sections[key]
}

function cleanLs(v: LS): { id: string; en: string } {
  return { id: v.id.trim(), en: v.en.trim() }
}
function hasText(v: LS): boolean {
  return Boolean(v.id.trim() || v.en.trim())
}

async function uploadPhoto(file: File) {
  if (uploadingPhoto.value) return
  uploadingPhoto.value = true
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('photo', file)
    const res = await $fetch<{ ok: boolean; url: string }>('/api/admin/cv/photo', { method: 'POST', body: fd })
    if (res.ok) form.photo = res.url
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal mengunggah foto, coba lagi'
  } finally {
    uploadingPhoto.value = false
  }
}

function onPhotoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) uploadPhoto(file)
  input.value = ''
}

function emptyLS(): LS {
  return { id: '', en: '' }
}
function emptyExperience(): ExperienceItem {
  return { role: { id: '', en: '' }, company: { id: '', en: '' }, period: { id: '', en: '' }, description: { id: '', en: '' } }
}
function emptyEducation(): EducationItem {
  return { degree: { id: '', en: '' }, school: { id: '', en: '' }, period: { id: '', en: '' }, description: { id: '', en: '' } }
}
function emptyLanguage(): LanguageItem {
  return { name: { id: '', en: '' }, level: { id: '', en: '' } }
}
function emptyCertification(): CertificationItem {
  return { name: { id: '', en: '' }, issuer: { id: '', en: '' }, year: { id: '', en: '' } }
}

function addItem<T>(list: T[], empty: () => T) {
  list.push(empty())
}
function removeItem<T>(list: T[], index: number) {
  list.splice(index, 1)
}

function validate() {
  if (!form.fullName.trim()) {
    error.value = 'Nama lengkap wajib diisi'
    return false
  }
  error.value = ''
  return true
}

function payload() {
  return {
    fullName: form.fullName.trim(),
    title: cleanLs(form.title),
    photo: form.photo.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    location: cleanLs(form.location),
    website: form.website.trim(),
    linkedin: form.linkedin.trim(),
    github: form.github.trim(),
    summary: cleanLs(form.summary),
    experiences: form.experiences.map((e) => ({
      role: cleanLs(e.role),
      company: cleanLs(e.company),
      period: cleanLs(e.period),
      description: cleanLs(e.description)
    })),
    education: form.education.map((e) => ({
      degree: cleanLs(e.degree),
      school: cleanLs(e.school),
      period: cleanLs(e.period),
      description: cleanLs(e.description)
    })),
    skills: form.skills.map(cleanLs).filter(hasText),
    languages: form.languages.map((l) => ({ name: cleanLs(l.name), level: cleanLs(l.level) })),
    certifications: form.certifications.map((c) => ({ name: cleanLs(c.name), issuer: cleanLs(c.issuer), year: cleanLs(c.year) }))
  }
}

async function save() {
  if (saving.value || !validate()) return
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    const res = await $fetch<{ ok: boolean }>('/api/admin/cv', { method: 'PUT', body })
    if (res.ok) emit('saved', body)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal menyimpan CV, coba lagi'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="space-y-6" novalidate @submit.prevent="save">
    <!-- Data Pribadi -->
    <div class="cv-section card overflow-hidden">
      <button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" @click="toggleSection('personal')">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-primary">
          <User :size="20" :stroke-width="2" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-bold text-text sm:text-lg">Data Pribadi</h3>
          <p class="mt-0.5 text-xs text-text-muted">Informasi dasar dan kontak Anda</p>
        </div>
        <ChevronDown :size="18" :stroke-width="2" class="shrink-0 text-text-muted transition-transform duration-300" :class="sections.personal ? 'rotate-180' : ''" />
      </button>

      <Transition name="section">
        <div v-show="sections.personal" class="section-content">
          <div class="border-t border-border px-6 pb-6 pt-5 sm:px-7">
            <p class="mb-5 rounded-lg bg-primary/5 px-4 py-2.5 text-xs text-primary/80">
              <Sparkles :size="14" :stroke-width="2" class="mr-1.5 inline-block align-[-2px]" />
              Semua kolom teks mendukung dua bahasa. Kosongkan kolom EN agar otomatis memakai teks Indonesia.
            </p>

            <!-- Photo Section -->
            <div class="mb-6 flex flex-wrap items-center gap-5 rounded-xl border border-border/60 bg-gradient-to-r from-bg-alt/80 to-bg/50 p-5 backdrop-blur-sm">
              <div class="group relative h-28 w-28 shrink-0">
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-primary-blue/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                <div class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card transition-all group-hover:border-primary/40">
                  <img v-if="form.photo" :src="form.photo" alt="Foto profil CV" class="h-full w-full object-cover" />
                  <span v-else class="text-4xl font-bold text-text-muted">{{ (form.fullName || '?').charAt(0) }}</span>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-text">Foto Profil CV</p>
                <p class="mt-0.5 text-xs text-text-muted">JPG, PNG, WEBP, atau AVIF — maks 5 MB</p>
                <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden" @change="onPhotoChange" />
                <div class="mt-3 flex flex-wrap gap-2">
                  <button type="button" class="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-btn-glow hover:-translate-y-0.5" :disabled="uploadingPhoto" @click="photoInput?.click()">
                    <LoaderCircle v-if="uploadingPhoto" :size="14" class="animate-spin" />
                    <Upload v-else :size="14" :stroke-width="2" />
                    {{ uploadingPhoto ? 'Mengunggah...' : 'Ubah Foto' }}
                  </button>
                  <button v-if="form.photo && form.photo !== '/ch.png'" type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-red-400/50 hover:text-red-400" @click="form.photo = '/ch.png'">
                    <X :size="12" :stroke-width="2" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div class="sm:col-span-2 lg:col-span-1">
                <label for="cv-name" class="mb-1.5 block text-sm font-medium text-text">Nama Lengkap <span class="text-red-400">*</span></label>
                <input id="cv-name" v-model="form.fullName" type="text" class="input-field" placeholder="CehaDev" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-text">Judul / Profesi</label>
                <LocaleInput v-model="form.title" placeholder="Web Developer & Tech Enthusiast" />
              </div>
              <div>
                <label for="cv-email" class="mb-1.5 block text-sm font-medium text-text">Email</label>
                <input id="cv-email" v-model="form.email" type="email" class="input-field" placeholder="hello@chdev.online" />
              </div>
              <div>
                <label for="cv-phone" class="mb-1.5 block text-sm font-medium text-text">Telepon</label>
                <input id="cv-phone" v-model="form.phone" type="text" class="input-field" placeholder="+62 812-3456-7890" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-text">Lokasi</label>
                <LocaleInput v-model="form.location" placeholder="Wirosari, Grobogan, Jawa Tengah" />
              </div>
              <div>
                <label for="cv-website" class="mb-1.5 block text-sm font-medium text-text">Website</label>
                <input id="cv-website" v-model="form.website" type="text" class="input-field" placeholder="chdev.online" />
              </div>
              <div>
                <label for="cv-linkedin" class="mb-1.5 block text-sm font-medium text-text">LinkedIn</label>
                <input id="cv-linkedin" v-model="form.linkedin" type="url" class="input-field" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label for="cv-github" class="mb-1.5 block text-sm font-medium text-text">GitHub</label>
                <input id="cv-github" v-model="form.github" type="url" class="input-field" placeholder="https://github.com/..." />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1.5 block text-sm font-medium text-text">Ringkasan Profil</label>
                <LocaleTextarea v-model="form.summary" :rows="3" placeholder="Ringkasan singkat tentang Anda..." />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Pengalaman Kerja -->
    <div class="cv-section card overflow-hidden">
      <button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" @click="toggleSection('experience')">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-primary-blue">
          <Briefcase :size="20" :stroke-width="2" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-bold text-text sm:text-lg">Pengalaman Kerja</h3>
          <p class="mt-0.5 text-xs text-text-muted">{{ form.experiences.length }} pengalaman tercatat</p>
        </div>
        <ChevronDown :size="18" :stroke-width="2" class="shrink-0 text-text-muted transition-transform duration-300" :class="sections.experience ? 'rotate-180' : ''" />
      </button>

      <Transition name="section">
        <div v-show="sections.experience" class="section-content">
          <div class="border-t border-border px-6 pb-6 pt-5 sm:px-7">
            <div class="space-y-4">
              <div v-for="(e, i) in form.experiences" :key="i" class="cv-item group relative rounded-xl border border-border/60 bg-gradient-to-r from-bg-alt/60 to-bg/40 p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{{ i + 1 }}</span>
                    <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Pengalaman {{ i + 1 }}</span>
                  </div>
                  <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" @click="removeItem(form.experiences, i)">
                    <Trash2 :size="12" :stroke-width="1.5" />
                    Hapus
                  </button>
                </div>
                <div class="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Posisi</label>
                    <LocaleInput :id="`cv-exp-role-${i}`" v-model="e.role" placeholder="Web Developer" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Perusahaan</label>
                    <LocaleInput :id="`cv-exp-company-${i}`" v-model="e.company" placeholder="Nama perusahaan" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Periode</label>
                    <LocaleInput :id="`cv-exp-period-${i}`" v-model="e.period" placeholder="2024 — Sekarang" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Deskripsi</label>
                    <LocaleTextarea :id="`cv-exp-desc-${i}`" v-model="e.description" :rows="2" placeholder="Deskripsi tanggung jawab..." />
                  </div>
                </div>
              </div>
            </div>

            <button v-if="form.experiences.length" type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/30 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/5" @click="addItem(form.experiences, emptyExperience)">
              <Plus :size="14" :stroke-width="2" />
              Tambah Pengalaman
            </button>

            <p v-if="!form.experiences.length" class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
              <Briefcase :size="28" :stroke-width="1.5" class="text-text-muted/40" />
              <span class="text-sm text-text-muted">Belum ada pengalaman kerja</span>
              <button type="button" class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20" @click="addItem(form.experiences, emptyExperience)">
                <Plus :size="12" :stroke-width="2" />
                Tambah Sekarang
              </button>
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Pendidikan -->
    <div class="cv-section card overflow-hidden">
      <button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" @click="toggleSection('education')">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500">
          <GraduationCap :size="20" :stroke-width="2" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-bold text-text sm:text-lg">Pendidikan</h3>
          <p class="mt-0.5 text-xs text-text-muted">{{ form.education.length }} pendidikan tercatat</p>
        </div>
        <ChevronDown :size="18" :stroke-width="2" class="shrink-0 text-text-muted transition-transform duration-300" :class="sections.education ? 'rotate-180' : ''" />
      </button>

      <Transition name="section">
        <div v-show="sections.education" class="section-content">
          <div class="border-t border-border px-6 pb-6 pt-5 sm:px-7">
            <div class="space-y-4">
              <div v-for="(e, i) in form.education" :key="i" class="cv-item group relative rounded-xl border border-border/60 bg-gradient-to-r from-bg-alt/60 to-bg/40 p-5 transition-all hover:border-emerald-400/30 hover:shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-500">{{ i + 1 }}</span>
                    <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Pendidikan {{ i + 1 }}</span>
                  </div>
                  <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" @click="removeItem(form.education, i)">
                    <Trash2 :size="12" :stroke-width="1.5" />
                    Hapus
                  </button>
                </div>
                <div class="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Gelar / Jurusan</label>
                    <LocaleInput :id="`cv-edu-degree-${i}`" v-model="e.degree" placeholder="Ilmu Komputer" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Institusi</label>
                    <LocaleInput :id="`cv-edu-school-${i}`" v-model="e.school" placeholder="Nama universitas" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Periode</label>
                    <LocaleInput :id="`cv-edu-period-${i}`" v-model="e.period" placeholder="2022 — Sekarang" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-text-secondary">Deskripsi</label>
                    <LocaleInput :id="`cv-edu-desc-${i}`" v-model="e.description" placeholder="Opsional" />
                  </div>
                </div>
              </div>
            </div>

            <button v-if="form.education.length" type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-500 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5" @click="addItem(form.education, emptyEducation)">
              <Plus :size="14" :stroke-width="2" />
              Tambah Pendidikan
            </button>

            <p v-if="!form.education.length" class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
              <GraduationCap :size="28" :stroke-width="1.5" class="text-text-muted/40" />
              <span class="text-sm text-text-muted">Belum ada data pendidikan</span>
              <button type="button" class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/20" @click="addItem(form.education, emptyEducation)">
                <Plus :size="12" :stroke-width="2" />
                Tambah Sekarang
              </button>
            </p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Keahlian & Sertifikasi -->
    <div class="cv-section card overflow-hidden">
      <button type="button" class="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-card-alt/50 sm:p-7" @click="toggleSection('skills')">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500">
          <Award :size="20" :stroke-width="2" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-bold text-text sm:text-lg">Keahlian & Sertifikasi</h3>
          <p class="mt-0.5 text-xs text-text-muted">{{ form.skills.length }} skill · {{ form.languages.length }} bahasa · {{ form.certifications.length }} sertifikasi</p>
        </div>
        <ChevronDown :size="18" :stroke-width="2" class="shrink-0 text-text-muted transition-transform duration-300" :class="sections.skills ? 'rotate-180' : ''" />
      </button>

      <Transition name="section">
        <div v-show="sections.skills" class="section-content">
          <div class="border-t border-border px-6 pb-6 pt-5 sm:px-7">
            <div class="grid gap-6 lg:grid-cols-2">
              <!-- Skills -->
              <div>
                <div class="mb-3 flex items-center justify-between">
                  <p class="text-sm font-semibold text-text">Skills</p>
                  <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/5" @click="addItem(form.skills, emptyLS)">
                    <Plus :size="12" :stroke-width="2" />
                    Tambah
                  </button>
                </div>
                <ul class="space-y-2">
                  <li v-for="(s, i) in form.skills" :key="i" class="flex items-center gap-3 rounded-xl border border-border/60 bg-bg-alt/50 px-3 py-2 transition-all hover:border-primary/30">
                    <div class="min-w-0 flex-1">
                      <LocaleInput v-model="form.skills[i]" placeholder="Nama skill..." />
                    </div>
                    <button type="button" class="shrink-0 rounded-lg border border-transparent p-1.5 text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" :aria-label="`Hapus skill ${i + 1}`" @click="removeItem(form.skills, i)">
                      <Trash2 :size="14" :stroke-width="1.5" />
                    </button>
                  </li>
                </ul>
                <p v-if="!form.skills.length" class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center">
                  <span class="text-sm text-text-muted">Belum ada skill</span>
                </p>
              </div>

              <!-- Languages -->
              <div>
                <div class="mb-3 flex items-center justify-between">
                  <p class="flex items-center gap-2 text-sm font-semibold text-text">
                    <Languages :size="16" :stroke-width="1.75" class="text-primary-blue" />
                    Bahasa
                  </p>
                  <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-primary-blue/30 px-3 py-1.5 text-xs font-semibold text-primary-blue transition-all hover:border-primary-blue/50 hover:bg-primary-blue/5" @click="addItem(form.languages, emptyLanguage)">
                    <Plus :size="12" :stroke-width="2" />
                    Tambah
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="(l, i) in form.languages" :key="i" class="rounded-xl border border-border/60 bg-bg-alt/50 p-3 transition-all hover:border-primary-blue/30">
                    <div class="grid gap-2.5 sm:grid-cols-2">
                      <div>
                        <label class="mb-1 block text-xs font-medium text-text-secondary">Nama</label>
                        <LocaleInput :id="`cv-lang-name-${i}`" v-model="l.name" placeholder="Indonesia" />
                      </div>
                      <div>
                        <label class="mb-1 block text-xs font-medium text-text-secondary">Tingkat</label>
                        <LocaleInput :id="`cv-lang-level-${i}`" v-model="l.level" placeholder="Native" />
                      </div>
                    </div>
                    <button type="button" class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" :aria-label="`Hapus bahasa ${i + 1}`" @click="removeItem(form.languages, i)">
                      <Trash2 :size="12" :stroke-width="1.5" />
                      Hapus
                    </button>
                  </div>
                </div>
                <p v-if="!form.languages.length" class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center">
                  <span class="text-sm text-text-muted">Belum ada bahasa</span>
                </p>
              </div>
            </div>

            <!-- Certifications -->
            <div class="mt-6">
              <div class="mb-3 flex items-center justify-between">
                <p class="flex items-center gap-2 text-sm font-semibold text-text">
                  <Award :size="16" :stroke-width="1.75" class="text-amber-500" />
                  Sertifikasi
                </p>
                <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-500 transition-all hover:border-amber-500/50 hover:bg-amber-500/5" @click="addItem(form.certifications, emptyCertification)">
                  <Plus :size="12" :stroke-width="2" />
                  Tambah
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(c, i) in form.certifications" :key="i" class="rounded-xl border border-border/60 bg-bg-alt/50 p-4 transition-all hover:border-amber-400/30">
                  <div class="grid gap-2.5 sm:grid-cols-3">
                    <div>
                      <label class="mb-1 block text-xs font-medium text-text-secondary">Nama</label>
                      <LocaleInput :id="`cv-cert-name-${i}`" v-model="c.name" placeholder="Nama sertifikasi" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-text-secondary">Penerbit</label>
                      <LocaleInput :id="`cv-cert-issuer-${i}`" v-model="c.issuer" placeholder="Penerbit" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-text-secondary">Tahun</label>
                      <LocaleInput :id="`cv-cert-year-${i}`" v-model="c.year" placeholder="2023" />
                    </div>
                  </div>
                  <button type="button" class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" :aria-label="`Hapus sertifikasi ${i + 1}`" @click="removeItem(form.certifications, i)">
                    <Trash2 :size="12" :stroke-width="1.5" />
                    Hapus
                  </button>
                </div>
              </div>
              <p v-if="!form.certifications.length" class="mt-2 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center">
                <span class="text-sm text-text-muted">Belum ada sertifikasi</span>
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Error -->
    <Transition name="error">
      <div v-if="error" class="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-sm text-red-400" role="alert">
        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs">!</span>
        {{ error }}
      </div>
    </Transition>

    <!-- Actions -->
    <div class="flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5">
      <NuxtLink to="/admin" class="btn-outline !px-4 !py-2.5">
        Batal
      </NuxtLink>
      <button type="submit" class="btn-primary !px-6 !py-2.5" :disabled="saving">
        <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" :stroke-width="2" />
        {{ saving ? 'Menyimpan...' : 'Simpan CV' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.section-enter-active,
.section-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.section-enter-from,
.section-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.section-enter-to,
.section-leave-from {
  opacity: 1;
  max-height: 2000px;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

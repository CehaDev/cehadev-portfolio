<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Trash2, LoaderCircle, Save, Upload, Briefcase, GraduationCap, Languages, Award } from 'lucide-vue-next'

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
  <form class="space-y-8" novalidate @submit.prevent="save">
    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Data Pribadi</h3>
      <p class="mb-5 text-xs text-text-muted">Semua kolom teks dapat diisi dua bahasa. Kosongkan kolom EN agar otomatis memakai teks Indonesia.</p>

      <div class="mb-6 flex flex-wrap items-center gap-5 rounded-lg border border-border bg-bg p-5">
        <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
          <img v-if="form.photo" :src="form.photo" alt="Foto profil CV" class="h-full w-full object-cover" />
          <span v-else class="text-3xl font-bold text-text-muted">{{ (form.fullName || '?').charAt(0) }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-text">Foto CV</p>
          <p class="mt-0.5 text-xs text-text-muted">JPG, PNG, WEBP, atau AVIF — maksimal 5 MB.</p>
          <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden" @change="onPhotoChange" />
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="btn-outline !px-3.5 !py-2 text-xs" :disabled="uploadingPhoto" @click="photoInput?.click()">
              <LoaderCircle v-if="uploadingPhoto" :size="14" class="animate-spin" />
              <Upload v-else :size="14" :stroke-width="2" />
              {{ uploadingPhoto ? 'Mengunggah...' : 'Ubah Foto' }}
            </button>
            <button v-if="form.photo && form.photo !== '/ch.png'" type="button" class="btn-outline !px-3.5 !py-2 text-xs" @click="form.photo = '/ch.png'">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="cv-name" class="mb-1.5 block text-sm font-medium text-text">Nama Lengkap</label>
          <input id="cv-name" v-model="form.fullName" type="text" class="input-field" placeholder="CehaDev" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-text">Judul / Profesi</label>
          <LocaleInput v-model="form.title" placeholder="Web Developer & Tech Enthusiast" />
        </div>
        <div>
          <label for="cv-email" class="mb-1.5 block text-sm font-medium text-text">Email</label>
          <input id="cv-email" v-model="form.email" type="email" class="input-field" placeholder="hello@cehadev.id" />
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
          <input id="cv-website" v-model="form.website" type="text" class="input-field" placeholder="cehadev.id" />
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
          <LocaleTextarea v-model="form.summary" :rows="4" placeholder="Ringkasan singkat tentang Anda..." />
        </div>
      </div>
    </div>

    <div class="card p-7">
      <div class="mb-5 flex items-center justify-between">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <Briefcase :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Pengalaman Kerja
        </h3>
        <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.experiences, emptyExperience)">
          <Plus :size="14" :stroke-width="2" />
          Tambah
        </button>
      </div>
      <div class="space-y-5">
        <div v-for="(e, i) in form.experiences" :key="i" class="rounded-lg border border-border bg-bg p-5">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Pengalaman {{ i + 1 }}</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.experiences, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Posisi</label>
              <LocaleInput :id="`cv-exp-role-${i}`" v-model="e.role" placeholder="Web Developer" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Perusahaan</label>
              <LocaleInput :id="`cv-exp-company-${i}`" v-model="e.company" placeholder="Nama perusahaan" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-text">Periode</label>
              <LocaleInput :id="`cv-exp-period-${i}`" v-model="e.period" placeholder="2024 — Sekarang" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
              <LocaleTextarea :id="`cv-exp-desc-${i}`" v-model="e.description" :rows="2" placeholder="Deskripsi tanggung jawab..." />
            </div>
          </div>
        </div>
        <p v-if="!form.experiences.length" class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
          Belum ada pengalaman. Klik "Tambah" untuk menambahkan.
        </p>
      </div>
    </div>

    <div class="card p-7">
      <div class="mb-5 flex items-center justify-between">
        <h3 class="flex items-center gap-2 text-base font-bold text-text">
          <GraduationCap :size="18" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
          Pendidikan
        </h3>
        <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.education, emptyEducation)">
          <Plus :size="14" :stroke-width="2" />
          Tambah
        </button>
      </div>
      <div class="space-y-5">
        <div v-for="(e, i) in form.education" :key="i" class="rounded-lg border border-border bg-bg p-5">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Pendidikan {{ i + 1 }}</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.education, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Gelar / Jurusan</label>
              <LocaleInput :id="`cv-edu-degree-${i}`" v-model="e.degree" placeholder="Ilmu Komputer" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Institusi</label>
              <LocaleInput :id="`cv-edu-school-${i}`" v-model="e.school" placeholder="Nama universitas" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Periode</label>
              <LocaleInput :id="`cv-edu-period-${i}`" v-model="e.period" placeholder="2022 — Sekarang" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
              <LocaleInput :id="`cv-edu-desc-${i}`" v-model="e.description" placeholder="Opsional" />
            </div>
          </div>
        </div>
        <p v-if="!form.education.length" class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
          Belum ada pendidikan. Klik "Tambah" untuk menambahkan.
        </p>
      </div>
    </div>

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Keahlian & Sertifikasi</h3>
      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Skills (daftar keahlian)</p>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.skills, emptyLS)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
          <ul class="space-y-2">
            <li v-for="(s, i) in form.skills" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-2.5">
              <div class="min-w-0 flex-1">
                <LocaleInput v-model="form.skills[i]" placeholder="Nama skill..." />
              </div>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus skill ${i + 1}`" @click="removeItem(form.skills, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </li>
            <p v-if="!form.skills.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada skill. Klik "Tambah" untuk menambahkan.
            </p>
          </ul>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="flex items-center gap-2 text-sm font-medium text-text">
              <Languages :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Bahasa
            </p>
            <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.languages, emptyLanguage)">
              <Plus :size="14" :stroke-width="2" />
              Tambah
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="(l, i) in form.languages" :key="i" class="rounded-lg border border-border bg-bg p-3">
              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Nama</label>
                  <LocaleInput :id="`cv-lang-name-${i}`" v-model="l.name" placeholder="Indonesia" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Tingkat</label>
                  <LocaleInput :id="`cv-lang-level-${i}`" v-model="l.level" placeholder="Native" />
                </div>
              </div>
              <button type="button" class="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus bahasa ${i + 1}`" @click="removeItem(form.languages, i)">
                <Trash2 :size="12" :stroke-width="1.5" />
                Hapus
              </button>
            </div>
            <p v-if="!form.languages.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada bahasa.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <div class="mb-3 flex items-center justify-between">
          <p class="flex items-center gap-2 text-sm font-medium text-text">
            <Award :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Sertifikasi
          </p>
          <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.certifications, emptyCertification)">
            <Plus :size="14" :stroke-width="2" />
            Tambah
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(c, i) in form.certifications" :key="i" class="rounded-lg border border-border bg-bg p-4">
            <div class="grid gap-3 sm:grid-cols-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-text">Nama</label>
                <LocaleInput :id="`cv-cert-name-${i}`" v-model="c.name" placeholder="Nama sertifikasi" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-text">Penerbit</label>
                <LocaleInput :id="`cv-cert-issuer-${i}`" v-model="c.issuer" placeholder="Penerbit" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-text">Tahun</label>
                <LocaleInput :id="`cv-cert-year-${i}`" v-model="c.year" placeholder="2023" />
              </div>
            </div>
            <button type="button" class="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus sertifikasi ${i + 1}`" @click="removeItem(form.certifications, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <p v-if="!form.certifications.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
            Belum ada sertifikasi.
          </p>
        </div>
      </div>
    </div>

    <p v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="flex items-center justify-end gap-3">
      <NuxtLink to="/admin" class="btn-outline">Batal</NuxtLink>
      <button type="submit" class="btn-primary" :disabled="saving">
        <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" :stroke-width="2" />
        {{ saving ? 'Menyimpan...' : 'Simpan CV' }}
      </button>
    </div>
  </form>
</template>

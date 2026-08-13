<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Trash2, LoaderCircle, Save, Upload, Briefcase, GraduationCap, Languages, Award } from 'lucide-vue-next'

interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
}
interface EducationItem {
  degree: string
  school: string
  period: string
  description: string
}
interface LanguageItem {
  name: string
  level: string
}
interface CertificationItem {
  name: string
  issuer: string
  year: string
}
interface CvFormState {
  fullName: string
  title: string
  photo: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
  experiences: ExperienceItem[]
  education: EducationItem[]
  skills: string
  languages: LanguageItem[]
  certifications: CertificationItem[]
}

const props = defineProps<{
  initial?: Record<string, any>
}>()

const emit = defineEmits<{ saved: [data: Record<string, unknown>] }>()

const form = reactive<CvFormState>({
  fullName: props.initial?.fullName ?? '',
  title: props.initial?.title ?? '',
  photo: props.initial?.photo ?? '',
  email: props.initial?.email ?? '',
  phone: props.initial?.phone ?? '',
  location: props.initial?.location ?? '',
  website: props.initial?.website ?? '',
  linkedin: props.initial?.linkedin ?? '',
  github: props.initial?.github ?? '',
  summary: props.initial?.summary ?? '',
  experiences: props.initial?.experiences ?? [],
  education: props.initial?.education ?? [],
  skills: (props.initial?.skills ?? []).join(', '),
  languages: props.initial?.languages ?? [],
  certifications: props.initial?.certifications ?? []
})

const error = ref('')
const saving = ref(false)
const uploadingPhoto = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)

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

function emptyExperience(): ExperienceItem {
  return { role: '', company: '', period: '', description: '' }
}
function emptyEducation(): EducationItem {
  return { degree: '', school: '', period: '', description: '' }
}
function emptyLanguage(): LanguageItem {
  return { name: '', level: '' }
}
function emptyCertification(): CertificationItem {
  return { name: '', issuer: '', year: '' }
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
    title: form.title.trim(),
    photo: form.photo.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    location: form.location.trim(),
    website: form.website.trim(),
    linkedin: form.linkedin.trim(),
    github: form.github.trim(),
    summary: form.summary.trim(),
    experiences: form.experiences.map((e) => ({
      role: e.role.trim(),
      company: e.company.trim(),
      period: e.period.trim(),
      description: e.description.trim()
    })),
    education: form.education.map((e) => ({
      degree: e.degree.trim(),
      school: e.school.trim(),
      period: e.period.trim(),
      description: e.description.trim()
    })),
    skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    languages: form.languages.map((l) => ({ name: l.name.trim(), level: l.level.trim() })),
    certifications: form.certifications.map((c) => ({ name: c.name.trim(), issuer: c.issuer.trim(), year: c.year.trim() }))
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
          <label for="cv-title" class="mb-1.5 block text-sm font-medium text-text">Judul / Profesi</label>
          <input id="cv-title" v-model="form.title" type="text" class="input-field" placeholder="Web Developer & Tech Enthusiast" />
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
          <label for="cv-location" class="mb-1.5 block text-sm font-medium text-text">Lokasi</label>
          <input id="cv-location" v-model="form.location" type="text" class="input-field" placeholder="Wirosari, Grobogan, Jawa Tengah" />
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
          <label for="cv-summary" class="mb-1.5 block text-sm font-medium text-text">Ringkasan Profil</label>
          <textarea id="cv-summary" v-model="form.summary" rows="4" class="input-field resize-none" placeholder="Ringkasan singkat tentang Anda..." />
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
              <label :for="`cv-exp-role-${i}`" class="mb-1.5 block text-sm font-medium text-text">Posisi</label>
              <input :id="`cv-exp-role-${i}`" v-model="e.role" type="text" class="input-field" placeholder="Web Developer" />
            </div>
            <div>
              <label :for="`cv-exp-company-${i}`" class="mb-1.5 block text-sm font-medium text-text">Perusahaan</label>
              <input :id="`cv-exp-company-${i}`" v-model="e.company" type="text" class="input-field" placeholder="Nama perusahaan" />
            </div>
            <div class="sm:col-span-2">
              <label :for="`cv-exp-period-${i}`" class="mb-1.5 block text-sm font-medium text-text">Periode</label>
              <input :id="`cv-exp-period-${i}`" v-model="e.period" type="text" class="input-field" placeholder="2024 — Sekarang" />
            </div>
            <div class="sm:col-span-2">
              <label :for="`cv-exp-desc-${i}`" class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
              <textarea :id="`cv-exp-desc-${i}`" v-model="e.description" rows="2" class="input-field resize-none" placeholder="Deskripsi tanggung jawab..." />
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
              <label :for="`cv-edu-degree-${i}`" class="mb-1.5 block text-sm font-medium text-text">Gelar / Jurusan</label>
              <input :id="`cv-edu-degree-${i}`" v-model="e.degree" type="text" class="input-field" placeholder="Ilmu Komputer" />
            </div>
            <div>
              <label :for="`cv-edu-school-${i}`" class="mb-1.5 block text-sm font-medium text-text">Institusi</label>
              <input :id="`cv-edu-school-${i}`" v-model="e.school" type="text" class="input-field" placeholder="Nama universitas" />
            </div>
            <div>
              <label :for="`cv-edu-period-${i}`" class="mb-1.5 block text-sm font-medium text-text">Periode</label>
              <input :id="`cv-edu-period-${i}`" v-model="e.period" type="text" class="input-field" placeholder="2022 — Sekarang" />
            </div>
            <div>
              <label :for="`cv-edu-desc-${i}`" class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
              <input :id="`cv-edu-desc-${i}`" v-model="e.description" type="text" class="input-field" placeholder="Opsional" />
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
          <label for="cv-skills" class="mb-1.5 block text-sm font-medium text-text">Skills (pisahkan dengan koma)</label>
          <textarea id="cv-skills" v-model="form.skills" rows="4" class="input-field resize-none" placeholder="Nuxt.js, Vue.js, Node.js, TypeScript..." />
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
            <div v-for="(l, i) in form.languages" :key="i" class="flex items-center gap-3">
              <input v-model="l.name" type="text" class="input-field !py-2.5" placeholder="Indonesia" />
              <input v-model="l.level" type="text" class="input-field !py-2.5" placeholder="Native" />
              <button type="button" class="shrink-0 rounded-lg border border-red-500/30 p-2 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus bahasa ${i + 1}`" @click="removeItem(form.languages, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </div>
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
          <div v-for="(c, i) in form.certifications" :key="i" class="flex flex-wrap items-center gap-3">
            <input v-model="c.name" type="text" class="input-field !py-2.5 sm:flex-1" placeholder="Nama sertifikasi" />
            <input v-model="c.issuer" type="text" class="input-field !py-2.5 sm:flex-1" placeholder="Penerbit" />
            <input v-model="c.year" type="text" class="input-field !py-2.5 sm:w-24" placeholder="2023" />
            <button type="button" class="shrink-0 rounded-lg border border-red-500/30 p-2 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus sertifikasi ${i + 1}`" @click="removeItem(form.certifications, i)">
              <Trash2 :size="14" :stroke-width="1.5" />
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

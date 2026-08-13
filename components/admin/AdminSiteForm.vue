<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Trash2, LoaderCircle, Save } from 'lucide-vue-next'

interface StatItem {
  icon: string
  label: string
  sub: string
  end: number
  suffix: string
}
interface FaqItem {
  q: string
  a: string
}

const props = defineProps<{
  initial?: Record<string, any>
}>()

const emit = defineEmits<{ saved: [data: Record<string, unknown>] }>()

const form = reactive({
  name: props.initial?.name ?? '',
  role: props.initial?.role ?? '',
  heroBadge: props.initial?.heroBadge ?? '',
  heroTitle1: props.initial?.heroTitle1 ?? '',
  heroTitleGradient: props.initial?.heroTitleGradient ?? '',
  heroSubtitle: props.initial?.heroSubtitle ?? '',
  heroDescription: props.initial?.heroDescription ?? '',
  aboutIntro: (props.initial?.aboutIntro ?? []).join('\n'),
  aboutChecklist: [...(props.initial?.aboutChecklist ?? [])],
  quote: props.initial?.quote ?? '',
  quoteHighlight: props.initial?.quoteHighlight ?? '',
  stats: (props.initial?.stats ?? []).map((s: any) => ({ icon: s.icon ?? '', label: s.label ?? '', sub: s.sub ?? '', end: s.end ?? 0, suffix: s.suffix ?? '' })),
  email: props.initial?.email ?? '',
  phone: props.initial?.phone ?? '',
  location: props.initial?.location ?? '',
  website: props.initial?.website ?? '',
  cvUrl: props.initial?.cvUrl ?? '',
  socials: {
    github: props.initial?.socials?.github ?? '',
    linkedin: props.initial?.socials?.linkedin ?? '',
    instagram: props.initial?.socials?.instagram ?? ''
  },
  projectStats: (props.initial?.projectStats ?? []).map((s: any) => ({ icon: s.icon ?? '', label: s.label ?? '', value: s.value ?? '' })),
  faqs: (props.initial?.faqs ?? []).map((f: any) => ({ q: f.q ?? '', a: f.a ?? '' }))
})

const error = ref('')
const saving = ref(false)
const newChecklist = ref('')

function emptyStat(): StatItem {
  return { icon: 'Activity', label: '', sub: '', end: 0, suffix: '+' }
}
function emptyFaq(): FaqItem {
  return { q: '', a: '' }
}
function addItem<T>(list: T[], empty: () => T) {
  list.push(empty())
}
function removeItem<T>(list: T[], index: number) {
  list.splice(index, 1)
}

function addChecklist() {
  const v = newChecklist.value.trim()
  if (v && !form.aboutChecklist.includes(v)) form.aboutChecklist.push(v)
  newChecklist.value = ''
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
    role: form.role.trim(),
    heroBadge: form.heroBadge.trim(),
    heroTitle1: form.heroTitle1.trim(),
    heroTitleGradient: form.heroTitleGradient.trim(),
    heroSubtitle: form.heroSubtitle.trim(),
    heroDescription: form.heroDescription.trim(),
    aboutIntro: form.aboutIntro.split('\n').map((s) => s.trim()).filter(Boolean),
    aboutChecklist: form.aboutChecklist.map((s) => s.trim()).filter(Boolean),
    quote: form.quote.trim(),
    quoteHighlight: form.quoteHighlight.trim(),
    stats: form.stats.map((s) => ({
      icon: s.icon.trim(),
      label: s.label.trim(),
      sub: s.sub.trim(),
      end: Number(s.end) || 0,
      suffix: s.suffix.trim()
    })).filter((s) => s.label),
    email: form.email.trim(),
    phone: form.phone.trim(),
    location: form.location.trim(),
    website: form.website.trim(),
    cvUrl: form.cvUrl.trim(),
    socials: {
      github: form.socials.github.trim(),
      linkedin: form.socials.linkedin.trim(),
      instagram: form.socials.instagram.trim()
    },
    projectStats: form.projectStats.map((s) => ({
      icon: s.icon.trim(),
      label: s.label.trim(),
      value: s.value.trim()
    })).filter((s) => s.label),
    faqs: form.faqs.map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q)
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
  <form class="space-y-8" novalidate @submit.prevent="save">
    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Identitas & Hero</h3>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="site-name" class="mb-1.5 block text-sm font-medium text-text">Nama / Brand</label>
          <input id="site-name" v-model="form.name" type="text" class="input-field" placeholder="CehaDev" />
        </div>
        <div>
          <label for="site-role" class="mb-1.5 block text-sm font-medium text-text">Role / Profesi</label>
          <input id="site-role" v-model="form.role" type="text" class="input-field" placeholder="Web Developer & Tech Enthusiast" />
        </div>
        <div>
          <label for="site-hero-badge" class="mb-1.5 block text-sm font-medium text-text">Badge Hero</label>
          <input id="site-hero-badge" v-model="form.heroBadge" type="text" class="input-field" placeholder="Available for collaboration" />
        </div>
        <div>
          <label for="site-hero-title1" class="mb-1.5 block text-sm font-medium text-text">Teks Hero (sebelum gradient)</label>
          <input id="site-hero-title1" v-model="form.heroTitle1" type="text" class="input-field" placeholder="Hi, I'm" />
        </div>
        <div>
          <label for="site-hero-gradient" class="mb-1.5 block text-sm font-medium text-text">Teks Hero Gradient</label>
          <input id="site-hero-gradient" v-model="form.heroTitleGradient" type="text" class="input-field" placeholder="CehaDev" />
        </div>
        <div>
          <label for="site-hero-subtitle" class="mb-1.5 block text-sm font-medium text-text">Subtitle Hero</label>
          <input id="site-hero-subtitle" v-model="form.heroSubtitle" type="text" class="input-field" placeholder="Web Developer & Tech Enthusiast" />
        </div>
        <div class="sm:col-span-2">
          <label for="site-hero-desc" class="mb-1.5 block text-sm font-medium text-text">Deskripsi Hero</label>
          <textarea id="site-hero-desc" v-model="form.heroDescription" rows="3" class="input-field resize-none" placeholder="Deskripsi singkat di bagian hero..." />
        </div>
      </div>
    </div>

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Tentang</h3>
      <div class="grid gap-5">
        <div>
          <label for="site-about-intro" class="mb-1.5 block text-sm font-medium text-text">Paragraf Pengantar (satu paragraf per baris)</label>
          <textarea id="site-about-intro" v-model="form.aboutIntro" rows="5" class="input-field resize-none" placeholder="Tulis setiap paragraf pada baris terpisah..." />
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Checklist Tentang</p>
            <div class="flex gap-2">
              <input v-model="newChecklist" type="text" class="input-field !py-2.5 !text-sm" placeholder="Tambah poin..." @keydown.enter.prevent="addChecklist" />
              <button type="button" class="btn-outline shrink-0 !px-3 !py-2 text-xs" @click="addChecklist">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
            </div>
          </div>
          <ul class="space-y-2">
            <li v-for="(item, i) in form.aboutChecklist" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-2.5">
              <span class="min-w-0 flex-1 text-sm text-text">{{ item }}</span>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus poin ${i + 1}`" @click="removeItem(form.aboutChecklist, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </li>
            <p v-if="!form.aboutChecklist.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada poin checklist.
            </p>
          </ul>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="site-quote" class="mb-1.5 block text-sm font-medium text-text">Kutipan</label>
            <input id="site-quote" v-model="form.quote" type="text" class="input-field" placeholder="Code is not just about how it works..." />
          </div>
          <div>
            <label for="site-quote-highlight" class="mb-1.5 block text-sm font-medium text-text">Kutipan (highlight)</label>
            <input id="site-quote-highlight" v-model="form.quoteHighlight" type="text" class="input-field" placeholder="how it's built." />
          </div>
        </div>
      </div>
    </div>

    <div class="card p-7">
      <div class="mb-5 flex items-center justify-between">
        <h3 class="text-base font-bold text-text">Statistik Beranda</h3>
        <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.stats, emptyStat)">
          <Plus :size="14" :stroke-width="2" />
          Tambah
        </button>
      </div>
      <p class="mb-4 text-xs text-text-muted">Ikon yang didukung: Clock, FolderGit2, Code2, Target.</p>
      <div class="space-y-5">
        <div v-for="(s, i) in form.stats" :key="i" class="rounded-lg border border-border bg-bg p-5">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Statistik {{ i + 1 }}</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.stats, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label :for="`site-stat-icon-${i}`" class="mb-1.5 block text-sm font-medium text-text">Ikon</label>
              <input :id="`site-stat-icon-${i}`" v-model="s.icon" type="text" class="input-field" placeholder="Activity / Clock / Code2" />
            </div>
            <div>
              <label :for="`site-stat-label-${i}`" class="mb-1.5 block text-sm font-medium text-text">Label</label>
              <input :id="`site-stat-label-${i}`" v-model="s.label" type="text" class="input-field" placeholder="Years" />
            </div>
            <div>
              <label :for="`site-stat-sub-${i}`" class="mb-1.5 block text-sm font-medium text-text">Sub</label>
              <input :id="`site-stat-sub-${i}`" v-model="s.sub" type="text" class="input-field" placeholder="Learning & Building" />
            </div>
            <div>
              <label :for="`site-stat-end-${i}`" class="mb-1.5 block text-sm font-medium text-text">Angka Akhir</label>
              <input :id="`site-stat-end-${i}`" v-model.number="s.end" type="number" class="input-field" placeholder="2" />
            </div>
            <div>
              <label :for="`site-stat-suffix-${i}`" class="mb-1.5 block text-sm font-medium text-text">Sufiks</label>
              <input :id="`site-stat-suffix-${i}`" v-model="s.suffix" type="text" class="input-field" placeholder="+" />
            </div>
          </div>
        </div>
        <p v-if="!form.stats.length" class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
          Belum ada statistik. Klik "Tambah" untuk menambahkan.
        </p>
      </div>
    </div>

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Kontak & Sosial</h3>
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
          <label for="site-location" class="mb-1.5 block text-sm font-medium text-text">Lokasi</label>
          <input id="site-location" v-model="form.location" type="text" class="input-field" placeholder="Wirosari, Grobogan, Jawa Tengah" />
        </div>
        <div>
          <label for="site-website" class="mb-1.5 block text-sm font-medium text-text">Website</label>
          <input id="site-website" v-model="form.website" type="text" class="input-field" placeholder="cehadev.id" />
        </div>
        <div>
          <label for="site-cv-url" class="mb-1.5 block text-sm font-medium text-text">URL CV</label>
          <input id="site-cv-url" v-model="form.cvUrl" type="text" class="input-field" placeholder="/cv" />
        </div>
        <div class="sm:col-span-2">
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

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Statistik Halaman Project</h3>
      <p class="mb-4 text-xs text-text-muted">
        Mengatur 4 kartu statistik di halaman project. Ikon yang didukung: FolderKanban, Tag, CalendarRange, Code2. Kosongkan label untuk menonaktifkan kartu.
      </p>
      <div class="space-y-5">
        <div v-for="(s, i) in form.projectStats" :key="i" class="rounded-lg border border-border bg-bg p-5">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Kartu {{ i + 1 }}</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.projectStats, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
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
              <input :id="`site-ps-label-${i}`" v-model="s.label" type="text" class="input-field" placeholder="Project" />
            </div>
            <div>
              <label :for="`site-ps-value-${i}`" class="mb-1.5 block text-sm font-medium text-text">Nilai</label>
              <input :id="`site-ps-value-${i}`" v-model="s.value" type="text" class="input-field" placeholder="6" />
            </div>
          </div>
        </div>
        <p v-if="!form.projectStats.length" class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
          Belum ada kartu statistik. Jika kosong, nilai otomatis dihitung dari data project.
        </p>
      </div>
    </div>

    <div class="card p-7">
      <div class="mb-5 flex items-center justify-between">
        <h3 class="text-base font-bold text-text">FAQ</h3>
        <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.faqs, emptyFaq)">
          <Plus :size="14" :stroke-width="2" />
          Tambah
        </button>
      </div>
      <div class="space-y-5">
        <div v-for="(f, i) in form.faqs" :key="i" class="rounded-lg border border-border bg-bg p-5">
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
              <input :id="`site-faq-q-${i}`" v-model="f.q" type="text" class="input-field" placeholder="Apakah Anda menerima project freelance?" />
            </div>
            <div>
              <label :for="`site-faq-a-${i}`" class="mb-1.5 block text-sm font-medium text-text">Jawaban</label>
              <textarea :id="`site-faq-a-${i}`" v-model="f.a" rows="2" class="input-field resize-none" placeholder="Jawaban..." />
            </div>
          </div>
        </div>
        <p v-if="!form.faqs.length" class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
          Belum ada FAQ. Klik "Tambah" untuk menambahkan.
        </p>
      </div>
    </div>

    <p v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="flex items-center justify-end gap-3">
      <NuxtLink to="/admin" class="btn-outline">Batal</NuxtLink>
      <button type="submit" class="btn-primary" :disabled="saving">
        <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" :stroke-width="2" />
        {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
      </button>
    </div>
  </form>
</template>

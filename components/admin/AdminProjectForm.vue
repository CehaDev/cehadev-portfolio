<script setup lang="ts">
import { LoaderCircle, Save } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

const props = withDefaults(
  defineProps<{
    initial?: Record<string, any>
    endpoint: string
    method?: 'POST' | 'PUT'
  }>(),
  { method: 'POST', initial: undefined }
)
const emit = defineEmits<{ saved: [data: Record<string, unknown>] }>()

const form = reactive({
  title: props.initial?.title ?? '',
  slug: props.initial?.slug ?? '',
  tagline: props.initial?.tagline ?? '',
  description: props.initial?.description ?? '',
  category: props.initial?.category ?? 'Web App',
  year: props.initial?.year ?? String(new Date().getFullYear()),
  role: props.initial?.role ?? 'Full-Stack Developer',
  duration: props.initial?.duration ?? '',
  liveUrl: props.initial?.liveUrl ?? '',
  githubUrl: props.initial?.githubUrl ?? '',
  featured: props.initial?.featured ?? false,
  tags: (props.initial?.tags ?? []).join(', '),
  tech: [...(props.initial?.tech ?? [])]
})

const techKeys = Object.keys(techIcons)
const categoryOptions = ['Web App', 'E-Commerce', 'Dashboard', 'Mobile App', 'Backend API', 'Landing Page']

const error = ref('')
const saving = ref(false)

function autoSlug() {
  if (!form.slug && form.title) {
    form.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }
}

function toggleTech(key: string) {
  const i = form.tech.indexOf(key)
  if (i >= 0) form.tech.splice(i, 1)
  else form.tech.push(key)
}

function validate() {
  if (!form.title.trim() || !form.slug.trim()) {
    error.value = 'Judul dan slug wajib diisi'
    return false
  }
  error.value = ''
  return true
}

function payload() {
  return {
    title: form.title.trim(),
    slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''),
    tagline: form.tagline.trim(),
    description: form.description.trim(),
    category: form.category.trim() || 'Web App',
    year: form.year.trim(),
    role: form.role.trim(),
    duration: form.duration.trim(),
    liveUrl: form.liveUrl.trim(),
    githubUrl: form.githubUrl.trim(),
    featured: form.featured,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    tech: form.tech
  }
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
      <h3 class="mb-5 text-base font-bold text-text">Informasi Dasar</h3>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="pf-title" class="mb-1.5 block text-sm font-medium text-text">Judul Project</label>
          <input id="pf-title" v-model="form.title" type="text" class="input-field" placeholder="Nama project" @blur="autoSlug" />
        </div>
        <div>
          <label for="pf-slug" class="mb-1.5 block text-sm font-medium text-text">Slug (URL)</label>
          <input id="pf-slug" v-model="form.slug" type="text" class="input-field" placeholder="nama-project" />
        </div>
        <div class="sm:col-span-2">
          <label for="pf-tagline" class="mb-1.5 block text-sm font-medium text-text">Tagline</label>
          <input id="pf-tagline" v-model="form.tagline" type="text" class="input-field" placeholder="Satu kalimat deskripsi singkat" />
        </div>
        <div class="sm:col-span-2">
          <label for="pf-desc" class="mb-1.5 block text-sm font-medium text-text">Deskripsi</label>
          <textarea id="pf-desc" v-model="form.description" rows="3" class="input-field resize-none" placeholder="Deskripsi project untuk kartu & halaman detail" />
        </div>
      </div>
    </div>

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Metadata</h3>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label for="pf-cat" class="mb-1.5 block text-sm font-medium text-text">Kategori</label>
          <select id="pf-cat" v-model="form.category" class="input-field">
            <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label for="pf-year" class="mb-1.5 block text-sm font-medium text-text">Tahun</label>
          <input id="pf-year" v-model="form.year" type="text" class="input-field" placeholder="2025" />
        </div>
        <div>
          <label for="pf-duration" class="mb-1.5 block text-sm font-medium text-text">Durasi</label>
          <input id="pf-duration" v-model="form.duration" type="text" class="input-field" placeholder="3 Bulan" />
        </div>
        <div>
          <label for="pf-role" class="mb-1.5 block text-sm font-medium text-text">Peran</label>
          <input id="pf-role" v-model="form.role" type="text" class="input-field" placeholder="Full-Stack Developer" />
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
      </div>
    </div>

    <div class="card p-7">
      <h3 class="mb-5 text-base font-bold text-text">Konten</h3>
      <div>
        <label for="pf-tags" class="mb-1.5 block text-sm font-medium text-text">Tags (pisahkan dengan koma)</label>
        <input id="pf-tags" v-model="form.tags" type="text" class="input-field" placeholder="Nuxt.js, Vue.js, Tailwind CSS" />
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

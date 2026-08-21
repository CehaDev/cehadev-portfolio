<script setup lang="ts">
import { LoaderCircle, Save, ImagePlus, Trash2, Eye, PencilLine } from 'lucide-vue-next'
import { renderMarkdown } from '~/utils/markdown'

interface LsValue { id: string; en: string }

const props = withDefaults(
  defineProps<{
    endpoint: string
    method?: 'POST' | 'PUT'
    initial?: Record<string, any> | null
  }>(),
  { method: 'POST', initial: null }
)

const emit = defineEmits<{ saved: [slug: string] }>()

const { lang } = useLang()
const saving = ref(false)
const error = ref('')
const slugTouched = ref(false)

const emptyLs = (): LsValue => ({ id: '', en: '' })
const ls = (v: unknown): LsValue => {
  const o = v as Record<string, unknown> | undefined
  return { id: typeof o?.id === 'string' ? o.id : '', en: typeof o?.en === 'string' ? o.en : '' }
}

const form = reactive({
  slug: props.initial?.slug ?? '',
  title: ls(props.initial?.title),
  excerpt: ls(props.initial?.excerpt),
  category: ls(props.initial?.category),
  tags: ((props.initial?.tags as string[]) ?? []).join(', '),
  cover: props.initial?.cover ?? '',
  status: props.initial?.status === 'draft' ? 'draft' : 'published',
  datePublished: props.initial?.datePublished ?? new Date().toISOString().slice(0, 10),
  seoTitle: ls(props.initial?.seoTitle),
  seoDescription: ls(props.initial?.seoDescription),
  content: ls(props.initial?.content)
})

watch(
  () => form.title.id,
  (val) => {
    if (!slugTouched.value) {
      form.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
    }
  }
)

const words = computed(() => countWordsLs(form.content))
function countWordsLs(v: LsValue) {
  const src = lang.value === 'en' && v.en ? v.en : v.id
  return src.replace(/```[\s\S]*?```/g, ' ').trim().split(/\s+/).filter(Boolean).length
}
const minutes = computed(() => Math.max(words.value ? 1 : 0, Math.round(words.value / 200)))

/* Cover upload */
const uploading = ref(false)
const coverInput = ref<HTMLInputElement | null>(null)

async function uploadCover(file: File) {
  if (uploading.value) return
  uploading.value = true
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('image', file)
    const res = await $fetch<{ ok: boolean; url: string }>('/api/admin/articles/cover', { method: 'POST', body: fd })
    if (res.ok) form.cover = res.url
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal mengunggah cover'
  } finally {
    uploading.value = false
  }
}

async function removeCover() {
  if (!form.cover) return
  await $fetch('/api/admin/articles/cover', { method: 'DELETE', body: { url: form.cover } }).catch(() => {})
  form.cover = ''
}

/* Preview */
type PreviewTab = 'edit' | 'preview'
const previewMode = ref<PreviewTab>('edit')
const previewHtml = ref<Record<'id' | 'en', string>>({ id: '', en: '' })
let previewSeq = 0

watch(previewMode, async (mode) => {
  if (mode !== 'preview') return
  const seq = ++previewSeq
  const [idHtml, enHtml] = await Promise.all([renderMarkdown(form.content.id || ''), renderMarkdown(form.content.en || '')])
  if (seq === previewSeq) previewHtml.value = { id: idHtml, en: enHtml }
})

async function save() {
  if (saving.value) return
  error.value = ''
  if (!form.slug || !form.title.id.trim() || !form.content.id.trim()) {
    error.value = 'Slug, judul (ID), dan isi artikel (ID) wajib diisi.'
    return
  }
  saving.value = true
  try {
    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      cover: form.cover,
      status: form.status,
      datePublished: form.datePublished,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      content: form.content
    }
    await $fetch(props.endpoint, { method: props.method, body: payload })
    emit('saved', form.slug)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal menyimpan artikel'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="save">
    <!-- Status bar -->
    <div class="card flex flex-wrap items-center justify-between gap-4 p-5">
      <div class="flex flex-wrap items-center gap-4">
        <label class="flex cursor-pointer items-center gap-2.5">
          <input v-model="form.status" type="radio" value="published" class="h-4 w-4 accent-violet-500" />
          <span class="text-sm font-medium text-text">Terbitkan</span>
        </label>
        <label class="flex cursor-pointer items-center gap-2.5">
          <input v-model="form.status" type="radio" value="draft" class="h-4 w-4 accent-amber-500" />
          <span class="text-sm font-medium text-text">Draft</span>
        </label>
      </div>
      <div class="flex items-center gap-3">
        <span class="font-mono text-[11px] text-text-muted">{{ words }} kata · ~{{ minutes }} mnt baca</span>
        <button type="submit" class="btn-primary !py-2.5" :disabled="saving">
          <LoaderCircle v-if="saving" :size="15" class="animate-spin" />
          <Save v-else :size="15" :stroke-width="2" />
          Simpan Artikel
        </button>
      </div>
    </div>

    <p v-if="error" class="rounded-btn border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">{{ error }}</p>

    <!-- Identitas -->
    <section class="card space-y-5 p-7">
      <h3 class="text-base font-extrabold text-text">Identitas Artikel</h3>
      <div class="grid gap-5 md:grid-cols-[1fr_260px]">
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Judul *</label>
            <LocaleInput v-model="form.title" id="article-title" placeholder-id="Judul artikel versi Indonesia" placeholder-en="English version title" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Ringkasan / Excerpt</label>
            <LocaleTextarea v-model="form.excerpt" rows="3" placeholder-id="Muncul di kartu artikel & deskripsi SEO..." placeholder-en="Shown on cards & SEO description..." />
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label for="article-slug" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Slug *</label>
            <input
              id="article-slug"
              v-model="form.slug"
              type="text"
              class="input-field font-mono text-sm"
              @input="slugTouched = true"
            />
          </div>
          <div>
            <label for="article-date" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Tanggal Terbit</label>
            <input id="article-date" v-model="form.datePublished" type="date" class="input-field" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Kategori</label>
            <LocaleInput v-model="form.category" placeholder-id="cth: Tutorial" placeholder-en="e.g. Tutorial" />
          </div>
          <div>
            <label for="article-tags" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Tag (pisahkan koma)</label>
            <input id="article-tags" v-model="form.tags" type="text" class="input-field" placeholder="Nuxt.js, Vue, Tips" />
          </div>
        </div>
      </div>
    </section>

    <!-- Cover -->
    <section class="card p-7">
      <h3 class="text-base font-extrabold text-text">Gambar Cover</h3>
      <p class="mt-1 text-xs text-text-muted">Opsional. Rasio ideal 16:9, maksimal 5 MB (JPG/PNG/WEBP/AVIF). Tanpa cover akan dipakai gradien otomatis.</p>
      <div class="mt-4 flex flex-wrap items-start gap-5">
        <div class="card flex aspect-video w-full max-w-xs items-center justify-center overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 p-0" aria-hidden="true">
          <img v-if="form.cover" :src="form.cover" alt="Preview cover" class="h-full w-full object-cover" />
          <span v-else class="font-mono text-3xl font-extrabold text-white/90">&lt;/&gt;</span>
        </div>
        <div class="flex flex-col items-center gap-1 self-center">
          <button type="button" class="btn-outline !py-2.5" :disabled="uploading" @click="coverInput?.click()">
            <LoaderCircle v-if="uploading" :size="15" class="animate-spin" />
            <ImagePlus v-else :size="15" :stroke-width="1.75" />
            {{ form.cover ? 'Ganti Cover' : 'Unggah Cover' }}
          </button>
          <span class="text-[9px] text-text-muted">Tersimpan di Vercel Blob</span>
          <button
            v-if="form.cover"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
            @click="removeCover"
          >
            <Trash2 :size="13" :stroke-width="1.75" />
            Hapus Cover
          </button>
        </div>
        <input ref="coverInput" type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden" @change="(e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadCover(f); (e.target as HTMLInputElement).value = '' }" />
      </div>
    </section>

    <!-- Konten -->
    <section class="card p-7">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-base font-extrabold text-text">Isi Artikel (Markdown)</h3>
          <p class="mt-1 text-xs text-text-muted">Dukung heading, list, kutipan, gambar, dan blok kode dengan syntax highlighting.</p>
        </div>
        <div class="inline-flex items-center gap-1 rounded-btn border border-border bg-card p-1" role="tablist" aria-label="Mode editor">
          <button
            type="button"
            role="tab"
            :aria-selected="previewMode === 'edit'"
            class="inline-flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition-colors"
            :class="previewMode === 'edit' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-muted hover:text-text'"
            @click="previewMode = 'edit'"
          >
            <PencilLine :size="13" :stroke-width="2" />
            Tulis
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="previewMode === 'preview'"
            class="inline-flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition-colors"
            :class="previewMode === 'preview' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-muted hover:text-text'"
            @click="previewMode = 'preview'"
          >
            <Eye :size="13" :stroke-width="2" />
            Pratinjau
          </button>
        </div>
      </div>

      <div v-if="previewMode === 'edit'" class="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <span class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">Konten ID</span>
          <textarea
            v-model="form.content.id"
            rows="18"
            class="input-field resize-y font-mono !text-[13px] leading-relaxed"
            placeholder="# Judul&#10;&#10;Tulis artikel dalam **markdown**..."
          />
        </div>
        <div>
          <span class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">Konten EN</span>
          <textarea
            v-model="form.content.en"
            rows="18"
            class="input-field resize-y font-mono !text-[13px] leading-relaxed"
            placeholder="# Title&#10;&#10;Write your article in **markdown**..."
          />
        </div>
      </div>

      <div v-else class="mt-5 grid gap-6 lg:grid-cols-2">
        <div v-for="l in ['id', 'en'] as const" :key="l">
          <span class="mb-2 inline-flex rounded-full border border-border bg-bg-alt px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-text-muted">{{ l }}</span>
          <div v-if="previewHtml[l]" class="article-preview" v-html="previewHtml[l]" />
          <p v-else class="rounded-card border border-dashed border-border px-4 py-8 text-center text-xs text-text-muted">
            {{ l === 'id' ? 'Konten ID kosong.' : 'EN content is empty.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- SEO -->
    <section class="card space-y-4 p-7">
      <div>
        <h3 class="text-base font-extrabold text-text">SEO</h3>
        <p class="mt-1 text-xs text-text-muted">Opsional — jika kosong, otomatis memakai judul & ringkasan artikel.</p>
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Judul SEO Kustom</label>
        <LocaleInput v-model="form.seoTitle" placeholder-id="Default: judul artikel" placeholder-en="Default: article title" />
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-muted">Deskripsi SEO Kustom</label>
        <LocaleTextarea v-model="form.seoDescription" rows="2" placeholder-id="Default: ringkasan artikel" placeholder-en="Default: article excerpt" />
      </div>
    </section>
  </form>
</template>

<style scoped>
.article-preview {
  @apply rounded-card border border-border/60 bg-bg-alt/40 p-5 text-[14px] leading-relaxed text-text-secondary;
}
.article-preview :deep(h1) { @apply mb-3 mt-6 text-2xl font-bold text-text; }
.article-preview :deep(h2) { @apply mb-2.5 mt-5 text-xl font-bold text-text; }
.article-preview :deep(h3) { @apply mb-2 mt-4 text-lg font-bold text-text; }
.article-preview :deep(p) { @apply my-3; }
.article-preview :deep(a) { @apply text-primary underline underline-offset-4; }
.article-preview :deep(ul) { @apply my-3 list-disc pl-6; }
.article-preview :deep(ol) { @apply my-3 list-decimal pl-6; }
.article-preview :deep(blockquote) { @apply my-4 border-l-4 border-primary/60 pl-4 italic; }
.article-preview :deep(pre) { @apply my-4 overflow-x-auto rounded-xl border border-white/10 text-[13px]; }
.article-preview :deep(pre code) { @apply block p-4 font-mono; }
.article-preview :deep(code):not(:deep(pre code)) { @apply rounded-md border border-border/70 bg-bg-alt px-1 py-0.5 font-mono text-[0.85em] text-primary; }
.article-preview :deep(img) { @apply my-3 w-full rounded-xl; }
</style>

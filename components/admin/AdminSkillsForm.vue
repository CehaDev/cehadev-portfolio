<script setup lang="ts">
import { Plus, Trash2, LoaderCircle, Save, ArrowLeft, ArrowRight, Layers } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

const props = defineProps<{
  initial?: Record<string, any>
}>()

const emit = defineEmits<{ saved: [data: Record<string, unknown>] }>()

const form = reactive({
  marqueeTech: [...(props.initial?.marqueeTech ?? [])]
})

const error = ref('')
const saving = ref(false)
const newTech = ref('')

const knownTechs = computed(() =>
  Object.values(techIcons)
    .map((t) => t.name)
    .filter((name) => !form.marqueeTech.includes(name))
    .sort((a, b) => a.localeCompare(b))
)

function addCustom() {
  const name = newTech.value.trim()
  if (!name) return
  if (!form.marqueeTech.includes(name)) form.marqueeTech.push(name)
  newTech.value = ''
}

function addKnown(name: string) {
  if (!form.marqueeTech.includes(name)) form.marqueeTech.push(name)
}

function removeTech(index: number) {
  form.marqueeTech.splice(index, 1)
}

function moveTech(index: number, dir: -1 | 1) {
  const target = index + dir
  if (target < 0 || target >= form.marqueeTech.length) return
  const list = form.marqueeTech
  ;[list[index], list[target]] = [list[target], list[index]]
}

async function save() {
  if (saving.value) return
  saving.value = true
  error.value = ''
  try {
    const body = { marqueeTech: form.marqueeTech.map((t) => t.trim()).filter(Boolean) }
    const res = await $fetch<{ ok: boolean }>('/api/admin/skills', { method: 'PUT', body })
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
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
            <Layers :size="18" :stroke-width="1.5" />
          </span>
          <div>
            <h3 class="text-base font-bold text-text">Kolom Berjalan — Teknologi yang Dikuasai</h3>
            <p class="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Atur daftar bahasa / teknologi yang tampil berjalan di halaman beranda. Gunakan tombol tambah, hapus, atau ubah urutan dengan panah. Perubahan tersimpan di <code class="rounded bg-bg-alt px-1.5 py-0.5 text-xs text-text-muted">content/skills.json</code>.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-7">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm font-medium text-text">
            Daftar Saat Ini <span class="text-text-muted">({{ form.marqueeTech.length }} item)</span>
          </p>
          <button type="button" class="btn-outline !px-3.5 !py-2 text-xs" @click="addCustom">
            <Plus :size="14" :stroke-width="2" />
            Tambah Custom
          </button>
        </div>

        <ul class="space-y-2.5">
          <li
            v-for="(name, i) in form.marqueeTech"
            :key="i"
            class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold" :style="`color: ${techIcons[name.toLowerCase().replace('&', '').trim()]?.color ?? '#8B5CF6'}; background-color: ${(techIcons[name.toLowerCase().replace('&', '').trim()]?.color ?? '#8B5CF6')}22`" aria-hidden="true">
              {{ techIcons[name.toLowerCase().replace('&', '').trim()]?.glyph ?? name.slice(0, 2).toUpperCase() }}
            </span>
            <span class="min-w-0 flex-1 text-sm font-medium text-text">{{ name }}</span>
            <div class="flex items-center gap-1.5">
              <button type="button" class="rounded-md border border-border p-1.5 text-text-secondary transition-colors hover:border-primary/50 hover:text-text" :aria-label="`Naikkan ${name}`" :disabled="i === 0" @click="moveTech(i, -1)">
                <ArrowLeft :size="14" :stroke-width="1.5" />
              </button>
              <button type="button" class="rounded-md border border-border p-1.5 text-text-secondary transition-colors hover:border-primary/50 hover:text-text" :aria-label="`Turunkan ${name}`" :disabled="i === form.marqueeTech.length - 1" @click="moveTech(i, 1)">
                <ArrowRight :size="14" :stroke-width="1.5" />
              </button>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus ${name}`" @click="removeTech(i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </div>
          </li>
        </ul>

        <p v-if="!form.marqueeTech.length" class="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
          Belum ada teknologi di kolom berjalan. Tambahkan lewat form di bawah.
        </p>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <label for="admin-tech-custom" class="mb-1.5 block text-sm font-medium text-text">Tambah Custom</label>
          <div class="flex gap-2">
            <input id="admin-tech-custom" v-model="newTech" type="text" class="input-field" placeholder="mis. Docker, Figma, React..." @keydown.enter.prevent="addCustom" />
            <button type="button" class="btn-primary shrink-0 !px-4 !py-2.5" @click="addCustom">
              <Plus :size="16" :stroke-width="2" />
              Tambah
            </button>
          </div>
          <p class="mt-1.5 text-xs text-text-muted">Masukkan nama teknologi apa pun, lalu tekan Enter.</p>
        </div>

        <div>
          <p class="mb-1.5 text-sm font-medium text-text">Tambah dari Daftar Dikenal</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="name in knownTechs"
              :key="name"
              type="button"
              class="chip transition-colors hover:border-primary/50 hover:text-text"
              @click="addKnown(name)"
            >
              <span class="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold" :style="`background-color: ${techIcons[name.toLowerCase().replace('&', '').trim()]?.color}22; color: ${techIcons[name.toLowerCase().replace('&', '').trim()]?.color}`" aria-hidden="true">
                {{ techIcons[name.toLowerCase().replace('&', '').trim()]?.glyph }}
              </span>
              {{ name }}
            </button>
            <p v-if="!knownTechs.length" class="text-xs text-text-muted">Semua teknologi sudah ada di daftar.</p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="flex items-center justify-end gap-3">
      <NuxtLink to="/admin" class="btn-outline">Batal</NuxtLink>
      <button type="submit" class="btn-primary" :disabled="saving">
        <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
        <Save v-else :size="16" :stroke-width="2" />
        {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </div>
  </form>
</template>

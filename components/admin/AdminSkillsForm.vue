<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Trash2, LoaderCircle, Save, Wand2, Code2, ListChecks, Star, Wrench } from 'lucide-vue-next'
import { techIcons } from '~/composables/useSkills'

interface LS {
  id: string
  en: string
}
interface SkillItem {
  name: LS
  level: number
  tech: string
}
interface TechSkillItem extends SkillItem {
  category: LS
}
interface SummaryItem {
  label: LS
  value: LS
  icon: string
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
function toHomeSkills(v: unknown): SkillItem[] {
  return Array.isArray(v)
    ? v.map((s) => {
        const o = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>
        return { name: ls(o.name), level: Number(o.level) || 0, tech: str(o.tech) }
      })
    : []
}
function toTechSkills(v: unknown): TechSkillItem[] {
  return Array.isArray(v)
    ? v.map((s) => {
        const o = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>
        return { name: ls(o.name), level: Number(o.level) || 0, tech: str(o.tech), category: ls(o.category) }
      })
    : []
}
function toSummary(v: unknown): SummaryItem[] {
  return Array.isArray(v)
    ? v.map((s) => {
        const o = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>
        return { label: ls(o.label), value: ls(o.value), icon: str(o.icon) || 'Code2' }
      })
    : []
}

const form = reactive({
  homeSkills: toHomeSkills(props.initial?.homeSkills),
  technicalSkills: toTechSkills(props.initial?.technicalSkills),
  marqueeTech: lsList(props.initial?.marqueeTech),
  skillsSummary: toSummary(props.initial?.skillsSummary),
  toolsList: lsList(props.initial?.toolsList),
  softSkills: lsList(props.initial?.softSkills)
})

const error = ref('')
const saving = ref(false)

const techKeys = Object.keys(techIcons)
const summaryIcons = ['Code2', 'Clock', 'FolderGit2', 'GraduationCap', 'Target', 'Activity', 'Users', 'Award', 'Star']

function cleanLs(v: LS): { id: string; en: string } {
  return { id: v.id.trim(), en: v.en.trim() }
}
function hasText(v: LS): boolean {
  return Boolean(v.id.trim() || v.en.trim())
}

function emptyLS(): LS {
  return { id: '', en: '' }
}
function emptySkill(): SkillItem {
  return { name: { id: '', en: '' }, level: 80, tech: 'javascript' }
}
function emptyTechSkill(): TechSkillItem {
  return { name: { id: '', en: '' }, level: 80, tech: 'javascript', category: { id: '', en: '' } }
}
function emptySummary(): SummaryItem {
  return { label: { id: '', en: '' }, value: { id: '', en: '' }, icon: 'Code2' }
}

function addItem<T>(list: T[], empty: () => T) {
  list.push(empty())
}
function removeItem<T>(list: T[], index: number) {
  list.splice(index, 1)
}

function validate() {
  if (!form.homeSkills.length && !form.technicalSkills.length) {
    error.value = 'Tambahkan minimal satu skill'
    return false
  }
  error.value = ''
  return true
}

function payload() {
  return {
    homeSkills: form.homeSkills
      .map((s) => ({ name: cleanLs(s.name), level: Number(s.level) || 0, tech: s.tech }))
      .filter((s) => hasText(s.name)),
    technicalSkills: form.technicalSkills
      .map((s) => ({ name: cleanLs(s.name), level: Number(s.level) || 0, tech: s.tech, category: cleanLs(s.category) }))
      .filter((s) => hasText(s.name)),
    marqueeTech: form.marqueeTech.map(cleanLs).filter(hasText),
    skillsSummary: form.skillsSummary
      .map((s) => ({ label: cleanLs(s.label), value: cleanLs(s.value), icon: s.icon }))
      .filter((s) => hasText(s.label)),
    toolsList: form.toolsList.map(cleanLs).filter(hasText),
    softSkills: form.softSkills.map(cleanLs).filter(hasText)
  }
}

async function save() {
  if (saving.value || !validate()) return
  saving.value = true
  error.value = ''
  try {
    const body = payload()
    const res = await $fetch<{ ok: boolean }>('/api/admin/skills', { method: 'PUT', body })
    if (res.ok) emit('saved', body)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal menyimpan skill, coba lagi'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="space-y-8" novalidate @submit.prevent="save">
    <!-- Bagian 1: Home Skills -->
    <div class="card p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <Code2 :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Home Skills
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 1</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Daftar skill pada bagian skill beranda. Nama dan kategori dapat diisi dua bahasa.</p>
        </div>
      </div>
      <div class="mb-3 flex items-center justify-between">
        <p class="text-sm font-medium text-text">Daftar Skill</p>
        <div class="flex flex-col items-end gap-1">
          <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.homeSkills, emptySkill)">
            <Plus :size="14" :stroke-width="2" />
            Tambah
          </button>
          <span class="text-[9px] text-text-muted">Tambah skill baru</span>
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="(s, i) in form.homeSkills" :key="i" class="rounded-lg border border-border bg-bg p-4">
          <div class="mb-3 flex items-center justify-between">
            <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
              Skill {{ i + 1 }}
            </span>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.homeSkills, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-text">Nama</label>
              <LocaleInput :id="`hs-name-${i}`" v-model="s.name" placeholder="JavaScript" />
            </div>
            <div>
              <label :for="`hs-tech-${i}`" class="mb-1 block text-xs font-medium text-text">Tech Key</label>
              <select :id="`hs-tech-${i}`" v-model="s.tech" class="input-field !py-2">
                <option v-for="key in techKeys" :key="key" :value="key">{{ techIcons[key].name }}</option>
              </select>
            </div>
          </div>
          <div class="mt-3">
            <div class="mb-1.5 flex items-center justify-between">
              <label :for="`hs-level-${i}`" class="text-xs font-medium text-text">Level</label>
              <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">{{ s.level }}%</span>
            </div>
            <input :id="`hs-level-${i}`" v-model.number="s.level" type="range" min="0" max="100" step="1" class="w-full cursor-pointer accent-primary" />
          </div>
        </div>
        <p v-if="!form.homeSkills.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
          Belum ada skill. Klik "Tambah" untuk menambahkan.
        </p>
      </div>
    </div>

    <!-- Bagian 2: Technical Skills -->
    <div class="card p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <Wand2 :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Technical Skills
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 2</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Skill teknis dengan kategori untuk halaman skill.</p>
        </div>
      </div>
      <div class="mb-3 flex items-center justify-between">
        <p class="text-sm font-medium text-text">Daftar Skill Teknis</p>
        <div class="flex flex-col items-end gap-1">
          <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.technicalSkills, emptyTechSkill)">
            <Plus :size="14" :stroke-width="2" />
            Tambah
          </button>
          <span class="text-[9px] text-text-muted">Tambah skill teknis</span>
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="(s, i) in form.technicalSkills" :key="i" class="rounded-lg border border-border bg-bg p-4">
          <div class="mb-3 flex items-center justify-between">
            <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
              Skill {{ i + 1 }}
            </span>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.technicalSkills, i)">
              <Trash2 :size="12" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-text">Nama</label>
              <LocaleInput :id="`ts-name-${i}`" v-model="s.name" placeholder="Vue.js" />
            </div>
            <div>
              <label :for="`ts-tech-${i}`" class="mb-1 block text-xs font-medium text-text">Tech Key</label>
              <select :id="`ts-tech-${i}`" v-model="s.tech" class="input-field !py-2">
                <option v-for="key in techKeys" :key="key" :value="key">{{ techIcons[key].name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-text">Kategori</label>
              <LocaleInput :id="`ts-category-${i}`" v-model="s.category" placeholder="Framework" />
            </div>
          </div>
          <div class="mt-3">
            <div class="mb-1.5 flex items-center justify-between">
              <label :for="`ts-level-${i}`" class="text-xs font-medium text-text">Level</label>
              <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">{{ s.level }}%</span>
            </div>
            <input :id="`ts-level-${i}`" v-model.number="s.level" type="range" min="0" max="100" step="1" class="w-full cursor-pointer accent-primary" />
          </div>
        </div>
        <p v-if="!form.technicalSkills.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
          Belum ada skill teknis. Klik "Tambah" untuk menambahkan.
        </p>
      </div>
    </div>

    <!-- Bagian 3: Skills Summary & Marquee -->
    <div class="card p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <Star :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Skills Summary &amp; Marquee
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 3</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Kartu ringkasan angka dan teks berjalan di halaman skill.</p>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Kartu Ringkasan</p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.skillsSummary, emptySummary)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah kartu</span>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="(s, i) in form.skillsSummary" :key="i" class="rounded-lg border border-border bg-bg p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
                  Kartu {{ i + 1 }}
                </span>
                <button type="button" class="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10" @click="removeItem(form.skillsSummary, i)">
                  <Trash2 :size="12" :stroke-width="1.5" />
                  Hapus
                </button>
              </div>
              <div class="grid gap-3 sm:grid-cols-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Label</label>
                  <LocaleInput :id="`ss-label-${i}`" v-model="s.label" placeholder="Teknologi" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-text">Nilai</label>
                  <LocaleInput :id="`ss-value-${i}`" v-model="s.value" placeholder="10+" />
                </div>
                <div>
                  <label :for="`ss-icon-${i}`" class="mb-1 block text-xs font-medium text-text">Ikon</label>
                  <select :id="`ss-icon-${i}`" v-model="s.icon" class="input-field !py-2">
                    <option v-for="ic in summaryIcons" :key="ic" :value="ic">{{ ic }}</option>
                  </select>
                </div>
              </div>
            </div>
            <p v-if="!form.skillsSummary.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada kartu ringkasan.
            </p>
          </div>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Marquee Tech</p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.marqueeTech, emptyLS)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah tech</span>
            </div>
          </div>
          <ul class="space-y-2">
            <li v-for="(m, i) in form.marqueeTech" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
              <div class="min-w-0 flex-1">
                <LocaleInput v-model="form.marqueeTech[i]" placeholder="Vue.js" />
              </div>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus marquee ${i + 1}`" @click="removeItem(form.marqueeTech, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </li>
            <p v-if="!form.marqueeTech.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada item marquee.
            </p>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bagian 4: Soft Skills & Tools -->
    <div class="card p-7">
      <div class="mb-6 flex items-center gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
          <ListChecks :size="20" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="flex flex-wrap items-center gap-2 text-base font-bold text-text">
            Soft Skills &amp; Tools
            <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Bagian 4</span>
          </h3>
          <p class="mt-0.5 text-xs text-text-muted">Kemampuan non-teknis dan perangkat yang biasa dipakai.</p>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-medium text-text">Soft Skills</p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.softSkills, emptyLS)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah soft skill</span>
            </div>
          </div>
          <ul class="space-y-2">
            <li v-for="(s, i) in form.softSkills" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
              <div class="min-w-0 flex-1">
                <LocaleInput v-model="form.softSkills[i]" placeholder="Komunikasi" />
              </div>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus soft skill ${i + 1}`" @click="removeItem(form.softSkills, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </li>
            <p v-if="!form.softSkills.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada soft skill.
            </p>
          </ul>
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <p class="flex items-center gap-2 text-sm font-medium text-text">
              <Wrench :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
              Tools
            </p>
            <div class="flex flex-col items-end gap-1">
              <button type="button" class="btn-outline !px-3 !py-2 text-xs" @click="addItem(form.toolsList, emptyLS)">
                <Plus :size="14" :stroke-width="2" />
                Tambah
              </button>
              <span class="text-[9px] text-text-muted">Tambah tool</span>
            </div>
          </div>
          <ul class="space-y-2">
            <li v-for="(t, i) in form.toolsList" :key="i" class="flex items-center gap-3 rounded-lg border border-border bg-bg px-3 py-2.5">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[11px] font-bold text-white" aria-hidden="true">{{ i + 1 }}</span>
              <div class="min-w-0 flex-1">
                <LocaleInput v-model="form.toolsList[i]" placeholder="VS Code" />
              </div>
              <button type="button" class="rounded-md border border-red-500/30 p-1.5 text-red-400 transition-colors hover:bg-red-500/10" :aria-label="`Hapus tool ${i + 1}`" @click="removeItem(form.toolsList, i)">
                <Trash2 :size="14" :stroke-width="1.5" />
              </button>
            </li>
            <p v-if="!form.toolsList.length" class="rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-text-muted">
              Belum ada tool.
            </p>
          </ul>
        </div>
      </div>
    </div>

    <p v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="sticky bottom-4 z-20 rounded-card border border-border bg-card/95 p-4 shadow-card backdrop-blur lg:static lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
      <div class="flex flex-wrap items-center justify-end gap-6">
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/admin" class="btn-outline">Batal</NuxtLink>
          <span class="text-[9px] text-text-muted">Batalkan &amp; kembali</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <button type="submit" class="btn-primary" :disabled="saving">
            <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
            <Save v-else :size="16" :stroke-width="2" />
            {{ saving ? 'Menyimpan...' : 'Simpan Skill' }}
          </button>
          <span class="text-[9px] text-text-muted">Simpan perubahan ke content/skills.json</span>
        </div>
      </div>
    </div>
  </form>
</template>

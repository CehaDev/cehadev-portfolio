<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Check, Plus, Trash2, ListTodo, BarChart3, User } from 'lucide-vue-next'
import { loadDemo, saveDemo } from '~/utils/demoStorage'

const props = defineProps<{ storageKey?: string }>()

interface Task {
  id: number
  title: string
  priority: 'tinggi' | 'sedang' | 'rendah'
  done: boolean
}

const priorityMeta: Record<Task['priority'], { label: string; color: string }> = {
  tinggi: { label: 'Tinggi', color: '#F43F5E' },
  sedang: { label: 'Sedang', color: '#F59E0B' },
  rendah: { label: 'Rendah', color: '#22C55E' }
}

const seed: Task[] = [
  { id: 1, title: 'Rapat sprint mingguan', priority: 'sedang', done: false },
  { id: 2, title: 'Kirim proposal ke klien', priority: 'tinggi', done: false },
  { id: 3, title: 'Push update dokumentasi API', priority: 'sedang', done: false },
  { id: 4, title: 'Review pull request tim', priority: 'rendah', done: false },
  { id: 5, title: 'Bayar tagihan domain', priority: 'tinggi', done: true },
  { id: 6, title: 'Buat wireframe landing page', priority: 'sedang', done: true }
]

const storageKey = props.storageKey || 'cehadev-demo-todo'
const tasks = ref<Task[]>(loadDemo<Task[]>(storageKey, seed))
watch(tasks, (v) => saveDemo(storageKey, v), { deep: true })

const view = ref<'tasks' | 'stats' | 'profile'>('tasks')
const filter = ref<'all' | 'active' | 'done'>('all')
const newTitle = ref('')
const newPriority = ref<Task['priority']>('sedang')
let nextId = Math.max(...tasks.value.map((t) => t.id), 0) + 1

const visible = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.done)
  if (filter.value === 'done') return tasks.value.filter((t) => t.done)
  return tasks.value
})
const doneCount = computed(() => tasks.value.filter((t) => t.done).length)
const progress = computed(() => (tasks.value.length ? Math.round((doneCount.value / tasks.value.length) * 100) : 0))
const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

function addTask() {
  const title = newTitle.value.trim()
  if (!title) return
  tasks.value.push({ id: nextId++, title, priority: newPriority.value, done: false })
  newTitle.value = ''
}

function toggle(t: Task) {
  t.done = !t.done
}

function remove(id: number) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}
</script>

<template>
  <div class="flex h-full min-h-[540px] flex-col bg-bg text-text">
    <!-- Header -->
    <header class="px-4 pb-3 pt-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{{ today }}</p>
          <p class="text-lg font-extrabold tracking-tight text-text">TaskFlow <span class="bg-gradient-brand bg-clip-text text-transparent">Mobile</span></p>
        </div>
        <span class="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-primary">
          <User :size="14" :stroke-width="1.75" />
          <span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-success" aria-hidden="true" />
        </span>
      </div>

      <div class="mt-3 rounded-card border border-border bg-card p-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-text">{{ doneCount }} dari {{ tasks.length }} selesai</span>
          <span class="font-bold text-primary">{{ progress }}%</span>
        </div>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-alt">
          <div class="h-full rounded-full bg-gradient-brand transition-all duration-500" :style="{ width: progress + '%' }" />
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <div class="mx-4 grid grid-cols-3 gap-1 rounded-btn border border-border bg-card p-1">
      <button
        v-for="(v, key) in { tasks: 'Tugas', stats: 'Statistik', profile: 'Profil' } as Record<string, string>"
        :key="key"
        type="button"
        class="inline-flex items-center justify-center gap-1.5 rounded-[8px] py-2 text-[11px] font-bold transition-colors"
        :class="view === key ? 'bg-gradient-brand text-white' : 'text-text-secondary'"
        @click="view = key as 'tasks' | 'stats' | 'profile'"
      >
        <ListTodo v-if="key === 'tasks'" :size="13" :stroke-width="2" />
        <BarChart3 v-else-if="key === 'stats'" :size="13" :stroke-width="2" />
        <User v-else :size="13" :stroke-width="2" />
        {{ v }}
      </button>
    </div>

    <!-- Konten -->
    <div class="flex-1 overflow-y-auto px-4 pb-4 pt-3">
      <!-- Tugas -->
      <template v-if="view === 'tasks'">
        <form class="flex gap-2" @submit.prevent="addTask">
          <input v-model="newTitle" type="text" class="input-field min-w-0 flex-1 !py-2 text-xs" placeholder="Tugas baru..." />
          <button type="submit" class="btn-primary shrink-0 !px-3 !py-2" aria-label="Tambah tugas">
            <Plus :size="16" :stroke-width="2" />
          </button>
        </form>
        <div class="mt-2 flex items-center gap-1">
          <button
            v-for="f in ['all', 'active', 'done'] as const"
            :key="f"
            type="button"
            class="rounded-full px-2.5 py-1 text-[10px] font-bold capitalize transition-colors"
            :class="filter === f ? 'bg-card text-text shadow-card' : 'text-text-muted'"
            @click="filter = f"
          >
            {{ f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Selesai' }}
          </button>
          <div class="ml-auto flex items-center gap-1">
            <button
              v-for="(m, key) in priorityMeta"
              :key="key"
              type="button"
              class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase transition-colors"
              :class="newPriority === key ? 'text-white' : 'text-text-muted'"
              :style="newPriority === key ? { backgroundColor: m.color } : {}"
              @click="newPriority = key"
            >
              {{ m.label }}
            </button>
          </div>
        </div>

        <ul class="mt-3 space-y-2">
          <li
            v-for="t in visible"
            :key="t.id"
            class="flex items-center gap-2.5 rounded-card border border-border bg-card px-3 py-2.5"
            :class="t.done ? 'opacity-60' : ''"
          >
            <button
              type="button"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
              :class="t.done ? 'border-transparent bg-gradient-brand text-white' : 'border-border text-transparent'"
              :aria-label="`Tandai ${t.title}`"
              @click="toggle(t)"
            >
              <Check :size="13" :stroke-width="2.5" />
            </button>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-semibold text-text" :class="t.done ? 'line-through' : ''">{{ t.title }}</p>
              <span class="text-[9px] font-bold uppercase" :style="{ color: priorityMeta[t.priority].color }">{{ priorityMeta[t.priority].label }}</span>
            </div>
            <button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400" :aria-label="`Hapus ${t.title}`" @click="remove(t.id)">
              <Trash2 :size="13" :stroke-width="1.5" />
            </button>
          </li>
          <li v-if="!visible.length" class="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-text-muted">
            Tidak ada tugas.
          </li>
        </ul>
      </template>

      <!-- Statistik -->
      <template v-else-if="view === 'stats'">
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-card border border-border bg-card p-3.5 text-center">
            <p class="text-2xl font-extrabold text-text">{{ tasks.length }}</p>
            <p class="text-[11px] text-text-muted">Total Tugas</p>
          </div>
          <div class="rounded-card border border-border bg-card p-3.5 text-center">
            <p class="text-2xl font-extrabold text-success">{{ doneCount }}</p>
            <p class="text-[11px] text-text-muted">Selesai</p>
          </div>
          <div class="rounded-card border border-border bg-card p-3.5 text-center">
            <p class="text-2xl font-extrabold text-amber-400">{{ tasks.length - doneCount }}</p>
            <p class="text-[11px] text-text-muted">Tertunda</p>
          </div>
          <div class="rounded-card border border-border bg-card p-3.5 text-center">
            <p class="text-2xl font-extrabold text-primary">{{ progress }}%</p>
            <p class="text-[11px] text-text-muted">Progress</p>
          </div>
        </div>

        <div class="mt-4 rounded-card border border-border bg-card p-4">
          <p class="text-xs font-bold text-text">Prioritas</p>
          <div class="mt-3 space-y-2.5">
            <div v-for="(m, key) in priorityMeta" :key="key" class="flex items-center gap-2">
              <span class="w-14 text-[10px] font-semibold" :style="{ color: m.color }">{{ m.label }}</span>
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-bg-alt">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: (tasks.filter((t) => t.priority === key).length / Math.max(tasks.length, 1)) * 100 + '%', backgroundColor: m.color }"
                />
              </div>
              <span class="w-5 text-right text-[10px] font-bold text-text">{{ tasks.filter((t) => t.priority === key).length }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Profil -->
      <template v-else>
        <div class="rounded-card border border-border bg-card p-5 text-center">
          <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-xl font-extrabold text-white">CD</span>
          <p class="mt-3 text-sm font-extrabold text-text">CehaDev</p>
          <p class="text-[11px] text-text-muted">Web Developer</p>
          <p class="mt-1 text-[11px] text-text-muted">cehadev@example.com</p>
        </div>
        <ul class="mt-3 divide-y divide-border/60 rounded-card border border-border bg-card">
          <li v-for="(item, i) in ['Akun', 'Notifikasi', 'Sinkronisasi Cloud', 'Pengaturan']" :key="item" class="flex items-center gap-3 px-4 py-3 text-xs font-medium text-text">
            <span class="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden="true" />
            {{ item }}
            <span v-if="i === 2" class="ml-auto inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[9px] font-bold text-success">
              <span class="h-1 w-1 rounded-full bg-success" aria-hidden="true" />
              ON
            </span>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

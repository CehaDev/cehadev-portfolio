<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Plus, ChevronLeft, ChevronRight, Trash2, MessageSquare } from 'lucide-vue-next'
import { loadDemo, saveDemo } from '~/utils/demoStorage'

const props = defineProps<{ storageKey?: string }>()

interface Task {
  id: number
  title: string
  priority: 'tinggi' | 'sedang' | 'rendah'
  col: string
  assignee: number
}

const members = [
  { initials: 'CD', color: '#8B5CF6' },
  { initials: 'AR', color: '#F59E0B' },
  { initials: 'DS', color: '#22C55E' },
  { initials: 'NF', color: '#3B82F6' }
]

const columns = [
  { id: 'backlog', title: 'Backlog', color: '#8B5CF6' },
  { id: 'progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'done', title: 'Done', color: '#22C55E' }
]

const priorityMeta: Record<Task['priority'], { label: string; color: string }> = {
  tinggi: { label: 'Tinggi', color: '#F43F5E' },
  sedang: { label: 'Sedang', color: '#F59E0B' },
  rendah: { label: 'Rendah', color: '#22C55E' }
}

const seed: Task[] = [
  { id: 1, title: 'Desain halaman landing baru', priority: 'tinggi', col: 'backlog', assignee: 0 },
  { id: 2, title: 'Perbaiki bug filter produk', priority: 'sedang', col: 'backlog', assignee: 1 },
  { id: 3, title: 'Integrasi notifikasi email', priority: 'tinggi', col: 'progress', assignee: 2 },
  { id: 4, title: 'Optimasi query dashboard', priority: 'sedang', col: 'progress', assignee: 0 },
  { id: 5, title: 'Setup CI/CD otomatis', priority: 'rendah', col: 'done', assignee: 3 },
  { id: 6, title: 'Review keamanan autentikasi', priority: 'tinggi', col: 'done', assignee: 1 }
]

const storageKey = props.storageKey || 'cehadev-demo-kanban'
const tasks = ref<Task[]>(loadDemo<Task[]>(storageKey, seed))
watch(tasks, (v) => saveDemo(storageKey, v), { deep: true })

const showForm = ref(false)
const newTitle = ref('')
const newPriority = ref<Task['priority']>('sedang')
let nextId = Math.max(...tasks.value.map((t) => t.id), 0) + 1

function tasksOf(col: string) {
  return tasks.value.filter((t) => t.col === col)
}

function addTask() {
  const title = newTitle.value.trim()
  if (!title) return
  tasks.value.push({
    id: nextId++,
    title,
    priority: newPriority.value,
    col: 'backlog',
    assignee: Math.floor(Math.random() * members.length)
  })
  newTitle.value = ''
  showForm.value = false
}

function move(task: Task, dir: -1 | 1) {
  const i = columns.findIndex((c) => c.id === task.col)
  const next = columns[i + dir]
  if (!next) return
  task.col = next.id
}

function remove(id: number) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}
</script>

<template>
  <div class="flex h-full min-h-[540px] flex-col bg-bg text-text">
    <!-- Header board -->
    <header class="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-sm font-extrabold text-white">MG</span>
        <div class="min-w-0 leading-tight">
          <p class="truncate text-sm font-extrabold tracking-tight">Magerans — Sprint Board</p>
          <p class="flex items-center gap-1.5 text-[10px] text-text-muted">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true" />
            Kolaborasi tim real-time
          </p>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <div class="hidden items-center sm:flex" aria-hidden="true">
          <span
            v-for="(m, i) in members"
            :key="m.initials"
            class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
            :style="{ backgroundColor: m.color, zIndex: 4 - i, marginLeft: i ? '-6px' : '0' }"
          >
            {{ m.initials }}
          </span>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-btn border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          @click="showForm = true"
        >
          <Plus :size="14" :stroke-width="2" />
          Tugas
        </button>
      </div>
    </header>

    <!-- Form tambah tugas -->
    <form v-if="showForm" class="border-b border-border bg-card px-4 py-3" @submit.prevent="addTask">
      <div class="flex flex-wrap items-center gap-2">
        <input v-model="newTitle" type="text" class="input-field min-w-0 flex-1 !py-2 text-xs" placeholder="Judul tugas baru..." />
        <div class="flex items-center gap-1 rounded-btn border border-border bg-bg p-1">
          <button
            v-for="(m, key) in priorityMeta"
            :key="key"
            type="button"
            class="rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
            :class="newPriority === key ? 'text-white' : 'text-text-secondary hover:text-text'"
            :style="newPriority === key ? { backgroundColor: m.color } : {}"
            @click="newPriority = key"
          >
            {{ m.label }}
          </button>
        </div>
        <button type="submit" class="btn-primary !px-4 !py-2 text-xs">Tambah</button>
        <button type="button" class="btn-outline !px-4 !py-2 text-xs" @click="showForm = false">Batal</button>
      </div>
    </form>

    <!-- Kolom kanban -->
    <div class="flex flex-1 items-stretch gap-4 overflow-x-auto p-4">
      <div v-for="col in columns" :key="col.id" class="flex w-64 shrink-0 flex-col rounded-card border border-border bg-card-alt/60">
        <div class="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p class="flex items-center gap-2 text-xs font-bold text-text">
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: col.color }" aria-hidden="true" />
            {{ col.title }}
          </p>
          <span class="rounded-full bg-bg px-2 py-0.5 text-[10px] font-bold text-text-muted">{{ tasksOf(col.id).length }}</span>
        </div>
        <div class="flex-1 space-y-2.5 overflow-y-auto p-3">
          <div
            v-for="t in tasksOf(col.id)"
            :key="t.id"
            class="group rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-xs font-semibold leading-snug text-text">{{ t.title }}</p>
              <button type="button" class="rounded-md p-1 text-text-muted opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100" :aria-label="`Hapus ${t.title}`" @click="remove(t.id)">
                <Trash2 :size="13" :stroke-width="1.5" />
              </button>
            </div>
            <div class="mt-2.5 flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  :style="{ backgroundColor: priorityMeta[t.priority].color + '22', color: priorityMeta[t.priority].color }"
                >
                  {{ priorityMeta[t.priority].label }}
                </span>
                <span
                  class="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  :style="{ backgroundColor: members[t.assignee].color }"
                  :title="`Anggota ${members[t.assignee].initials}`"
                >
                  {{ members[t.assignee].initials }}
                </span>
              </div>
              <div class="flex items-center gap-0.5">
                <button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:text-text disabled:opacity-30" :disabled="columns.findIndex((c) => c.id === t.col) === 0" :aria-label="`Pindah ${t.title} ke kiri`" @click="move(t, -1)">
                  <ChevronLeft :size="14" :stroke-width="2" />
                </button>
                <button type="button" class="rounded-md p-1 text-text-muted transition-colors hover:text-text disabled:opacity-30" :disabled="columns.findIndex((c) => c.id === t.col) === columns.length - 1" :aria-label="`Pindah ${t.title} ke kanan`" @click="move(t, 1)">
                  <ChevronRight :size="14" :stroke-width="2" />
                </button>
              </div>
            </div>
          </div>
          <p v-if="!tasksOf(col.id).length" class="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-text-muted">
            Kosong
          </p>
        </div>
      </div>

      <div class="flex w-56 shrink-0 items-center justify-center rounded-card border border-dashed border-border text-center">
        <div>
          <MessageSquare :size="22" :stroke-width="1.5" class="mx-auto text-text-muted" />
          <p class="mt-2 text-xs font-semibold text-text-secondary">Diskusi tim</p>
          <p class="mt-1 px-4 text-[11px] text-text-muted">Chat & komentar tersedia di aplikasi penuh.</p>
        </div>
      </div>
    </div>
  </div>
</template>

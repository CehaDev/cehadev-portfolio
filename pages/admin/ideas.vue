<script setup lang="ts">
import { Lightbulb, Plus, Trash2, LoaderCircle, MessageSquare, Sparkles, Users, PenLine, Check, Archive } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Ide'
})

interface IdeaRow {
  id: string
  raw_idea: string
  source_type: 'HUMAN' | 'AI' | 'HUMAN_AI'
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'DISCARDED'
  linked_article_id: string
  created_at: string
  updated_at: string
}

const { data: ideas, refresh } = await useAsyncData<IdeaRow[]>('admin-ideas', () =>
  useRequestFetch()<IdeaRow[]>('/api/admin/manage/ideas')
)

const newIdea = ref('')
const busy = ref<string | null>(null)
const adding = ref(false)

const counts = computed(() => {
  const list = ideas.value ?? []
  return {
    total: list.length,
    open: list.filter((i) => i.status === 'OPEN').length,
    done: list.filter((i) => i.status === 'DONE').length
  }
})

const sourceMeta: Record<IdeaRow['source_type'], { label: string; cls: string; icon: any }> = {
  HUMAN: { label: 'Human', cls: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400', icon: Users },
  AI: { label: 'AI', cls: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-400', icon: Sparkles },
  HUMAN_AI: { label: 'Human+AI', cls: 'border-primary/30 bg-primary/10 text-primary', icon: PenLine }
}

const statusMeta: Record<IdeaRow['status'], { label: string; cls: string }> = {
  OPEN: { label: 'Terbuka', cls: 'border-amber-400/30 bg-amber-400/10 text-amber-400' },
  IN_PROGRESS: { label: 'Dikerjakan', cls: 'border-blue-400/30 bg-blue-400/10 text-blue-400' },
  DONE: { label: 'Selesai', cls: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' },
  DISCARDED: { label: 'Dibuang', cls: 'border-border bg-card text-text-muted' }
}

function dateLabel(d: string) {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

async function addIdea() {
  const text = newIdea.value.trim()
  if (!text || adding.value) return
  adding.value = true
  try {
    await $fetch('/api/admin/manage/ideas', { method: 'POST', body: { raw_idea: text } })
    newIdea.value = ''
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    alert(err.data?.message ?? 'Gagal menambah ide')
  } finally {
    adding.value = false
  }
}

async function setStatus(id: string, status: IdeaRow['status']) {
  if (busy.value) return
  busy.value = id
  try {
    await $fetch(`/api/admin/manage/ideas/${id}`, { method: 'PUT', body: { status } })
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    alert(err.data?.message ?? 'Gagal mengubah status ide')
  } finally {
    busy.value = null
  }
}

async function removeIdea(id: string) {
  if (busy.value) return
  busy.value = `del-${id}`
  try {
    await $fetch(`/api/admin/manage/ideas/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    alert(err.data?.message ?? 'Gagal menghapus ide')
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-btn-glow" aria-hidden="true">
            <Lightbulb :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Inbox Ide</h2>
            <p class="mt-1 text-sm text-text-secondary">Kumpulkan ide tulisan (dari Telegram, AI, atau Anda sendiri) dan konversi menjadi artikel nanti.</p>
          </div>
        </div>
        <div class="flex items-center gap-4 text-center">
          <div>
            <p class="font-mono text-2xl font-extrabold text-text">{{ counts.total }}</p>
            <p class="text-[10px] font-medium text-text-muted">Total</p>
          </div>
          <div>
            <p class="font-mono text-2xl font-extrabold text-amber-400">{{ counts.open }}</p>
            <p class="text-[10px] font-medium text-text-muted">Terbuka</p>
          </div>
          <div>
            <p class="font-mono text-2xl font-extrabold text-emerald-400">{{ counts.done }}</p>
            <p class="text-[10px] font-medium text-text-muted">Selesai</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tambah ide -->
    <form class="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center" @submit.prevent="addIdea">
      <div class="flex flex-1 items-center gap-3">
        <span class="hidden text-amber-400 sm:block" aria-hidden="true"><Lightbulb :size="18" :stroke-width="1.75" /></span>
        <input
          v-model="newIdea"
          type="text"
          class="input-field !py-3 text-sm"
          placeholder="Tulis ide artikel baru... mis. 'Cara optimasi Core Web Vitals'"
          aria-label="Isi ide baru"
          @keydown.enter="addIdea"
        />
      </div>
      <button type="submit" class="btn-primary !px-5 !py-3" :disabled="adding || !newIdea.trim()">
        <LoaderCircle v-if="adding" :size="16" class="animate-spin" />
        <Plus v-else :size="16" :stroke-width="2" />
        Simpan Ide
      </button>
    </form>

    <!-- Daftar ide -->
    <div class="card overflow-hidden p-0">
      <ul class="divide-y divide-border/60">
        <li v-for="i in ideas ?? []" :key="i.id" class="flex flex-col gap-3 px-7 py-4 transition-colors hover:bg-card/40 sm:flex-row sm:items-center">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-text">{{ i.raw_idea }}</p>
            <div class="mt-1.5 flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold" :class="sourceMeta[i.source_type].cls">
                <component :is="sourceMeta[i.source_type].icon" :size="10" :stroke-width="2" />
                {{ sourceMeta[i.source_type].label }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold" :class="statusMeta[i.status].cls">
                {{ statusMeta[i.status].label }}
              </span>
              <span class="text-[10px] text-text-muted">{{ dateLabel(i.created_at) }}</span>
              <code v-if="i.linked_article_id" class="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-text-muted">{{ i.linked_article_id }}</code>
            </div>
          </div>
          <div class="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-btn border px-3 py-2 text-xs font-medium transition-colors"
              :class="i.status === 'IN_PROGRESS' ? 'border-blue-400/40 bg-blue-400/10 text-blue-400' : 'border-border text-text-secondary hover:border-blue-400/50 hover:text-blue-400'"
              @click="setStatus(i.id, 'IN_PROGRESS')"
            >
              <LoaderCircle v-if="busy === i.id" :size="13" class="animate-spin" />
              <MessageSquare v-else :size="13" :stroke-width="1.75" />
              Kerjakan
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-btn border px-3 py-2 text-xs font-medium transition-colors"
              :class="i.status === 'DONE' ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400' : 'border-border text-text-secondary hover:border-emerald-400/50 hover:text-emerald-400'"
              @click="setStatus(i.id, 'DONE')"
            >
              <Check :size="13" :stroke-width="1.75" />
              Selesai
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-btn border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
              @click="removeIdea(i.id)"
            >
              <LoaderCircle v-if="busy === `del-${i.id}`" :size="13" class="animate-spin" />
              <Trash2 v-else :size="13" :stroke-width="1.75" />
              Hapus
            </button>
          </div>
        </li>
        <li v-if="!(ideas ?? []).length" class="px-7 py-14 text-center">
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400" aria-hidden="true">
            <Archive :size="22" :stroke-width="1.75" />
          </span>
          <p class="mt-3 text-sm font-medium text-text-secondary">Belum ada ide. Tambahkan ide pertama Anda, atau kirim lewat Telegram nanti.</p>
        </li>
      </ul>
    </div>
  </div>
</template>

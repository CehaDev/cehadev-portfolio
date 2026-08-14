<script setup lang="ts">
import { Send, CheckCircle2, Circle, Trash2, LoaderCircle, Inbox, MessageSquare, User, ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Chat'
})

interface ConvSummary {
  id: string
  visitor: { name: string; email: string }
  status: 'open' | 'resolved'
  unread: number
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessage: { id: string; role: 'visitor' | 'admin'; text: string; at: string } | null
}

interface Thread {
  id: string
  visitor: { name: string; email: string }
  status: 'open' | 'resolved'
  messages: Array<{ id: string; role: 'visitor' | 'admin'; text: string; at: string }>
}

const { data: convs, refresh } = await useAsyncData('admin-chat-conversations', () =>
  useRequestFetch()<ConvSummary[]>('/api/admin/chat/conversations')
)
const { data: cfg, refresh: refreshCfg } = await useAsyncData('admin-chat-config', () =>
  useRequestFetch()<{ enabled: boolean }>('/api/admin/chat/config')
)

const activeId = ref<string | null>(null)
const thread = ref<Thread | null>(null)
const replyText = ref('')
const sending = ref(false)
const busyDelete = ref(false)
const threadEl = ref<HTMLElement | null>(null)

const activeConv = computed(() => convs.value?.find((c) => c.id === activeId.value) ?? null)

function formatTime(at: string) {
  return new Date(at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatDay(at: string) {
  const d = new Date(at)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function scrollToBottom() {
  nextTick(() => {
    if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight
  })
}

async function openThread(id: string) {
  activeId.value = id
  try {
    thread.value = await $fetch<Thread>(`/api/admin/chat/conversations/${id}`)
    scrollToBottom()
  } catch {
    thread.value = null
  }
  await refresh()
}

async function sendReply() {
  if (!activeId.value || !replyText.value.trim() || sending.value) return
  sending.value = true
  try {
    await $fetch(`/api/admin/chat/conversations/${activeId.value}`, {
      method: 'POST',
      body: { text: replyText.value }
    })
    replyText.value = ''
    await openThread(activeId.value)
  } finally {
    sending.value = false
  }
}

async function toggleStatus() {
  if (!activeId.value || !thread.value) return
  const next = thread.value.status === 'open' ? 'resolved' : 'open'
  await $fetch(`/api/admin/chat/conversations/${activeId.value}`, {
    method: 'PATCH',
    body: { status: next }
  })
  thread.value.status = next
  await refresh()
}

async function removeConversation(id: string) {
  if (!window.confirm('Hapus percakapan ini secara permanen?')) return
  busyDelete.value = true
  try {
    await $fetch(`/api/admin/chat/conversations/${id}`, { method: 'DELETE' })
    if (activeId.value === id) {
      activeId.value = null
      thread.value = null
    }
    await refresh()
  } finally {
    busyDelete.value = false
  }
}

async function toggleEnabled() {
  await $fetch('/api/admin/chat/config', {
    method: 'PUT',
    body: { enabled: !cfg.value?.enabled }
  })
  await refreshCfg()
}

onMounted(() => {
  setInterval(async () => {
    await refresh()
    if (activeId.value) {
      try {
        thread.value = await $fetch<Thread>(`/api/admin/chat/conversations/${activeId.value}`)
        scrollToBottom()
      } catch {
        /* thread tidak tersedia */
      }
    }
  }, 10000)
})
</script>

<template>
  <div class="flex h-[calc(100dvh-76px-2rem)] flex-col lg:h-[calc(100vh-76px-4rem)]">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-text">Percakapan Pengunjung</h2>
        <p class="mt-1 text-sm text-text-secondary">Balas pesan dari pengunjung website dan pantau percakapan secara real-time.</p>
      </div>

      <button
        type="button"
        class="flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors"
        :class="cfg?.enabled ? 'border-success/40 bg-success/10 text-success' : 'border-border text-text-muted'"
        @click="toggleEnabled"
      >
        <span class="relative inline-flex h-2 w-2" aria-hidden="true">
          <span v-if="cfg?.enabled" class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span class="relative inline-flex h-2 w-2 rounded-full" :class="cfg?.enabled ? 'bg-success' : 'bg-text-muted'" />
        </span>
        Chat {{ cfg?.enabled ? 'Aktif' : 'Nonaktif' }}
      </button>
    </div>

    <div class="grid min-h-0 flex-1 gap-5 lg:grid-cols-[320px_1fr]">
      <!-- List percakapan -->
      <div
        class="card min-h-0 flex-col overflow-hidden"
        :class="activeId ? 'hidden lg:flex' : 'flex'"
      >
        <div class="border-b border-border px-5 py-4">
          <p class="flex items-center gap-2 text-sm font-bold text-text">
            <MessageSquare :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Percakapan
            <span class="rounded-full bg-bg-alt px-2 py-0.5 text-[10px] font-bold text-text-muted">{{ convs?.length ?? 0 }}</span>
          </p>
        </div>

        <div class="flex-1 overflow-y-auto">
          <ul v-if="convs?.length" class="divide-y divide-border/60">
            <li v-for="c in convs" :key="c.id">
              <button
                type="button"
                class="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors"
                :class="activeId === c.id ? 'bg-primary/10' : 'hover:bg-card'"
                @click="openThread(c.id)"
              >
                <span
                  class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                  aria-hidden="true"
                >
                  <User :size="17" :stroke-width="1.5" />
                  <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card" :class="c.status === 'open' ? 'bg-success' : 'bg-text-muted'" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center justify-between gap-2">
                    <span class="truncate text-sm font-semibold" :class="c.unread > 0 ? 'text-text' : 'text-text-secondary'">
                      {{ c.visitor.name || 'Pengunjung' }}
                    </span>
                    <span class="shrink-0 text-[10px] text-text-muted">{{ formatDay(c.updatedAt) }}</span>
                  </span>
                  <span class="mt-0.5 flex items-center justify-between gap-2">
                    <span class="truncate text-xs text-text-muted">{{ c.lastMessage?.text }}</span>
                    <span v-if="c.unread > 0" class="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {{ c.unread }}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          </ul>
          <div v-else class="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
              <Inbox :size="20" :stroke-width="1.5" />
            </span>
            <p class="text-sm font-medium text-text">Belum ada percakapan</p>
            <p class="text-xs text-text-muted">Pesan dari pengunjung akan muncul di sini.</p>
          </div>
        </div>
      </div>

      <!-- Thread -->
      <div v-if="thread" class="card flex min-h-0 flex-col overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden"
              aria-label="Kembali ke daftar percakapan"
              @click="activeId = null; thread = null"
            >
              <ArrowLeft :size="16" :stroke-width="1.75" />
            </button>
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">
              <User :size="17" :stroke-width="1.5" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-text">{{ thread.visitor.name || 'Pengunjung' }}</p>
              <p class="truncate text-xs text-text-muted">{{ thread.visitor.email || 'Tanpa email' }}</p>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors"
              :class="thread.status === 'open' ? 'text-success hover:border-success/50' : 'text-text-muted hover:border-primary/50 hover:text-text'"
              @click="toggleStatus"
            >
              <CheckCircle2 v-if="thread.status === 'open'" :size="13" :stroke-width="1.75" />
              <Circle v-else :size="13" :stroke-width="1.75" />
              {{ thread.status === 'open' ? 'Selesai' : 'Buka' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
              :disabled="busyDelete"
              @click="removeConversation(thread.id)"
            >
              <LoaderCircle v-if="busyDelete" :size="13" class="animate-spin" />
              <Trash2 v-else :size="13" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
        </div>

        <div ref="threadEl" class="flex-1 space-y-3 overflow-y-auto bg-bg p-5">
          <div
            v-for="m in thread.messages"
            :key="m.id"
            class="flex"
            :class="m.role === 'visitor' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              :class="m.role === 'visitor' ? 'rounded-br-sm bg-gradient-brand text-white' : 'rounded-bl-sm border border-border bg-card text-text'"
            >
              <p class="whitespace-pre-wrap break-words">{{ m.text }}</p>
              <p class="mt-1 text-right text-[10px]" :class="m.role === 'visitor' ? 'text-white/70' : 'text-text-muted'">
                {{ formatTime(m.at) }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-border p-4">
          <div class="flex items-end gap-2.5">
            <textarea
              v-model="replyText"
              rows="2"
              class="input-field resize-none text-sm"
              placeholder="Ketik balasan untuk pengunjung..."
              @keydown.enter.exact.prevent="sendReply"
            />
            <button
              type="button"
              class="btn-primary flex h-11 w-11 shrink-0 items-center justify-center !rounded-xl !p-0"
              :disabled="sending || !replyText.trim()"
              :aria-label="'Kirim balasan'"
              @click="sendReply"
            >
              <Send :size="17" :stroke-width="2" :class="sending ? 'animate-pulse' : ''" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="card hidden items-center justify-center lg:flex">
        <div class="flex flex-col items-center gap-3 text-center">
          <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
            <MessageSquare :size="24" :stroke-width="1.5" />
          </span>
          <div>
            <p class="text-sm font-semibold text-text">Pilih percakapan untuk dibalas</p>
            <p class="mt-1 text-xs text-text-muted">Klik salah satu percakapan di sebelah kiri.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox, Mail, Trash2, MailOpen, LoaderCircle, User, Tag } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Messages'
})

interface InboxMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  at: string
}

const { data: messages, refresh } = await useAsyncData('admin-messages', () =>
  useRequestFetch()<InboxMessage[]>('/api/admin/messages')
)

const activeId = ref<string | null>(null)
const detail = ref<InboxMessage | null>(null)
const busyDelete = ref(false)

const unreadCount = computed(() => messages.value?.filter((m) => !m.read).length ?? 0)

function formatDay(at: string) {
  const d = new Date(at)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function formatFull(at: string) {
  return new Date(at).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function openMessage(id: string) {
  activeId.value = id
  try {
    detail.value = await $fetch<InboxMessage>(`/api/admin/messages/${id}`)
  } catch {
    detail.value = null
  }
  await refresh()
}

async function toggleRead(m: InboxMessage) {
  await $fetch(`/api/admin/messages/${m.id}`, { method: 'PATCH', body: { read: !m.read } })
  m.read = !m.read
}

async function removeMessage(id: string) {
  if (!window.confirm('Hapus pesan ini secara permanen?')) return
  busyDelete.value = true
  try {
    await $fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    if (activeId.value === id) {
      activeId.value = null
      detail.value = null
    }
    await refresh()
  } finally {
    busyDelete.value = false
  }
}

onMounted(() => {
  setInterval(async () => {
    await refresh()
    if (activeId.value) {
      detail.value = await $fetch<InboxMessage>(`/api/admin/messages/${activeId.value}`).catch(() => null)
    }
  }, 10000)
})
</script>

<template>
  <div class="flex h-[calc(100vh-76px-4rem)] flex-col">
    <div class="mb-5">
      <h2 class="text-xl font-bold text-text">Pesan Masuk</h2>
      <p class="mt-1 text-sm text-text-secondary">
        Pesan dari form kontak website.
        <span v-if="unreadCount > 0" class="font-semibold text-red-400">{{ unreadCount }} belum dibaca</span>
      </p>
    </div>

    <div class="grid min-h-0 flex-1 gap-5 lg:grid-cols-[340px_1fr]">
      <!-- Daftar pesan -->
      <div class="card flex min-h-0 flex-col overflow-hidden">
        <div class="border-b border-border px-5 py-4">
          <p class="flex items-center gap-2 text-sm font-bold text-text">
            <Inbox :size="16" :stroke-width="1.75" class="text-primary" aria-hidden="true" />
            Inbox
            <span class="rounded-full bg-bg-alt px-2 py-0.5 text-[10px] font-bold text-text-muted">{{ messages?.length ?? 0 }}</span>
          </p>
        </div>

        <div class="flex-1 overflow-y-auto">
          <ul v-if="messages?.length" class="divide-y divide-border/60">
            <li v-for="m in messages" :key="m.id">
              <button
                type="button"
                class="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors"
                :class="activeId === m.id ? 'bg-primary/10' : 'hover:bg-card'"
                @click="openMessage(m.id)"
              >
                <span
                  class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  :class="m.read ? 'bg-bg-alt text-text-muted' : 'bg-primary/15 text-primary'"
                  aria-hidden="true"
                >
                  <Mail :size="16" :stroke-width="1.5" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center justify-between gap-2">
                    <span class="truncate text-sm font-semibold" :class="m.read ? 'text-text-secondary' : 'text-text'">
                      {{ m.subject }}
                    </span>
                    <span class="shrink-0 text-[10px] text-text-muted">{{ formatDay(m.at) }}</span>
                  </span>
                  <span class="mt-0.5 flex items-center justify-between gap-2">
                    <span class="truncate text-xs" :class="m.read ? 'text-text-muted' : 'font-medium text-text-secondary'">
                      {{ m.name }} — {{ m.message }}
                    </span>
                    <span v-if="!m.read" class="flex h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                  </span>
                </span>
              </button>
            </li>
          </ul>
          <div v-else class="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
              <Inbox :size="20" :stroke-width="1.5" />
            </span>
            <p class="text-sm font-medium text-text">Belum ada pesan</p>
            <p class="text-xs text-text-muted">Pesan dari form kontak akan muncul di sini.</p>
          </div>
        </div>
      </div>

      <!-- Detail pesan -->
      <div v-if="detail" class="card flex min-h-0 flex-col overflow-hidden">
        <div class="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div class="min-w-0">
            <p class="flex items-center gap-2 text-sm font-bold text-text">
              <Tag :size="15" :stroke-width="1.75" class="shrink-0 text-primary" aria-hidden="true" />
              <span class="truncate">{{ detail.subject }}</span>
            </p>
            <div class="mt-2 flex items-center gap-2.5">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">
                <User :size="15" :stroke-width="1.5" />
              </span>
              <div class="min-w-0 leading-tight">
                <p class="truncate text-sm font-semibold text-text">{{ detail.name }}</p>
                <a :href="`mailto:${detail.email}`" class="truncate text-xs text-primary hover:underline">{{ detail.email }}</a>
              </div>
            </div>
            <p class="mt-2 text-xs text-text-muted">{{ formatFull(detail.at) }}</p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
              @click="toggleRead(detail)"
            >
              <MailOpen :size="13" :stroke-width="1.75" />
              {{ detail.read ? 'Tandai Belum Dibaca' : 'Tandai Dibaca' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
              :disabled="busyDelete"
              @click="removeMessage(detail.id)"
            >
              <LoaderCircle v-if="busyDelete" :size="13" class="animate-spin" />
              <Trash2 v-else :size="13" :stroke-width="1.5" />
              Hapus
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <p class="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{{ detail.message }}</p>
        </div>
      </div>

      <div v-else class="card flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center">
          <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
            <Mail :size="24" :stroke-width="1.5" />
          </span>
          <div>
            <p class="text-sm font-semibold text-text">Pilih pesan untuk dibaca</p>
            <p class="mt-1 text-xs text-text-muted">Klik salah satu pesan di sebelah kiri.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

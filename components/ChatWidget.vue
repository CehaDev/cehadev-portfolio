<script setup lang="ts">
import { MessageCircle, X, Send, Sparkles, User, AtSign } from 'lucide-vue-next'

const STORAGE_KEY = 'cehadev-chat-session'

const { trigger } = useChatWidget()
const { data: site } = await useSiteSettings()

const pendingTrigger = ref(false)

const open = ref(false)
const enabled = ref(true)
const ready = ref(false)
const sending = ref(false)
const unread = ref(0)

const conversationId = ref<string | null>(null)
const messages = ref<Array<{ id: string; role: 'visitor' | 'admin'; text: string; at: string }>>([])
const status = ref<'open' | 'resolved'>('open')
const lastAt = ref<string | null>(null)

const input = ref('')
const name = ref('')
const email = ref('')
const error = ref('')

const threadEl = ref<HTMLElement | null>(null)

const faqs = computed(() => site.value?.faqs ?? [])
const isNew = computed(() => !conversationId.value)

function scrollToBottom() {
  nextTick(() => {
    if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight
  })
}

function formatTime(at: string) {
  return new Date(at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

async function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (saved?.id) {
      conversationId.value = saved.id
      lastAt.value = saved.lastAt ?? null
      name.value = saved.name ?? ''
      email.value = saved.email ?? ''
    }
  } catch {
    /* session tidak valid */
  }
}

async function fetchThread() {
  if (!conversationId.value) return
  try {
    const data = await $fetch<{ status: string; messages: Array<{ id: string; role: 'visitor' | 'admin'; text: string; at: string }> }>(
      `/api/chat/conversations/${conversationId.value}`
    )
    messages.value = data.messages
    status.value = data.status === 'resolved' ? 'resolved' : 'open'
    if (lastAt.value) {
      unread.value = data.messages.filter((m) => m.role === 'admin' && m.at > lastAt.value).length
    } else {
      unread.value = data.messages.filter((m) => m.role === 'admin').length
    }
    if (open.value) {
      lastAt.value = data.messages[data.messages.length - 1]?.at ?? lastAt.value
      unread.value = 0
    }
    scrollToBottom()
  } catch {
    /* thread tidak tersedia */
  }
}

function refreshUnread() {
  fetchThread()
}

function saveSession() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ id: conversationId.value, lastAt: lastAt.value, name: name.value, email: email.value })
  )
}

async function sendMessage(textOverride?: string) {
  const text = (textOverride ?? input.value).trim()
  if (!text || sending.value) return
  error.value = ''
  sending.value = true
  try {
    const res = await $fetch<{ id: string; message: { at: string } }>('/api/chat/messages', {
      method: 'POST',
      body: {
        conversationId: conversationId.value ?? undefined,
        name: name.value,
        email: email.value,
        text
      }
    })
    conversationId.value = res.id
    lastAt.value = res.message.at
    input.value = ''
    saveSession()
    await fetchThread()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal mengirim pesan'
  } finally {
    sending.value = false
  }
}

function pickFaq(q: string) {
  input.value = q
}

async function toggle() {
  open.value = !open.value
  if (open.value) {
    if (conversationId.value) await fetchThread()
    else scrollToBottom()
  } else {
    lastAt.value = messages.value[messages.value.length - 1]?.at ?? lastAt.value
    saveSession()
    unread.value = 0
  }
}

async function applyTrigger() {
  open.value = true
  if (trigger.value.prefill) input.value = trigger.value.prefill
  if (conversationId.value) await fetchThread()
  else scrollToBottom()
}

watch(
  () => trigger.value.nonce,
  async () => {
    if (!ready.value || !enabled.value) {
      pendingTrigger.value = true
      return
    }
    await applyTrigger()
  }
)

onMounted(async () => {
  try {
    const cfg = await $fetch<{ enabled: boolean }>('/api/chat/config')
    enabled.value = cfg.enabled !== false
  } catch {
    enabled.value = false
  }
  if (!enabled.value) return
  await loadSession()
  ready.value = true
  refreshUnread()
  setInterval(refreshUnread, 15000)
  if (pendingTrigger.value) {
    pendingTrigger.value = false
    await applyTrigger()
  }
})

watch(messages, scrollToBottom)
</script>

<template>
  <div v-if="enabled && ready" class="fixed bottom-5 right-5 z-[60] flex flex-col items-end print:hidden">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="open"
        class="mb-4 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-card border border-border bg-card shadow-card"
        role="dialog"
        aria-label="Chat dengan CehaDev"
      >
        <!-- Header -->
        <div class="flex items-center justify-between gap-3 bg-gradient-brand px-4 py-3.5 text-white">
          <div class="flex items-center gap-3">
            <span class="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white" aria-hidden="true">
              <User :size="17" :stroke-width="1.75" />
              <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary-violet bg-success" />
            </span>
            <div>
              <p class="text-sm font-bold leading-tight">CehaDev Support</p>
              <p class="text-[11px] opacity-90">{{ status === 'resolved' ? 'Percakapan selesai' : 'Online — biasanya membalas cepat' }}</p>
            </div>
          </div>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
            :aria-label="'Tutup chat'"
            @click="toggle"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Body -->
        <div ref="threadEl" class="flex-1 space-y-3 overflow-y-auto bg-bg p-4">
          <template v-if="messages.length">
            <div
              v-for="m in messages"
              :key="m.id"
              class="flex"
              :class="m.role === 'visitor' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                :class="m.role === 'visitor' ? 'rounded-br-sm bg-gradient-brand text-white' : 'rounded-bl-sm border border-border bg-card text-text'"
              >
                <p class="whitespace-pre-wrap break-words">{{ m.text }}</p>
                <p
                  class="mt-1 text-right text-[10px]"
                  :class="m.role === 'visitor' ? 'text-white/70' : 'text-text-muted'"
                >
                  {{ formatTime(m.at) }}
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex justify-center pt-4">
              <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
                <Sparkles :size="22" :stroke-width="1.5" />
              </span>
            </div>
            <p class="text-center text-sm font-semibold text-text">Hai! Ada yang bisa saya bantu?</p>
            <p class="text-center text-xs leading-relaxed text-text-muted">
              Pilih salah satu pertanyaan di bawah, atau tulis pesan Anda langsung.
            </p>

            <div class="flex flex-wrap justify-center gap-2 pt-1">
              <button
                v-for="(f, i) in faqs.slice(0, 4)"
                :key="i"
                type="button"
                class="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
                @click="pickFaq(f.q)"
              >
                {{ f.q }}
              </button>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="border-t border-border bg-card p-3">
          <div v-if="isNew" class="mb-2 grid grid-cols-2 gap-2">
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
                <User :size="13" :stroke-width="1.5" />
              </span>
              <input
                v-model="name"
                type="text"
                class="input-field !py-2 pl-9 text-xs"
                placeholder="Nama"
                autocomplete="name"
              />
            </div>
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
                <AtSign :size="13" :stroke-width="1.5" />
              </span>
              <input
                v-model="email"
                type="email"
                class="input-field !py-2 pl-9 text-xs"
                placeholder="Email"
                autocomplete="email"
              />
            </div>
          </div>
          <div class="flex items-end gap-2">
            <textarea
              v-model="input"
              rows="1"
              class="input-field resize-none !py-2.5 text-sm"
              :placeholder="isNew ? 'Tulis pesan Anda...' : 'Ketik balasan...'"
              @keydown.enter.exact.prevent="sendMessage()"
            />
            <button
              type="button"
              class="btn-primary flex h-10 w-10 shrink-0 items-center justify-center !rounded-xl !p-0"
              :disabled="sending || !input.trim()"
              :aria-label="'Kirim pesan'"
              @click="sendMessage()"
            >
              <Send :size="16" :stroke-width="2" :class="sending ? 'animate-pulse' : ''" />
            </button>
          </div>
          <p v-if="error" class="mt-2 text-xs text-red-400">{{ error }}</p>
        </div>
      </div>
    </Transition>

    <!-- Floating button -->
    <button
      type="button"
      class="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-white shadow-btn-glow transition-transform duration-200 hover:scale-105"
      :aria-label="open ? 'Tutup chat' : 'Buka chat'"
      @click="toggle"
    >
      <X v-if="open" :size="22" :stroke-width="2" />
      <MessageCircle v-else :size="24" :stroke-width="1.75" />
      <span
        v-if="!open && unread > 0"
        class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
        aria-hidden="true"
      >
        {{ unread > 9 ? '9+' : unread }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Bell, Mail, MessageSquare, CheckCheck, Inbox } from 'lucide-vue-next'

const { messageUnread, chatUnread, messages, chats, total } = useAdminNotifications()

const open = ref(false)
const panel = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins}m lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}j lalu`
  const days = Math.floor(hours / 24)
  return `${days}h lalu`
}
</script>

<template>
  <div ref="panel" class="relative">
    <button
      type="button"
      class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
      :aria-label="`Notifikasi (${total} belum dibaca)`"
      @click="open = !open"
    >
      <Bell :size="18" :stroke-width="1.75" />
      <span
        v-if="total > 0"
        class="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-btn-glow"
        aria-hidden="true"
      >
        {{ total > 9 ? '9+' : total }}
      </span>
    </button>

    <div v-if="open" class="fixed inset-0 z-40" aria-hidden="true" @click="close" />

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-btn-glow"
      >
        <div class="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p class="text-sm font-bold text-text">Notifikasi</p>
          <span
            v-if="total > 0"
            class="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400"
          >
            {{ messageUnread + chatUnread }} belum dibaca
          </span>
        </div>

        <div class="max-h-[420px] overflow-y-auto">
          <!-- Pesan -->
          <div class="px-5 pt-4">
            <p class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              <Mail :size="12" :stroke-width="2" aria-hidden="true" />
              Pesan Baru ({{ messageUnread }})
            </p>
            <ul v-if="messages.length" class="mt-2">
              <li v-for="m in messages" :key="m.id">
                <NuxtLink
                  to="/admin/messages"
                  class="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-bg-alt"
                  @click="close"
                >
                  <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden="true">
                    <Mail :size="13" :stroke-width="1.5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block truncate text-xs font-semibold text-text">{{ m.subject }}</span>
                    <span class="mt-0.5 block truncate text-[11px] text-text-muted">{{ m.name }} · {{ timeAgo(m.at) }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
            <p v-else class="mt-2 px-2 py-2 text-xs text-text-muted">Tidak ada pesan baru.</p>
          </div>

          <!-- Chat -->
          <div class="px-5 py-4">
            <p class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              <MessageSquare :size="12" :stroke-width="2" aria-hidden="true" />
              Chat Baru ({{ chatUnread }})
            </p>
            <ul v-if="chats.length" class="mt-2">
              <li v-for="c in chats" :key="c.id">
                <NuxtLink
                  to="/admin/chat"
                  class="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-bg-alt"
                  @click="close"
                >
                  <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/15 text-blue" aria-hidden="true">
                    <MessageSquare :size="13" :stroke-width="1.5" />
                  </span>
                  <span class="min-w-0">
                    <span class="block truncate text-xs font-semibold text-text">{{ c.visitor }}</span>
                    <span class="mt-0.5 block truncate text-[11px] text-text-muted">{{ c.text || 'Membuka chat...' }} · {{ timeAgo(c.at) }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
            <p v-else class="mt-2 px-2 py-2 text-xs text-text-muted">Tidak ada chat baru.</p>
          </div>

          <div v-if="!messages.length && !chats.length" class="flex flex-col items-center gap-1.5 px-5 pb-6 pt-2 text-center">
            <Inbox :size="18" :stroke-width="1.5" class="text-text-muted" aria-hidden="true" />
            <p class="text-xs text-text-muted">Semua sudah dibaca.</p>
          </div>
        </div>

        <div class="border-t border-border px-5 py-3">
          <p class="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
            <CheckCheck :size="12" :stroke-width="1.75" aria-hidden="true" />
            Diperbarui otomatis setiap 10 detik
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

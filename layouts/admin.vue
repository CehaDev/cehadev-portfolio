<script setup lang="ts">
import { LayoutDashboard, FolderKanban, FileText, Settings2, LogOut, ArrowLeft, MessageSquare, Mail, Settings, BarChart3, Zap, Menu, X } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Skills', to: '/admin/skills', icon: Zap },
  { label: 'CV', to: '/admin/cv', icon: FileText },
  { label: 'Chat', to: '/admin/chat', icon: MessageSquare },
  { label: 'Messages', to: '/admin/messages', icon: Mail },
  { label: 'Site', to: '/admin/site', icon: Settings2 },
  { label: 'Settings', to: '/admin/settings', icon: Settings }
]

const notif = useAdminNotifications()

function unreadFor(itemTo: string) {
  if (itemTo === '/admin/chat') return notif.chatUnread
  if (itemTo === '/admin/messages') return notif.messageUnread
  return 0
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

const sidebarOpen = ref(false)

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

watch(() => route.fullPath, () => closeSidebar())

watch(sidebarOpen, (open: boolean) => {
  if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeSidebar()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => {
    window.removeEventListener('keydown', onKey)
    if (typeof document !== 'undefined') document.body.style.overflow = ''
  })
})
</script>

<template>
  <div class="flex min-h-screen bg-bg">
    <ScrollProgress />

    <!-- Backdrop mobile -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        aria-hidden="true"
        @click="closeSidebar"
      />
    </transition>

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-bg-alt transition-transform duration-300"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      aria-label="Navigasi admin"
    >
      <div class="flex h-[76px] items-center gap-2.5 border-b border-border px-6">
        <NuxtLink to="/admin" class="flex items-center gap-2.5" @click="closeSidebar">
          <img src="/ch.png" alt="CehaDev" class="h-9 w-9 rounded-lg object-cover" />
          <div class="leading-tight">
            <p class="text-base font-extrabold tracking-tight">
              <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
            </p>
            <p class="text-[11px] text-text-muted">Admin Panel</p>
          </div>
        </NuxtLink>
        <button
          type="button"
          class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden"
          aria-label="Tutup menu"
          @click="closeSidebar"
        >
          <X :size="18" :stroke-width="1.75" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Navigasi admin">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          :class="route.path === item.to ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:bg-card hover:text-text'"
          @click="closeSidebar"
        >
          <component :is="item.icon" :size="17" :stroke-width="1.75" />
          {{ item.label }}
          <span
            v-if="unreadFor(item.to) > 0"
            class="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
            aria-hidden="true"
          >
            {{ unreadFor(item.to) > 9 ? '9+' : unreadFor(item.to) }}
          </span>
        </NuxtLink>
      </nav>

      <div class="border-t border-border p-4">
        <NuxtLink to="/" class="mb-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-card hover:text-text" @click="closeSidebar">
          <ArrowLeft :size="16" :stroke-width="1.75" />
          Lihat Website
        </NuxtLink>
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-card hover:text-text"
          @click="logout"
        >
          <LogOut :size="16" :stroke-width="1.75" />
          Logout
        </button>
      </div>
    </aside>

    <div class="ml-0 flex-1 lg:ml-64">
      <header class="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
        <div class="flex h-[76px] items-center justify-between gap-3 px-4 sm:px-8">
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:hidden"
              aria-label="Buka menu navigasi"
              @click="openSidebar"
            >
              <Menu :size="19" :stroke-width="1.75" />
            </button>
            <h1 class="truncate text-base font-bold text-text sm:text-lg">{{ route.meta.adminTitle ?? 'Admin' }}</h1>
          </div>
          <div class="flex shrink-0 items-center gap-3">
            <NotificationBell />
            <span class="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Online
            </span>
          </div>
        </div>
      </header>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

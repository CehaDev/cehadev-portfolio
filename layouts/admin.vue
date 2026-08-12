<script setup lang="ts">
import { LayoutDashboard, FolderKanban, FileText, Wrench, LogOut, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Skills', to: '/admin/skills', icon: Wrench },
  { label: 'CV', to: '/admin/cv', icon: FileText }
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-bg">
    <aside class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-bg-alt">
      <NuxtLink to="/admin" class="flex h-[76px] items-center gap-2.5 border-b border-border px-6">
        <img src="/ch.png" alt="CehaDev" class="h-9 w-9 rounded-lg object-cover" />
        <div class="leading-tight">
          <p class="text-base font-extrabold tracking-tight">
            <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
          </p>
          <p class="text-[11px] text-text-muted">Admin Panel</p>
        </div>
      </NuxtLink>

      <nav class="flex-1 space-y-1 px-4 py-6" aria-label="Navigasi admin">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          :class="route.path === item.to ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:bg-card hover:text-text'"
        >
          <component :is="item.icon" :size="17" :stroke-width="1.75" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="border-t border-border p-4">
        <NuxtLink to="/" class="mb-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-card hover:text-text">
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

    <div class="ml-64 flex-1">
      <header class="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
        <div class="flex h-[76px] items-center justify-between px-8">
          <h1 class="text-lg font-bold text-text">{{ route.meta.adminTitle ?? 'Admin' }}</h1>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Online
            </span>
          </div>
        </div>
      </header>

      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

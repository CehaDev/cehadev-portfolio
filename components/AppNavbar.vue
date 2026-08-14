<script setup lang="ts">
import { Github, Menu, Moon, Sun, Download, X } from 'lucide-vue-next'
import { navLinks } from '~/composables/useSiteData'

const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)
const { data: site } = await useSiteSettings()
const { theme, toggle } = useTheme()

function onScroll() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function isActive(link: { to: string; label: string }) {
  if (link.to === '/') return route.path === '/'
  return route.path.startsWith(link.to)
}

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b transition-all duration-300 print:hidden"
    :class="scrolled
      ? 'border-border/70 bg-bg/90 shadow-lg shadow-black/5 backdrop-blur-xl'
      : 'border-border/40 bg-bg/70 backdrop-blur-md'"
  >
    <nav class="container-site flex items-center justify-between gap-6 transition-all duration-300" :class="scrolled ? 'h-16' : 'h-[76px]'" aria-label="Navigasi utama">
      <NuxtLink to="/" class="shrink-0 text-xl font-extrabold tracking-tight" @click="closeMobile">
        <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
      </NuxtLink>

      <ul class="hidden items-center gap-8 lg:flex">
        <li v-for="link in navLinks" :key="link.to" class="group">
          <NuxtLink
            :to="link.to"
            class="relative pb-1 text-sm font-medium transition-colors"
            :class="isActive(link) ? 'text-text' : 'text-text-secondary hover:text-text'"
          >
            {{ link.label }}
            <span
              v-if="isActive(link)"
              class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-brand"
              aria-hidden="true"
            />
            <span
              v-else
              class="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-brand transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-3">
        <a
          :href="site?.socials?.github ?? 'https://github.com'"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="hidden items-center justify-center rounded-full border border-border p-2.5 text-text-secondary transition-colors hover:border-primary/60 hover:text-text sm:flex"
        >
          <Github :size="18" :stroke-width="1.5" />
        </a>
        <button
          type="button"
          :aria-label="theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'"
          class="flex items-center justify-center rounded-full border border-border bg-bg-alt p-2.5 transition-colors hover:border-primary/60"
          :class="theme === 'dark' ? 'text-amber-300' : 'text-text-secondary'"
          @click="toggle"
        >
          <Sun v-if="theme === 'dark'" :size="18" :stroke-width="1.5" />
          <Moon v-else :size="18" :stroke-width="1.5" />
        </button>
        <a :href="site?.cvUrl ? `${site.cvUrl}?download=1` : '/cv?download=1'" class="btn-primary hidden !px-5 !py-2.5 md:inline-flex" @click="closeMobile">
          <Download :size="16" :stroke-width="2" />
          Download CV
        </a>
        <button
          type="button"
          class="flex items-center justify-center rounded-lg border border-border p-2.5 text-text lg:hidden"
          :aria-label="mobileOpen ? 'Tutup menu' : 'Buka menu'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition ease-in duration-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="border-t border-border/60 bg-bg lg:hidden">
        <ul class="container-site flex flex-col py-4">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex items-center justify-between border-b border-border/40 py-3 text-sm font-medium"
              :class="isActive(link) ? 'text-text' : 'text-text-secondary'"
              @click="closeMobile"
            >
              {{ link.label }}
              <span v-if="isActive(link)" class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            </NuxtLink>
          </li>
          <li class="pt-4">
            <a :href="site?.cvUrl ? `${site.cvUrl}?download=1` : '/cv?download=1'" class="btn-primary w-full" @click="closeMobile">
              <Download :size="16" />
              Download CV
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

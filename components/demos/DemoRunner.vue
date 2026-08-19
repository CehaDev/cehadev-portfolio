<script setup lang="ts">
import { Monitor, Smartphone, RotateCcw, Maximize2, Minimize2, ExternalLink } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Component } from 'vue'
import { clearDemo } from '~/utils/demoStorage'
import DemoStore from '~/components/demos/DemoStore.vue'
import DemoKanban from '~/components/demos/DemoKanban.vue'
import DemoDashboard from '~/components/demos/DemoDashboard.vue'
import DemoApi from '~/components/demos/DemoApi.vue'
import DemoTodo from '~/components/demos/DemoTodo.vue'
import DemoCode from '~/components/demos/DemoCode.vue'
import DemoStudio from '~/components/demos/DemoStudio.vue'

const props = withDefaults(
  defineProps<{
    type: string
    slug: string
    title?: string
    url?: string
    note?: string
    files?: Array<{ name: string; language: string; content: string }>
  }>(),
  { title: '', url: '', note: '', files: () => [] }
)

const { data: site } = await useSiteSettings()
const h = computed(() => (site.value?.headings?.demo ?? {}) as Record<string, string>)

const demoComponents: Record<string, Component> = {
  store: DemoStore,
  kanban: DemoKanban,
  dashboard: DemoDashboard,
  api: DemoApi,
  todo: DemoTodo,
  code: DemoCode,
  studio: DemoStudio
}

const device = ref<'desktop' | 'phone'>('desktop')
const resetKey = ref(0)
const frameRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

const storageKey = computed(() => `cehadev-demo-${props.slug}-${props.type}`)
const demoComponent = computed(() => demoComponents[props.type] ?? DemoStore)
const displayUrl = computed(() => props.url || `/demo/${props.slug}`)

function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

onMounted(() => {
  if (isMobileViewport()) device.value = 'phone'
})

function resetDemo() {
  clearDemo(storageKey.value)
  resetKey.value++
}

async function toggleFullscreen() {
  if (!frameRef.value) return
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await frameRef.value.requestFullscreen()
    }
  } catch {}
}

function onFsChange() {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', onFsChange)
}
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', onFsChange)
  }
})
</script>

<template>
  <div class="demo-runner">
    <!-- Header Controls -->
    <div class="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:flex-col sm:items-start sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
      <!-- Title: hidden on mobile -->
      <div class="hidden min-w-0 sm:block">
        <h3 class="text-xl font-extrabold tracking-tight text-text md:text-2xl">{{ title || h.title || 'Demo Interaktif' }}</h3>
        <p v-if="note || h.note" class="mt-1 text-sm text-text-secondary">{{ note || h.note || 'Demo berjalan penuh di browser — tanpa perlu server.' }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-1 sm:gap-2">
        <!-- Device Toggle -->
        <div class="flex rounded-xl border border-border bg-bg p-0.5 sm:p-1" role="group">
          <button
            type="button"
            class="flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
            :class="device === 'desktop' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:text-text'"
            @click="device = 'desktop'"
          >
            <Monitor :size="12" :stroke-width="1.75" class="sm:hidden" />
            <Monitor :size="14" :stroke-width="1.75" class="hidden sm:block" />
            <span class="hidden sm:inline">{{ h.desktop || 'Desktop' }}</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
            :class="device === 'phone' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:text-text'"
            @click="device = 'phone'"
          >
            <Smartphone :size="12" :stroke-width="1.75" class="sm:hidden" />
            <Smartphone :size="14" :stroke-width="1.75" class="hidden sm:block" />
            <span class="hidden sm:inline">{{ h.mobile || 'HP' }}</span>
          </button>
        </div>
        <!-- Reset -->
        <button type="button" class="flex items-center justify-center gap-1 rounded-lg border border-border bg-bg px-2 py-1.5 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs" @click="resetDemo">
          <RotateCcw :size="12" :stroke-width="1.75" class="sm:hidden" />
          <RotateCcw :size="14" :stroke-width="1.75" class="hidden sm:block" />
          <span class="hidden sm:inline">{{ h.reset || 'Reset' }}</span>
        </button>
        <!-- Fullscreen -->
        <button
          type="button"
          class="flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
          :class="isFullscreen ? 'border border-primary/40 bg-primary/10 text-primary' : 'border border-border bg-bg text-text-secondary hover:border-primary/50 hover:text-text'"
          @click="toggleFullscreen"
        >
          <Minimize2 v-if="isFullscreen" :size="12" :stroke-width="1.75" class="sm:hidden" />
          <Maximize2 v-else :size="12" :stroke-width="1.75" class="sm:hidden" />
          <Minimize2 v-if="isFullscreen" :size="14" :stroke-width="1.75" class="hidden sm:block" />
          <Maximize2 v-else :size="14" :stroke-width="1.75" class="hidden sm:block" />
          <span class="hidden sm:inline">{{ isFullscreen ? 'Keluar' : 'Layar Penuh' }}</span>
        </button>
        <!-- External -->
        <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center rounded-lg border border-border bg-bg px-2 py-1.5 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/50 hover:text-text sm:px-3 sm:py-2 sm:text-xs">
          <ExternalLink :size="12" :stroke-width="1.75" class="sm:hidden" />
          <ExternalLink :size="14" :stroke-width="1.75" class="hidden sm:block" />
        </a>
      </div>
    </div>

    <!-- DESKTOP Frame -->
    <div v-if="device === 'desktop'" ref="frameRef" class="dr-frame overflow-hidden rounded-xl border border-border bg-card shadow-card sm:rounded-2xl">
      <div class="flex items-center gap-2 border-b border-border bg-bg-alt/50 px-3 py-2 sm:px-4 sm:py-2.5" aria-hidden="true">
        <span class="h-2.5 w-2.5 rounded-full bg-[#FF5F57] sm:h-3 sm:w-3" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] sm:h-3 sm:w-3" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#28C840] sm:h-3 sm:w-3" />
        <div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-bg/80 px-2.5 py-1 sm:px-3 sm:py-1.5">
          <span class="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-success sm:block" />
          <span class="truncate text-[10px] text-text-muted sm:text-[11px]">{{ displayUrl }}</span>
        </div>
        <span class="hidden shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success sm:inline-flex">
          {{ h.runsOffline || 'Offline' }}
        </span>
      </div>
      <div class="dr-content overflow-y-auto bg-bg">
        <component :is="demoComponent" :key="resetKey" :storage-key="storageKey" :files="files" />
      </div>
    </div>

    <!-- PHONE Frame -->
    <div v-else ref="frameRef" class="dr-phone-wrap">
      <div class="dr-phone mx-auto w-full max-w-full rounded-none border-0 border-border bg-card p-0 shadow-none sm:w-[320px] sm:rounded-[2.8rem] sm:border-2 sm:p-2.5 sm:shadow-card">
        <div class="h-full sm:overflow-hidden sm:rounded-[2.2rem] sm:border sm:border-border">
          <!-- Notch (hidden on mobile) -->
          <div class="relative hidden h-8 items-center justify-center bg-bg sm:flex" aria-hidden="true">
            <span class="absolute left-5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-border bg-bg-alt" />
            <span class="h-2.5 w-28 rounded-full bg-border" />
          </div>
          <!-- Content -->
          <div class="dr-phone-content h-full bg-bg">
            <component :is="demoComponent" :key="resetKey" :storage-key="storageKey" :files="files" :phone-mode="true" />
          </div>
          <!-- Home Bar (hidden on mobile) -->
          <div class="hidden h-7 items-center justify-center border-t border-border bg-bg sm:flex" aria-hidden="true">
            <span class="h-1 w-24 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dr-content {
  height: min(540px, calc(100vh - 14rem));
  min-height: 320px;
}

.dr-phone-content {
  height: min(540px, calc(100vh - 10rem));
  min-height: 320px;
  overflow-y: auto;
}

@media (max-width: 639px) {
  .dr-phone-content {
    height: calc(100vh - 6rem);
    min-height: 300px;
  }
}

/* ===== DESKTOP FULLSCREEN ===== */
.dr-frame:fullscreen {
  border-radius: 0;
  border: none;
  max-width: none;
  width: 100%;
}
.dr-frame:fullscreen .dr-content {
  height: calc(100vh - 44px);
}

/* ===== PHONE FULLSCREEN ===== */
.dr-phone-wrap:fullscreen {
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: rgb(var(--color-bg));
}
.dr-phone-wrap:fullscreen .dr-phone {
  width: 100%;
  max-width: 430px;
  height: 100%;
  border-radius: 0;
  border: none;
  padding: 0;
  box-shadow: none;
}
.dr-phone-wrap:fullscreen .dr-phone > div {
  border-radius: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.dr-phone-wrap:fullscreen .dr-phone > div > div:first-child {
  display: none;
}
.dr-phone-wrap:fullscreen .dr-phone-content {
  flex: 1;
  height: auto;
  min-height: 0;
  overflow: hidden;
}
.dr-phone-wrap:fullscreen .dr-phone > div > div:last-child {
  display: none;
}
</style>

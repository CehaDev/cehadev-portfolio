<script setup lang="ts">
import { Monitor, Smartphone, RotateCcw, Maximize2, Minimize2, ExternalLink } from 'lucide-vue-next'
import { computed, onUnmounted, ref } from 'vue'
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
  } catch {
    /* perangkat/tab tidak mendukung */
  }
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
    <!-- Header -->
    <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <h3 class="text-xl font-extrabold tracking-tight text-text md:text-2xl">{{ title || h.title || 'Demo Interaktif' }}</h3>
        <p v-if="note || h.note" class="mt-1 text-sm text-text-secondary">{{ note || h.note || 'Demo berjalan penuh di browser — tanpa perlu server.' }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <!-- Device Toggle -->
        <div class="flex rounded-xl border border-border bg-bg p-1" role="group" :aria-label="h.deviceAria || 'Mode tampilan'">
          <button
            type="button"
            class="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
            :class="device === 'desktop' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:text-text'"
            @click="device = 'desktop'"
          >
            <Monitor :size="14" :stroke-width="1.75" />
            <span class="hidden sm:inline">{{ h.desktop || 'Desktop' }}</span>
          </button>
          <button
            type="button"
            class="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
            :class="device === 'phone' ? 'bg-gradient-brand text-white shadow-btn-glow' : 'text-text-secondary hover:text-text'"
            @click="device = 'phone'"
          >
            <Smartphone :size="14" :stroke-width="1.75" />
            <span class="hidden sm:inline">{{ h.mobile || 'HP' }}</span>
          </button>
        </div>

        <!-- Reset -->
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-secondary transition-all duration-200 hover:border-primary/50 hover:text-text hover:shadow-sm"
          :title="h.reset || 'Reset'"
          @click="resetDemo"
        >
          <RotateCcw :size="14" :stroke-width="1.75" />
          <span class="hidden sm:inline">{{ h.reset || 'Reset' }}</span>
        </button>

        <!-- Fullscreen -->
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200"
          :class="isFullscreen ? 'border border-primary/40 bg-primary/10 text-primary' : 'border border-border bg-bg text-text-secondary hover:border-primary/50 hover:text-text hover:shadow-sm'"
          :title="isFullscreen ? (h.exitFullscreen || 'Keluar') : (h.fullscreen || 'Layar Penuh')"
          @click="toggleFullscreen"
        >
          <Minimize2 v-if="isFullscreen" :size="14" :stroke-width="1.75" />
          <Maximize2 v-else :size="14" :stroke-width="1.75" />
          <span class="hidden sm:inline">{{ isFullscreen ? (h.exitFullscreen || 'Keluar') : (h.fullscreen || 'Layar Penuh') }}</span>
        </button>

        <!-- External Link -->
        <a
          v-if="url"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text-secondary transition-all duration-200 hover:border-primary/50 hover:text-text hover:shadow-sm"
          :title="'Buka di tab baru'"
        >
          <ExternalLink :size="14" :stroke-width="1.75" />
        </a>
      </div>
    </div>

    <!-- Desktop Frame -->
    <div v-if="device === 'desktop'" ref="frameRef" class="demo-frame overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div class="flex items-center gap-2 border-b border-border bg-bg-alt/50 px-4 py-2.5">
        <span class="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span class="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span class="h-3 w-3 rounded-full bg-[#28C840]" />
        <div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-bg/80 px-3 py-1.5">
          <span class="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-success sm:block" aria-hidden="true" />
          <span class="truncate text-[11px] text-text-muted">{{ displayUrl }}</span>
        </div>
        <span class="hidden shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success sm:inline-flex">
          {{ h.runsOffline || 'Berjalan offline' }}
        </span>
      </div>
      <div class="h-[540px] overflow-y-auto bg-bg">
        <component :is="demoComponent" :key="resetKey" :storage-key="storageKey" :files="files" />
      </div>
    </div>

    <!-- Phone Frame -->
    <div v-else ref="frameRef" class="mx-auto w-[320px] max-w-full">
      <div class="rounded-[2.8rem] border-2 border-border bg-card p-2.5 shadow-card">
        <div class="overflow-hidden rounded-[2.2rem] border border-border">
          <!-- Phone Notch -->
          <div class="relative flex h-8 items-center justify-center bg-bg" aria-hidden="true">
            <span class="absolute left-5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-border bg-bg-alt" />
            <span class="h-2.5 w-28 rounded-full bg-border" />
          </div>
          <div class="h-[540px] overflow-y-auto bg-bg">
            <component :is="demoComponent" :key="resetKey" :storage-key="storageKey" :files="files" />
          </div>
          <!-- Phone Home Bar -->
          <div class="flex h-7 items-center justify-center border-t border-border bg-bg" aria-hidden="true">
            <span class="h-1 w-24 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-runner :deep(.demo-frame:fullscreen) {
  border-radius: 0;
  border: none;
  max-width: none;
  width: 100%;
}
.demo-runner :deep(.demo-frame:fullscreen > div:last-child) {
  height: calc(100vh - 44px);
}
</style>

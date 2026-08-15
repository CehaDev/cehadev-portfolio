<script setup lang="ts">
import { Monitor, Smartphone, RotateCcw, Maximize2, Minimize2 } from 'lucide-vue-next'
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
  <div>
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <h3 class="text-xl font-extrabold tracking-tight text-text md:text-2xl">{{ title || h.title || 'Demo Interaktif' }}</h3>
        <p v-if="note || h.note" class="mt-1 text-sm text-text-secondary">{{ note || h.note || 'Demo berjalan penuh di browser — tanpa perlu server.' }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex rounded-btn border border-border bg-card p-1" role="group" :aria-label="h.deviceAria || 'Mode tampilan'">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="device === 'desktop' ? 'bg-gradient-brand text-white' : 'text-text-secondary hover:text-text'"
            @click="device = 'desktop'"
          >
            <Monitor :size="14" :stroke-width="1.75" />
            {{ h.desktop || 'Desktop' }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="device === 'phone' ? 'bg-gradient-brand text-white' : 'text-text-secondary hover:text-text'"
            @click="device = 'phone'"
          >
            <Smartphone :size="14" :stroke-width="1.75" />
            {{ h.mobile || 'HP' }}
          </button>
        </div>
        <button type="button" class="inline-flex items-center gap-1.5 rounded-btn border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text" @click="resetDemo">
          <RotateCcw :size="14" :stroke-width="1.75" />
          {{ h.reset || 'Reset' }}
        </button>
        <button type="button" class="inline-flex items-center gap-1.5 rounded-btn border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text" @click="toggleFullscreen">
          <Minimize2 v-if="isFullscreen" :size="14" :stroke-width="1.75" />
          <Maximize2 v-else :size="14" :stroke-width="1.75" />
          {{ isFullscreen ? (h.exitFullscreen || 'Keluar') : (h.fullscreen || 'Layar Penuh') }}
        </button>
      </div>
    </div>

    <!-- Frame browser / desktop -->
    <div v-if="device === 'desktop'" ref="frameRef" class="overflow-hidden rounded-card border border-border bg-card shadow-card">
      <div class="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true">
        <span class="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span class="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span class="h-3 w-3 rounded-full bg-[#28C840]" />
        <span class="ml-3 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-bg px-3 py-1 text-[11px] text-text-muted">
          <span class="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-success sm:block" aria-hidden="true" />
          <span class="truncate">{{ displayUrl }}</span>
        </span>
        <span class="hidden shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success sm:inline-flex">
          {{ h.runsOffline || 'Berjalan offline' }}
        </span>
      </div>
      <div class="h-[540px] overflow-y-auto bg-bg">
        <component :is="demoComponent" :key="resetKey" :storage-key="storageKey" :files="files" />
      </div>
    </div>

    <!-- Frame ponsel -->
    <div v-else ref="frameRef" class="mx-auto w-[310px] max-w-full">
      <div class="rounded-[2.6rem] border border-border bg-card p-2 shadow-card">
        <div class="overflow-hidden rounded-[2.1rem] border border-border">
          <div class="relative flex h-7 items-center justify-center bg-bg" aria-hidden="true">
            <span class="absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-border bg-bg-alt" />
            <span class="h-2 w-24 rounded-full bg-border" />
          </div>
          <div class="h-[540px] overflow-y-auto bg-bg">
            <component :is="demoComponent" :key="resetKey" :storage-key="storageKey" :files="files" />
          </div>
          <div class="flex h-7 items-center justify-center gap-8 border-t border-border bg-bg text-text-muted" aria-hidden="true">
            <span class="h-1.5 w-1.5 rounded-full bg-border" />
            <span class="h-1.5 w-1.5 rounded-full bg-border" />
            <span class="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

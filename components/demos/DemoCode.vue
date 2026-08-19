<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Check, Copy, FileCode2, LoaderCircle } from 'lucide-vue-next'
import { codeToHtml, isShikiLang } from '~/utils/shiki'
import type { CodeFile } from '~/utils/demoCode'
import { codeLangLabel, codeLangClass } from '~/utils/demoCode'

const props = withDefaults(
  defineProps<{
    files?: CodeFile[]
    storageKey?: string
  }>(),
  { files: () => [], storageKey: '' }
)

const files = computed(() => (props.files ?? []).filter((f) => f.name && f.content))
const activeIdx = ref(0)
const highlighted = ref<Record<number, string>>({})
const loading = ref(false)
const error = ref('')
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const activeFile = computed(() => files.value[activeIdx.value])
const lineCount = computed(() => (activeFile.value?.content ?? '').split('\n').length)

async function highlight() {
  if (!activeFile.value) return
  const idx = activeIdx.value
  if (highlighted.value[idx] !== undefined) return
  loading.value = true
  error.value = ''
  try {
    const lang = isShikiLang(activeFile.value.language) ? activeFile.value.language : 'text'
    highlighted.value[idx] = await codeToHtml(activeFile.value.content, lang)
  } catch (e) {
    highlighted.value[idx] = ''
    error.value = String((e as Error)?.message ?? e)
  } finally {
    loading.value = false
  }
}

watch([activeIdx, files], () => {
  if (!files.value.length) return
  if (activeIdx.value >= files.value.length) activeIdx.value = 0
  void highlight()
}, { immediate: true })

function selectFile(i: number) { activeIdx.value = i }

async function copyCode() {
  if (!activeFile.value) return
  try {
    await navigator.clipboard.writeText(activeFile.value.content)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1800)
  } catch {}
}

onUnmounted(() => { if (copyTimer) clearTimeout(copyTimer) })
</script>

<template>
  <div v-if="files.length" class="flex h-full flex-col bg-bg text-text">
    <!-- File Tabs -->
    <div class="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-border bg-bg-alt/50 px-2 pt-1.5 sm:gap-1 sm:px-3 sm:pt-2" role="tablist">
      <button
        v-for="(f, i) in files"
        :key="`${f.name}-${i}`"
        type="button"
        role="tab"
        :aria-selected="i === activeIdx"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-2 py-2 text-[11px] font-semibold transition-colors sm:gap-2 sm:px-3 sm:py-2.5 sm:text-xs"
        :class="i === activeIdx ? 'border-primary bg-bg text-text' : 'border-transparent text-text-muted hover:bg-card/60 hover:text-text-secondary'"
        @click="selectFile(i)"
      >
        <FileCode2 :size="12" :stroke-width="1.75" class="sm:hidden" />
        <FileCode2 :size="13" :stroke-width="1.75" class="hidden sm:block" />
        <span class="max-w-28 truncate font-mono sm:max-w-44">{{ f.name }}</span>
        <span class="hidden rounded-md px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide sm:inline-block sm:px-1.5 sm:text-[9px]" :class="codeLangClass(f.language)">
          {{ codeLangLabel(f.language) }}
        </span>
      </button>
    </div>

    <!-- Code Area -->
    <div class="relative min-h-0 flex-1 overflow-hidden">
      <!-- Copy Button -->
      <div class="absolute right-2 top-2 z-10 flex items-center gap-1.5 sm:right-4 sm:top-3 sm:gap-2">
        <span v-if="copied" class="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success sm:px-2 sm:py-1 sm:text-[10px]">
          <Check :size="10" :stroke-width="2.25" class="sm:hidden" />
          <Check :size="11" :stroke-width="2.25" class="hidden sm:block" />
          Tersalin
        </span>
        <button type="button" class="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]" @click="copyCode">
          <Copy :size="11" :stroke-width="1.75" class="sm:hidden" />
          <Copy :size="12" :stroke-width="1.75" class="hidden sm:block" />
          Salin
        </button>
      </div>

      <div v-if="loading" class="flex h-full items-center justify-center gap-2 text-text-muted">
        <LoaderCircle :size="16" class="animate-spin sm:hidden" />
        <LoaderCircle :size="18" class="hidden animate-spin sm:block" />
        <span class="text-[11px] sm:text-xs">Menyiapkan editor...</span>
      </div>
      <div v-else class="flex h-full">
        <div class="select-none border-r border-border bg-card-alt/40 py-3 pl-2.5 pr-1.5 text-right font-mono text-[11px] leading-[1.65] text-text-muted sm:py-4 sm:pl-4 sm:pr-3 sm:text-[12.5px]" aria-hidden="true">
          <div v-for="n in lineCount" :key="n">{{ n }}</div>
        </div>
        <div class="min-w-0 flex-1 overflow-x-auto py-3 pr-2 sm:py-4 sm:pr-4">
          <div v-if="highlighted[activeIdx]" class="code-panel" v-html="highlighted[activeIdx]" />
          <pre v-else class="font-mono text-[11px] leading-[1.65] text-text-secondary sm:text-[12.5px]">{{ activeFile.content }}<span v-if="error" class="mt-2 block text-[9px] text-red-400 sm:mt-3 sm:text-[10px]">Tidak dapat mewarnai kode: {{ error }}</span></pre>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex h-full items-center justify-center bg-bg p-6 text-center text-text-muted sm:p-8">
    <div>
      <FileCode2 :size="24" :stroke-width="1.5" class="mx-auto opacity-60 sm:hidden" />
      <FileCode2 :size="28" :stroke-width="1.5" class="mx-auto hidden opacity-60 sm:block" />
      <p class="mt-2 text-xs sm:mt-3 sm:text-sm">Belum ada file kode.</p>
      <p class="mt-0.5 text-[11px] sm:mt-1 sm:text-xs">Atur file kode project lewat panel admin.</p>
    </div>
  </div>
</template>

<style scoped>
.code-panel :deep(pre.shiki) {
  margin: 0;
  padding: 0 !important;
  background: transparent !important;
  overflow: visible;
}
.code-panel :deep(.shiki) {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
.code-panel :deep(.shiki .line) {
  display: inline-block;
  width: 100%;
  min-height: 1.65em;
}
</style>

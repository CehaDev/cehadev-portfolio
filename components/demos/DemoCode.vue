<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Check, Copy, FileCode2, LoaderCircle } from 'lucide-vue-next'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langJavascript from 'shiki/dist/langs/javascript.mjs'
import langTypeScript from 'shiki/dist/langs/typescript.mjs'
import langPython from 'shiki/dist/langs/python.mjs'
import langPhp from 'shiki/dist/langs/php.mjs'
import langSql from 'shiki/dist/langs/sql.mjs'
import langBash from 'shiki/dist/langs/bash.mjs'
import langJson from 'shiki/dist/langs/json.mjs'
import langHtml from 'shiki/dist/langs/html.mjs'
import langCss from 'shiki/dist/langs/css.mjs'
import langJava from 'shiki/dist/langs/java.mjs'
import langGo from 'shiki/dist/langs/go.mjs'
import langRust from 'shiki/dist/langs/rust.mjs'
import langRuby from 'shiki/dist/langs/ruby.mjs'
import langDart from 'shiki/dist/langs/dart.mjs'
import langYaml from 'shiki/dist/langs/yaml.mjs'
import langGithubDark from 'shiki/dist/themes/github-dark.mjs'
import type { CodeFile } from '~/utils/demoCode'
import { codeLangLabel } from '~/utils/demoCode'

const props = withDefaults(
  defineProps<{
    files?: CodeFile[]
    storageKey?: string
  }>(),
  { files: () => [], storageKey: '' }
)

type ShikiLang = typeof langJavascript
const shikiLangs: Record<string, ShikiLang> = {
  javascript: langJavascript,
  typescript: langTypeScript,
  python: langPython,
  php: langPhp,
  sql: langSql,
  bash: langBash,
  json: langJson,
  html: langHtml,
  css: langCss,
  java: langJava,
  go: langGo,
  rust: langRust,
  ruby: langRuby,
  dart: langDart,
  yaml: langYaml
}

const engine = createJavaScriptRegexEngine()
let highlighterPromise: Promise<Awaited<ReturnType<typeof createHighlighterCore>>> | null = null
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [langGithubDark],
      langs: Object.values(shikiLangs),
      engine
    })
  }
  return highlighterPromise
}

const files = computed(() => (props.files ?? []).filter((f) => f.name && f.content))
const activeIdx = ref(0)
const highlighted = ref<Record<number, string>>({})
const loading = ref(false)
const error = ref('')
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const activeFile = computed(() => files.value[activeIdx.value])
const lineCount = computed(() => (activeFile.value?.content ?? '').split('\n').length)

function langClass(lang: string): string {
  return lang === 'javascript' || lang === 'typescript' ? 'bg-amber-400/15 text-amber-400'
    : lang === 'python' ? 'bg-sky-400/15 text-sky-400'
    : lang === 'sql' ? 'bg-fuchsia-400/15 text-fuchsia-400'
    : lang === 'bash' ? 'bg-emerald-400/15 text-emerald-400'
    : lang === 'json' || lang === 'html' || lang === 'css' ? 'bg-orange-400/15 text-orange-400'
    : 'bg-primary/15 text-primary'
}

async function highlight() {
  if (!activeFile.value) return
  const idx = activeIdx.value
  if (highlighted.value[idx] !== undefined) return
  const code = activeFile.value.content
  loading.value = true
  error.value = ''
  try {
    const hl = await getHighlighter()
    const lang = activeFile.value.language && shikiLangs[activeFile.value.language] ? activeFile.value.language : 'text'
    const html = await hl.codeToHtml(code, { lang, theme: 'github-dark' })
    highlighted.value[idx] = html
  } catch (e) {
    highlighted.value[idx] = ''
    error.value = String((e as Error)?.message ?? e)
  } finally {
    loading.value = false
  }
}

watch(
  [activeIdx, files],
  () => {
    if (!files.value.length) return
    if (activeIdx.value >= files.value.length) activeIdx.value = 0
    void highlight()
  },
  { immediate: true }
)

function selectFile(i: number) {
  activeIdx.value = i
}

async function copyCode() {
  if (!activeFile.value) return
  try {
    await navigator.clipboard.writeText(activeFile.value.content)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* clipboard tidak tersedia */
  }
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div v-if="files.length" class="flex h-full min-h-[540px] flex-col bg-bg text-text">
    <div class="flex items-center gap-1 overflow-x-auto border-b border-border bg-card-alt/60 px-3 pt-2" role="tablist" :aria-label="'File kode'">
      <button
        v-for="(f, i) in files"
        :key="`${f.name}-${i}`"
        type="button"
        role="tab"
        :aria-selected="i === activeIdx"
        class="inline-flex shrink-0 items-center gap-2 rounded-t-lg border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors"
        :class="i === activeIdx ? 'border-primary bg-bg text-text' : 'border-transparent text-text-muted hover:bg-card/60 hover:text-text-secondary'"
        @click="selectFile(i)"
      >
        <FileCode2 :size="13" :stroke-width="1.75" />
        <span class="max-w-44 truncate font-mono">{{ f.name }}</span>
        <span class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide" :class="langClass(f.language)">
          {{ codeLangLabel(f.language) }}
        </span>
      </button>
    </div>

    <div class="relative flex-1 overflow-hidden">
      <div class="absolute right-4 top-3 z-10 flex items-center gap-2">
        <span
          v-if="copied"
          class="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-2 py-1 text-[10px] font-semibold text-success"
        >
          <Check :size="11" :stroke-width="2.25" />
          Tersalin
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-text"
          @click="copyCode"
        >
          <Copy :size="12" :stroke-width="1.75" />
          Salin
        </button>
      </div>

      <div v-if="loading" class="flex h-full items-center justify-center gap-2 text-text-muted">
        <LoaderCircle :size="18" class="animate-spin" />
        <span class="text-xs">Menyiapkan editor...</span>
      </div>
      <div v-else class="flex h-full">
        <div
          class="select-none border-r border-border bg-card-alt/40 py-4 pl-4 pr-3 text-right font-mono text-[12.5px] leading-[1.65] text-text-muted"
          aria-hidden="true"
        >
          <div v-for="n in lineCount" :key="n">{{ n }}</div>
        </div>
        <div class="min-w-0 flex-1 overflow-x-auto py-4 pr-4">
          <div v-if="highlighted[activeIdx]" class="code-panel" v-html="highlighted[activeIdx]" />
          <pre
            v-else
            class="font-mono text-[12.5px] leading-[1.65] text-text-secondary"
          >{{ activeFile.content }}<span v-if="error" class="mt-3 block text-[10px] text-red-400">Tidak dapat mewarnai kode: {{ error }}</span></pre>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex h-full min-h-[540px] items-center justify-center bg-bg p-8 text-center text-text-muted">
    <div>
      <FileCode2 :size="28" :stroke-width="1.5" class="mx-auto opacity-60" />
      <p class="mt-3 text-sm">Belum ada file kode.</p>
      <p class="mt-1 text-xs">Atur file kode project lewat panel admin.</p>
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

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AlertCircle, FileCode2, Folder, FolderOpen, Globe, LoaderCircle, Play } from 'lucide-vue-next'
import { codeToHtml } from '~/utils/shiki'
import type { CodeFile } from '~/utils/demoCode'
import { codeLangLabel, codeLangClass } from '~/utils/demoCode'

const props = withDefaults(
  defineProps<{
    files?: CodeFile[]
    storageKey?: string
  }>(),
  { files: () => [], storageKey: '' }
)

type TreeNode = {
  name: string
  path: string
  file?: CodeFile
  children?: TreeNode[]
}

type Row = { node: TreeNode; depth: number }

const files = computed(() => (props.files ?? []).filter((f) => f.name && f.content))

const tree = ref<TreeNode[]>([])
const expanded = ref<Record<string, boolean>>({})
const activePath = ref('')
const compact = ref(false)
const rootEl = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null

function buildTree() {
  const dirs = new Map<string, TreeNode>()
  const root: TreeNode = { name: '', path: '' }
  dirs.set('', root)
  for (const f of files.value) {
    const parts = f.name.split('/').filter(Boolean)
    let parent = root
    let cur = ''
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur ? `${cur}/${parts[i]}` : parts[i]
      if (!dirs.has(cur)) {
        const node: TreeNode = { name: parts[i], path: cur, children: [] }
        dirs.set(cur, node)
        parent.children = parent.children ?? []
        parent.children.push(node)
      }
      parent = dirs.get(cur)!
    }
    parent.children = parent.children ?? []
    parent.children.push({ name: parts[parts.length - 1], path: f.name, file: f })
  }
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.children ? 0 : 1) - (b.children ? 0 : 1) || a.name.localeCompare(b.name))
    for (const n of nodes) if (n.children) sortNodes(n.children)
  }
  sortNodes(root.children ?? [])
  tree.value = root.children ?? []
  const next: Record<string, boolean> = {}
  for (const p of dirs.keys()) if (p) next[p] = true
  expanded.value = next
}

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  const walk = (nodes: TreeNode[], depth: number) => {
    for (const n of nodes) {
      out.push({ node: n, depth })
      if (n.children && expanded.value[n.path]) walk(n.children, depth + 1)
    }
  }
  walk(tree.value, 0)
  return out
})

const activeFile = computed(() => files.value.find((f) => f.name === activePath.value))

function select(row: Row) {
  if (row.node.file) {
    activePath.value = row.node.path
  } else {
    expanded.value[row.node.path] = !expanded.value[row.node.path]
  }
}

const lineCount = computed(() => (activeFile.value?.content ?? '').split('\n').length)
const highlighted = ref<Record<string, string>>({})
const loading = ref(false)
const highlightError = ref('')

async function highlight() {
  const f = activeFile.value
  if (!f) return
  if (highlighted.value[f.name] !== undefined) return
  loading.value = true
  highlightError.value = ''
  try {
    highlighted.value[f.name] = await codeToHtml(f.content, f.language)
  } catch (e) {
    highlighted.value[f.name] = ''
    highlightError.value = String((e as Error)?.message ?? e)
  } finally {
    loading.value = false
  }
}

watch(activeFile, () => { if (activeFile.value) void highlight() }, { immediate: true })

const htmlFile = computed(() => {
  const list = files.value.filter((f) => /\.html?$/i.test(f.name))
  return list.find((f) => /index\.html?$/i.test(f.name)) ?? list[0]
})

const previewDoc = ref('')
const previewMode = ref<'web' | 'note'>('note')
const previewNote = ref('')
const runKey = ref(0)

function baseName(p: string) {
  return p.split('/').pop() ?? p
}

const SCRIPT_OPEN = '<scr' + 'ipt>'
const SCRIPT_CLOSE = '</scr' + 'ipt>'

function inlineAssets(doc: string, type: 'css' | 'js') {
  let d = doc
  const done: string[] = []
  const reTag = type === 'css'
    ? /<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi
    : /<script[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi
  d = d.replace(reTag, (_m, src: string) => {
    const name = baseName(src)
    const f = files.value.find((x) => baseName(x.name) === name)
    if (f && done.indexOf(f.name) === -1) {
      done.push(f.name)
      return type === 'css' ? `<style>\n${f.content}\n</style>` : `${SCRIPT_OPEN}\n${f.content}\n${SCRIPT_CLOSE}`
    }
    return _m
  })
  for (const f of files.value) {
    if (done.indexOf(f.name) !== -1) continue
    if (type === 'css' && /\.css$/i.test(f.name)) {
      d = d.replace(/<\/head>/i, (h) => `<style>\n${f.content}\n</style>\n${h}`)
      done.push(f.name)
    } else if (type === 'js' && /\.js$/i.test(f.name)) {
      d = d.replace(/<\/body>/i, (b) => `${SCRIPT_OPEN}\n${f.content}\n${SCRIPT_CLOSE}\n${b}`)
      done.push(f.name)
    }
  }
  return d
}

function buildPreview() {
  const html = htmlFile.value
  if (!html) {
    previewMode.value = 'note'
    previewNote.value = 'Project ini tidak punya file HTML. Live preview hanya bisa menjalankan project web (index.html + CSS + JavaScript). File tetap bisa dilihat dan disalin dari editor.'
    previewDoc.value = ''
    return
  }
  let doc = html.content
  doc = inlineAssets(doc, 'css')
  doc = inlineAssets(doc, 'js')
  previewMode.value = 'web'
  previewDoc.value = doc
}

function run() {
  runKey.value++
  buildPreview()
}

onMounted(() => {
  buildTree()
  if (activePath.value === '') activePath.value = files.value[0]?.name ?? ''
  run()
  const el = rootEl.value
  if (el) {
    compact.value = el.clientWidth < 620
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        compact.value = (entries[0]?.contentRect.width ?? 0) < 620
      })
      observer.observe(el)
    }
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div v-if="files.length" ref="rootEl" class="flex h-full min-h-[540px] flex-col bg-bg text-text">
    <div class="flex items-center justify-between gap-2 border-b border-border bg-card-alt/60 px-3 py-2">
      <span class="flex min-w-0 items-center gap-2 text-xs font-semibold text-text-secondary">
        <FolderOpen :size="14" class="shrink-0 text-primary" />
        <span class="truncate">{{ files.length }} berkas</span>
      </span>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-brand px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
        @click="run"
      >
        <Play :size="12" :stroke-width="2.25" />
        Jalankan
      </button>
    </div>

    <div class="grid min-h-0 flex-1" :class="compact ? 'grid-cols-1' : 'grid-cols-[170px_1fr]'">
      <aside v-if="!compact" class="min-h-0 overflow-y-auto border-r border-border bg-card-alt/40 p-2 text-[12px]" aria-label="File project">
        <button
          v-for="row in rows"
          :key="row.node.path"
          type="button"
          class="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left transition-colors"
          :class="!row.node.file && activePath === row.node.path ? 'bg-card/80 text-text-secondary' : row.node.file && activePath === row.node.path ? 'bg-primary/15 text-text' : 'text-text-muted hover:bg-card/60 hover:text-text-secondary'"
          :style="{ paddingLeft: (row.depth * 14 + 8) + 'px' }"
          @click="select(row)"
        >
          <FolderOpen v-if="row.node.children && expanded[row.node.path]" :size="13" :stroke-width="1.75" class="shrink-0 text-sky-400" />
          <Folder v-else-if="row.node.children" :size="13" :stroke-width="1.75" class="shrink-0 text-sky-400" />
          <FileCode2 v-else :size="13" :stroke-width="1.75" class="shrink-0 text-text-muted" />
          <span class="truncate font-mono">{{ row.node.name }}</span>
        </button>
      </aside>

      <div class="flex min-h-0 flex-col">
        <div v-if="compact" class="flex gap-1 overflow-x-auto border-b border-border px-2 py-1.5">
          <button
            v-for="f in files"
            :key="f.name"
            type="button"
            class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] transition-colors"
            :class="activePath === f.name ? 'bg-primary/15 text-text' : 'bg-card/60 text-text-muted hover:text-text-secondary'"
            @click="activePath = f.name"
          >
            <FileCode2 :size="11" :stroke-width="1.75" />
            {{ baseName(f.name) }}
          </button>
        </div>

        <div class="flex items-center justify-between gap-2 border-b border-border bg-card-alt/40 px-3 py-1.5">
          <span class="flex min-w-0 items-center gap-1.5 font-mono text-[11px] font-semibold text-text-secondary">
            <FileCode2 :size="12" :stroke-width="1.75" class="shrink-0 text-primary" />
            <span class="truncate">{{ activeFile?.name ?? '—' }}</span>
          </span>
          <span class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide" :class="codeLangClass(activeFile?.language ?? '')">
            {{ codeLangLabel(activeFile?.language ?? '') }}
          </span>
        </div>

        <div class="relative h-[240px] shrink-0 overflow-hidden border-b border-border">
          <div v-if="loading" class="flex h-full items-center justify-center gap-2 text-text-muted">
            <LoaderCircle :size="18" class="animate-spin" />
            <span class="text-xs">Menyiapkan editor...</span>
          </div>
          <div v-else-if="activeFile" class="flex h-full">
            <div class="select-none border-r border-border bg-card-alt/40 py-3 pl-3 pr-2 text-right font-mono text-[12.5px] leading-[1.65] text-text-muted" aria-hidden="true">
              <div v-for="n in lineCount" :key="n">{{ n }}</div>
            </div>
            <div class="min-w-0 flex-1 overflow-x-auto py-3 pr-3">
              <div v-if="highlighted[activeFile.name]" class="code-panel" v-html="highlighted[activeFile.name]" />
              <pre class="font-mono text-[12.5px] leading-[1.65] text-text-secondary">{{ activeFile.content }}<span v-if="highlightError" class="mt-3 block text-[10px] text-red-400">Tidak dapat mewarnai kode: {{ highlightError }}</span></pre>
            </div>
          </div>
        </div>

        <div class="relative flex min-h-0 flex-1 flex-col">
          <div class="flex items-center justify-between border-b border-border bg-card-alt/60 px-3 py-1.5">
            <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <Globe :size="11" :stroke-width="1.75" class="text-primary" />
              Live Preview
            </span>
            <span v-if="previewMode === 'web'" class="flex items-center gap-1 text-[10px] text-text-muted">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true" />
              auto
            </span>
          </div>
          <iframe
            v-if="previewMode === 'web'"
            :key="runKey"
            :srcdoc="previewDoc"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Live preview project"
            class="h-full w-full border-0 bg-white"
          />
          <div v-else class="flex h-full items-center justify-center bg-bg p-6">
            <div class="max-w-sm rounded-xl border border-border bg-card/60 p-4 text-center">
              <AlertCircle :size="22" :stroke-width="1.75" class="mx-auto text-amber-400" />
              <p class="mt-2 text-xs font-semibold text-text-secondary">Tidak bisa dijalankan di browser</p>
              <p class="mt-1 text-[11px] leading-relaxed text-text-muted">{{ previewNote }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex h-full min-h-[540px] items-center justify-center bg-bg p-8 text-center text-text-muted">
    <div>
      <FileCode2 :size="28" :stroke-width="1.5" class="mx-auto opacity-60" />
      <p class="mt-3 text-sm">Belum ada file project.</p>
      <p class="mt-1 text-xs">Atur file HTML/CSS/JS lewat panel admin untuk live preview.</p>
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

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { AlertCircle, FileCode2, Folder, FolderOpen, Globe, LoaderCircle, Play, PanelLeftClose, PanelLeft } from 'lucide-vue-next'
import type { CodeFile } from '~/utils/demoCode'
import { codeLangLabel, codeLangClass } from '~/utils/demoCode'

const props = withDefaults(
  defineProps<{
    files?: CodeFile[]
    storageKey?: string
    phoneMode?: boolean
  }>(),
  { files: () => [], storageKey: '', phoneMode: false }
)

type TreeNode = { name: string; path: string; file?: CodeFile; children?: TreeNode[] }
type Row = { node: TreeNode; depth: number }

const sourceFiles = computed(() => (props.files ?? []).filter((f) => f.name && f.content))
const editedContent = reactive<Record<string, string>>({})
const files = computed(() =>
  sourceFiles.value.map((f) => ({ ...f, content: editedContent[f.name] ?? f.content }))
)

const tree = ref<TreeNode[]>([])
const expanded = ref<Record<string, boolean>>({})
const activePath = ref('')
const sidebarOpen = ref(true)

function buildTree() {
  const dirs = new Map<string, TreeNode>()
  const root: TreeNode = { name: '', path: '' }
  dirs.set('', root)
  for (const f of sourceFiles.value) {
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
  if (row.node.file) activePath.value = row.node.path
  else expanded.value[row.node.path] = !expanded.value[row.node.path]
}

const lineCount = computed(() => (activeFile.value?.content ?? '').split('\n').length)
const highlighted = ref<Record<string, string>>({})
const loading = ref(false)

async function highlight() {
  const f = activeFile.value
  if (!f || highlighted.value[f.name] !== undefined) return
  loading.value = true
  try {
    const res = await $fetch<{ html: string }>('/api/content/render', { method: 'POST', body: { code: f.content, lang: f.language } })
    highlighted.value[f.name] = res.html
  } catch {
    highlighted.value[f.name] = ''
  } finally {
    loading.value = false
  }
}

watch(activeFile, () => { if (activeFile.value) void highlight() }, { immediate: true })

const editorRef = ref<HTMLTextAreaElement | null>(null)
const highlightRef = ref<HTMLElement | null>(null)

function syncScroll() {
  const editor = editorRef.value
  const highlight = highlightRef.value
  if (editor && highlight) {
    highlight.scrollTop = editor.scrollTop
    highlight.scrollLeft = editor.scrollLeft
  }
}

function onInput(e: Event) {
  const textarea = e.target as HTMLTextAreaElement
  if (!activeFile.value) return
  editedContent[activeFile.value.name] = textarea.value
  delete highlighted.value[activeFile.value.name]
  scheduleAutoPreview()
}

function onTab(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const textarea = e.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end)
  textarea.selectionStart = textarea.selectionEnd = start + 2
  onInput(e)
}

const htmlFile = computed(() => {
  const list = files.value.filter((f) => /\.html?$/i.test(f.name))
  return list.find((f) => /index\.html?$/i.test(f.name)) ?? list[0]
})

const previewDoc = ref('')
const previewMode = ref<'web' | 'note'>('note')
const previewNote = ref('')
const runKey = ref(0)
const isLive = ref(true)

function baseName(p: string) { return p.split('/').pop() ?? p }
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
    previewNote.value = 'Project ini tidak punya file HTML. Live preview hanya bisa menjalankan project web (index.html + CSS + JavaScript).'
    previewDoc.value = ''
    return
  }
  let doc = html.content
  doc = inlineAssets(doc, 'css')
  doc = inlineAssets(doc, 'js')
  previewMode.value = 'web'
  previewDoc.value = doc
}

let autoPreviewTimer: ReturnType<typeof setTimeout> | null = null
function scheduleAutoPreview() {
  if (!isLive.value) return
  if (autoPreviewTimer) clearTimeout(autoPreviewTimer)
  autoPreviewTimer = setTimeout(() => { runKey.value++; buildPreview() }, 400)
}
function run() { runKey.value++; buildPreview() }

onMounted(() => {
  buildTree()
  if (!activePath.value) activePath.value = sourceFiles.value[0]?.name ?? ''
  run()
})
onBeforeUnmount(() => { if (autoPreviewTimer) clearTimeout(autoPreviewTimer) })
</script>

<template>
  <!-- ===== PHONE MODE: preview iframe only ===== -->
  <div v-if="phoneMode" class="flex h-full flex-col bg-bg text-text">
    <iframe
      v-if="previewMode === 'web'"
      :key="runKey"
      :srcdoc="previewDoc"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      title="Live preview project"
      class="h-full min-h-0 w-full flex-1 border-0 bg-white"
    />
    <div v-else class="flex h-full min-h-0 flex-1 items-center justify-center bg-bg p-4">
      <div class="max-w-xs rounded-xl border border-border bg-card/60 p-3 text-center">
        <AlertCircle :size="20" :stroke-width="1.75" class="mx-auto text-amber-400" />
        <p class="mt-2 text-[11px] font-semibold text-text-secondary">Tidak bisa dijalankan</p>
        <p class="mt-1 text-[10px] leading-relaxed text-text-muted">{{ previewNote }}</p>
      </div>
    </div>
  </div>

  <!-- ===== DESKTOP MODE: full editor ===== -->
  <div v-else-if="files.length" class="studio-root flex h-full flex-col bg-bg text-text">
    <!-- Toolbar -->
    <div class="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-bg-alt/50 px-2 py-1.5 sm:px-3 sm:py-2">
      <div class="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          class="hidden items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-[11px] font-semibold text-text-secondary transition-all hover:border-primary/40 hover:text-text lg:flex"
          :class="sidebarOpen ? 'border-primary/30 bg-primary/10 text-primary' : ''"
          @click="sidebarOpen = !sidebarOpen"
        >
          <PanelLeft v-if="!sidebarOpen" :size="13" :stroke-width="2" />
          <PanelLeftClose v-else :size="13" :stroke-width="2" />
        </button>
        <span class="flex items-center gap-1 text-[11px] font-semibold text-text-secondary sm:gap-1.5 sm:text-xs">
          <FolderOpen :size="13" class="shrink-0 text-primary sm:hidden" />
          <FolderOpen :size="14" class="hidden shrink-0 text-primary sm:block" />
          <span class="truncate">{{ files.length }} berkas</span>
        </span>
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          class="hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all lg:flex"
          :class="isLive ? 'border-success/40 bg-success/10 text-success' : 'border-border bg-bg text-text-secondary'"
          @click="isLive = !isLive"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="isLive ? 'animate-pulse bg-success' : 'bg-text-muted'" />
          {{ isLive ? 'Live' : 'Manual' }}
        </button>
        <button type="button" class="flex items-center gap-1 rounded-lg bg-gradient-brand px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:shadow-btn-glow hover:scale-[1.02] active:scale-95 sm:px-3" @click="run">
          <Play :size="11" :stroke-width="2.25" />
          Run
        </button>
      </div>
    </div>

    <!-- Desktop: Side by Side -->
    <div class="hidden min-h-0 flex-1 lg:grid lg:grid-cols-2">
      <!-- Code Side -->
      <div class="flex min-h-0 flex-col border-r border-border">
        <div class="grid min-h-0 flex-1" :class="sidebarOpen ? 'grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[170px_minmax(0,1fr)]' : 'grid-cols-1'">
          <aside v-if="sidebarOpen" class="min-h-0 overflow-y-auto border-r border-border bg-card-alt/30 p-1 text-[11px] sm:p-1.5 sm:text-[12px]">
            <button
              v-for="row in rows"
              :key="row.node.path"
              type="button"
              class="flex w-full items-center gap-1 rounded-lg px-1.5 py-1 text-left transition-colors sm:gap-1.5 sm:px-2 sm:py-1.5"
              :class="row.node.file && activePath === row.node.path ? 'bg-primary/15 font-medium text-text' : !row.node.file && activePath === row.node.path ? 'bg-card/80 text-text-secondary' : 'text-text-muted hover:bg-card/60 hover:text-text-secondary'"
              :style="{ paddingLeft: (row.depth * 12 + 6) + 'px' }"
              @click="select(row)"
            >
              <FolderOpen v-if="row.node.children && expanded[row.node.path]" :size="12" :stroke-width="1.75" class="shrink-0 text-sky-400" />
              <Folder v-else-if="row.node.children" :size="12" :stroke-width="1.75" class="shrink-0 text-sky-400" />
              <FileCode2 v-else :size="12" :stroke-width="1.75" class="shrink-0 text-text-muted" />
              <span class="truncate font-mono text-[10px] sm:text-[11px]">{{ row.node.name }}</span>
            </button>
          </aside>

          <div class="flex min-h-0 flex-col">
            <div class="flex shrink-0 items-center justify-between border-b border-border bg-card-alt/40 px-2 py-1 sm:px-3 sm:py-1.5">
              <span class="flex min-w-0 items-center gap-1 font-mono text-[10px] font-semibold text-text-secondary sm:gap-1.5 sm:text-[11px]">
                <FileCode2 :size="11" :stroke-width="1.75" class="shrink-0 text-primary sm:hidden" />
                <FileCode2 :size="12" :stroke-width="1.75" class="hidden shrink-0 text-primary sm:block" />
                <span class="truncate">{{ activeFile?.name ?? '—' }}</span>
                <span v-if="editedContent[activeFile?.name ?? '']" class="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" title="Modified" />
              </span>
              <span class="shrink-0 rounded-md px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide sm:px-1.5 sm:text-[9px]" :class="codeLangClass(activeFile?.language ?? '')">
                {{ codeLangLabel(activeFile?.language ?? '') }}
              </span>
            </div>
            <div class="editor-wrap relative min-h-0 flex-1 overflow-hidden">
              <div v-if="loading" class="flex h-full items-center justify-center gap-2 text-text-muted">
                <LoaderCircle :size="16" class="animate-spin sm:hidden" />
                <LoaderCircle :size="18" class="hidden animate-spin sm:block" />
                <span class="text-[11px] sm:text-xs">Menyiapkan editor...</span>
              </div>
              <template v-else-if="activeFile">
                <div class="absolute inset-y-0 left-0 z-10 flex select-none bg-card-alt/40 py-2.5 pl-2 pr-1.5 text-right font-mono text-[11px] leading-[1.65] text-text-muted sm:py-3 sm:pl-3 sm:pr-2 sm:text-[12.5px]" aria-hidden="true">
                  <div v-for="n in lineCount" :key="n">{{ n }}</div>
                </div>
                <div ref="highlightRef" class="editor-highlight pointer-events-none absolute inset-0 overflow-hidden py-2.5 pl-[40px] pr-2 sm:py-3 sm:pl-[52px] sm:pr-3">
                  <div v-if="highlighted[activeFile.name]" class="code-panel font-mono text-[11px] leading-[1.65] sm:text-[12.5px]" v-html="highlighted[activeFile.name]" />
                </div>
                <textarea
                  ref="editorRef"
                  :value="activeFile.content"
                  spellcheck="false"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  class="editor-textarea absolute inset-0 z-20 h-full w-full resize-none bg-transparent py-2.5 pl-[40px] pr-2 font-mono text-[11px] leading-[1.65] text-transparent caret-text focus:outline-none sm:py-3 sm:pl-[52px] sm:pr-3 sm:text-[12.5px]"
                  :aria-label="`Editor ${activeFile.name}`"
                  @input="onInput"
                  @keydown="onTab"
                  @scroll="syncScroll"
                />
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Side -->
      <div class="flex min-h-0 flex-col">
        <div class="flex shrink-0 items-center justify-between border-b border-border bg-card-alt/40 px-2 py-1 sm:px-3 sm:py-1.5">
          <span class="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted sm:gap-1.5 sm:text-[10px]">
            <Globe :size="10" :stroke-width="1.75" class="text-primary sm:hidden" />
            <Globe :size="11" :stroke-width="1.75" class="hidden text-primary sm:block" />
            Live Preview
          </span>
          <span v-if="previewMode === 'web' && isLive" class="flex items-center gap-1 text-[9px] text-text-muted sm:text-[10px]">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            auto
          </span>
        </div>
        <div class="min-h-0 flex-1 overflow-hidden">
          <iframe
            v-if="previewMode === 'web'"
            :key="runKey"
            :srcdoc="previewDoc"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Live preview project"
            class="h-full w-full border-0 bg-white"
          />
          <div v-else class="flex h-full items-center justify-center bg-bg p-4 sm:p-6">
            <div class="max-w-xs rounded-xl border border-border bg-card/60 p-3 text-center sm:max-w-sm sm:p-4">
              <AlertCircle :size="20" :stroke-width="1.75" class="mx-auto text-amber-400 sm:hidden" />
              <AlertCircle :size="22" :stroke-width="1.75" class="mx-auto hidden text-amber-400 sm:block" />
              <p class="mt-2 text-[11px] font-semibold text-text-secondary sm:text-xs">Tidak bisa dijalankan di browser</p>
              <p class="mt-1 text-[10px] leading-relaxed text-text-muted sm:text-[11px]">{{ previewNote }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile fallback (actual mobile viewport) -->
    <div class="min-h-0 flex-1 overflow-hidden lg:hidden">
      <iframe
        v-if="previewMode === 'web'"
        :key="runKey"
        :srcdoc="previewDoc"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        title="Live preview project"
        class="h-full w-full border-0 bg-white"
      />
      <div v-else class="flex h-full items-center justify-center bg-bg p-4 sm:p-6">
        <div class="max-w-xs rounded-xl border border-border bg-card/60 p-3 text-center sm:max-w-sm sm:p-4">
          <AlertCircle :size="20" :stroke-width="1.75" class="mx-auto text-amber-400 sm:hidden" />
          <AlertCircle :size="22" :stroke-width="1.75" class="mx-auto hidden text-amber-400 sm:block" />
          <p class="mt-2 text-[11px] font-semibold text-text-secondary sm:text-xs">Tidak bisa dijalankan di browser</p>
          <p class="mt-1 text-[10px] leading-relaxed text-text-muted sm:text-[11px]">{{ previewNote }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="flex h-full items-center justify-center bg-bg p-6 text-center text-text-muted sm:p-8">
    <div>
      <FileCode2 :size="24" :stroke-width="1.5" class="mx-auto opacity-60 sm:hidden" />
      <FileCode2 :size="28" :stroke-width="1.5" class="mx-auto hidden opacity-60 sm:block" />
      <p class="mt-2 text-xs sm:mt-3 sm:text-sm">Belum ada file project.</p>
      <p class="mt-0.5 text-[11px] sm:mt-1 sm:text-xs">Atur file HTML/CSS/JS lewat panel admin untuk live preview.</p>
    </div>
  </div>
</template>

<style scoped>
.editor-wrap { background: rgb(var(--color-bg)); }
.editor-textarea {
  color: transparent;
  caret-color: rgb(var(--color-text));
  white-space: pre;
  overflow: auto;
  tab-size: 2;
}
.editor-textarea::selection { background: rgba(139, 92, 246, 0.25); color: transparent; }
.editor-highlight { white-space: pre; overflow: hidden; pointer-events: none; }
.studio :deep(.code-panel pre.shiki) { margin: 0; padding: 0 !important; background: transparent !important; overflow: visible; }
.studio :deep(.code-panel .shiki) { font-family: inherit; font-size: inherit; line-height: inherit; }
.studio :deep(.code-panel .shiki .line) { display: inline-block; width: 100%; min-height: 1.65em; }
</style>

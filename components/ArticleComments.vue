<script setup lang="ts">
import { MessageSquare, SendHorizonal, LoaderCircle, Info, CornerDownRight, X } from 'lucide-vue-next'

interface ArticleComment {
  id: string
  articleSlug: string
  name: string
  message: string
  at: string
  parentId?: string
}

interface CommentThread {
  comment: ArticleComment
  replies: ArticleComment[]
}

const props = defineProps<{ slug: string }>()

const { lang } = useLang()
const { t } = useI18n()

// ---- Ambil komentar ----
const { data: initial } = await useAsyncData(`article-comments-${props.slug}`, () =>
  $fetch<ArticleComment[]>(`/api/content/articles/${props.slug}/comments`)
)
const comments = ref<ArticleComment[]>([...(initial.value ?? [])])

// ---- Bangun utas: komentar utama (terbaru dulu) + balasan (kronologis) ----
const threads = computed<CommentThread[]>(() => {
  const tops = comments.value.filter((c: ArticleComment) => !c.parentId)
  const byParent = new Map<string, ArticleComment[]>()
  for (const c of comments.value) {
    const pid = c.parentId ?? ''
    if (!pid || !tops.some((t: ArticleComment) => t.id === pid)) continue
    const arr = byParent.get(pid) ?? []
    arr.push(c)
    byParent.set(pid, arr)
  }
  return tops.map((comment: ArticleComment) => ({
    comment,
    replies: (byParent.get(comment.id) ?? []).sort((a, b) => a.at.localeCompare(b.at))
  }))
})

// ---- Form ----
const name = ref('')
const message = ref('')
const sending = ref(false)
const success = ref(false)
const errorMsg = ref('')
const touched = ref(false)

/** Konteks balasan aktif */
const replyTo = ref<{ id: string; name: string; nested: boolean } | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

function startReply(c: ArticleComment) {
  // nested=true berarti membalas balasan → perlu sebutan @nama
  replyTo.value = { id: c.parentId || c.id, name: c.name, nested: !!c.parentId }
  nextTick(() => textareaEl.value?.focus())
}
function cancelReply() {
  replyTo.value = null
}

const nameError = computed(() => (touched.value && name.value.trim().length < 2 ? t('comments.reqName') : ''))
const messageError = computed(() => (touched.value && message.value.trim().length < 3 ? t('comments.reqMessage') : ''))

async function submit() {
  touched.value = true
  errorMsg.value = ''
  if (name.value.trim().length < 2 || message.value.trim().length < 3) return

  sending.value = true
  try {
    // Balasan ke balasan: sisipkan sebutan nama agar konteks tersimpan permanen
    let bodyMessage = message.value.trim()
    if (replyTo.value?.nested && !bodyMessage.startsWith('@')) bodyMessage = `@${replyTo.value.name} ${bodyMessage}`

    const created = await $fetch<ArticleComment>(`/api/content/articles/${props.slug}/comments`, {
      method: 'POST',
      body: {
        name: name.value.trim(),
        message: bodyMessage.slice(0, 1000),
        parentId: replyTo.value?.id ?? ''
      }
    })
    comments.value.unshift(created)
    name.value = ''
    message.value = ''
    touched.value = false
    replyTo.value = null
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; statusCode?: number }
    errorMsg.value =
      err.statusCode === 429 ? t('comments.rateLimited') : err.data?.statusMessage || t('comments.errorFallback')
    setTimeout(() => (errorMsg.value = ''), 4000)
  } finally {
    sending.value = false
  }
}

// ---- Tampilan ----
function initials(n: string) {
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') || '?'
}

const avatarGradients = [
  'from-violet-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-lime-600',
  'from-amber-500 to-rose-600',
  'from-fuchsia-500 to-pink-600'
]
function avatarClass(n: string) {
  let sum = 0
  for (const ch of n) sum += ch.codePointAt(0) ?? 0
  return avatarGradients[sum % avatarGradients.length]
}

function relTime(at: string) {
  const d = new Date(at)
  if (Number.isNaN(d.getTime())) return at
  const rtf = new Intl.RelativeTimeFormat(lang.value === 'en' ? 'en' : 'id', { numeric: 'auto' })
  const min = Math.round((Date.now() - d.getTime()) / 60000)
  if (Math.abs(min) < 60) return rtf.format(-Math.max(min, 1), 'minute')
  const hr = Math.round(min / 60)
  if (Math.abs(hr) < 24) return rtf.format(-hr, 'hour')
  const day = Math.round(hr / 24)
  if (Math.abs(day) < 30) return rtf.format(-day, 'day')
  return new Intl.DateTimeFormat(lang.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}
</script>

<template>
  <section class="card p-5 md:p-6" aria-labelledby="comments-title">
    <!-- Header ringkas -->
    <div class="flex items-center gap-2.5">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
        <MessageSquare :size="15" :stroke-width="1.75" />
      </span>
      <h2 id="comments-title" class="flex min-w-0 items-baseline gap-2 text-base font-extrabold tracking-tight text-text">
        {{ t('comments.title') }}
        <span v-if="comments.length" class="rounded-full bg-bg-alt px-2 py-0.5 font-mono text-[10px] font-bold text-text-muted">
          {{ comments.length }}
        </span>
      </h2>
      <p class="ml-auto hidden truncate text-xs text-text-muted sm:block">{{ t('comments.subtitle') }}</p>
    </div>

    <!-- Kotak komentar modern: textarea + bar aksi menyatu -->
    <form class="mt-4" novalidate @submit.prevent="submit">
      <div class="overflow-hidden rounded-card border border-border bg-bg-alt/40 transition-colors duration-300 focus-within:border-primary/50">
        <!-- Konteks balasan -->
        <div v-if="replyTo" class="flex items-center gap-1.5 border-b border-border/60 bg-primary/5 px-4 py-2 text-[11px] font-semibold text-primary">
          <CornerDownRight :size="12" :stroke-width="2" aria-hidden="true" />
          {{ t('comments.replyingTo') }} <span class="font-bold">@{{ replyTo.name }}</span>
          <button
            type="button"
            class="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-alt hover:text-text"
            :aria-label="t('comments.cancelReply')"
            @click="cancelReply"
          >
            <X :size="12" :stroke-width="2" aria-hidden="true" />
          </button>
        </div>

        <textarea
          ref="textareaEl"
          v-model="message"
          rows="3"
          maxlength="1000"
          class="block w-full resize-y border-0 bg-transparent px-4 pt-3.5 pb-2 text-sm leading-relaxed text-text outline-none placeholder:text-text-muted"
          :placeholder="t('comments.messagePlaceholder')"
          :aria-label="t('comments.messagePlaceholder')"
          :aria-invalid="!!messageError"
        />
        <div class="flex flex-col gap-2 border-t border-border/60 px-3 py-2 sm:flex-row sm:items-center">
          <input
            v-model="name"
            type="text"
            maxlength="50"
            class="w-full border-0 bg-transparent px-1.5 py-1 text-sm font-medium text-text outline-none placeholder:font-normal placeholder:text-text-muted sm:w-48 sm:shrink-0"
            :placeholder="t('comments.namePlaceholder')"
            :aria-label="t('comments.namePlaceholder')"
            :aria-invalid="!!nameError"
          />
          <span class="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
          <p class="hidden flex-1 items-center gap-1.5 px-1.5 text-[10px] text-text-muted lg:inline-flex">
            <Info :size="11" :stroke-width="1.75" aria-hidden="true" />
            {{ t('comments.notice') }}
          </p>
          <button type="submit" class="btn-primary ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 !px-4 text-xs" :disabled="sending">
            <LoaderCircle v-if="sending" :size="13" class="animate-spin" aria-hidden="true" />
            <SendHorizonal v-else :size="13" :stroke-width="2" aria-hidden="true" />
            {{ sending ? t('comments.sending') : t('comments.submit') }}
          </button>
        </div>
      </div>

      <p class="mt-2 inline-flex items-center gap-1.5 text-[10px] text-text-muted lg:hidden">
        <Info :size="11" :stroke-width="1.75" aria-hidden="true" />
        {{ t('comments.notice') }}
      </p>
      <p v-if="nameError || messageError" class="mt-2 text-xs font-medium text-red-400">{{ nameError || messageError }}</p>

      <p v-if="success" class="mt-3 rounded-btn border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 text-xs font-medium text-emerald-400">
        {{ t('comments.success') }}
      </p>
      <p v-if="errorMsg" class="mt-3 rounded-btn border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-400">
        {{ errorMsg }}
      </p>
    </form>

    <!-- Daftar komentar: utas dengan balasan bertingkat -->
    <ul v-if="threads.length" class="mt-5 divide-y divide-border/60 border-t border-border/60">
      <li v-for="thread in threads" :key="thread.comment.id" class="py-4">
        <!-- Komentar utama -->
        <div class="flex gap-3">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-extrabold text-white"
            :class="avatarClass(thread.comment.name)"
            aria-hidden="true"
          >
            {{ initials(thread.comment.name) }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline gap-x-2">
              <span class="text-[13px] font-bold text-text">{{ thread.comment.name }}</span>
              <span class="font-mono text-[10px] text-text-muted">{{ relTime(thread.comment.at) }}</span>
              <span v-if="success && thread.comment.id === threads[0]?.comment.id" class="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                {{ t('comments.newBadge') }}
              </span>
            </div>
            <p class="mt-0.5 whitespace-pre-line break-words text-[13px] leading-relaxed text-text-secondary">{{ thread.comment.message }}</p>
            <button
              type="button"
              class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors hover:text-primary"
              @click="startReply(thread.comment)"
            >
              <CornerDownRight :size="11" :stroke-width="2" aria-hidden="true" />
              {{ t('comments.reply') }}
            </button>
          </div>
        </div>

        <!-- Balasan -->
        <div v-if="thread.replies.length" class="ml-6 mt-3 space-y-3 border-l border-border/60 pl-4 sm:ml-9">
          <div v-for="r in thread.replies" :key="r.id" class="flex gap-2.5">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-extrabold text-white"
              :class="avatarClass(r.name)"
              aria-hidden="true"
            >
              {{ initials(r.name) }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline gap-x-2">
                <span class="text-xs font-bold text-text">{{ r.name }}</span>
                <span class="font-mono text-[10px] text-text-muted">{{ relTime(r.at) }}</span>
                <span v-if="success && r.id === comments[0]?.id" class="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                  {{ t('comments.newBadge') }}
                </span>
              </div>
              <p class="mt-0.5 whitespace-pre-line break-words text-[13px] leading-relaxed text-text-secondary">{{ r.message }}</p>
              <button
                type="button"
                class="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors hover:text-primary"
                @click="startReply(r)"
              >
                <CornerDownRight :size="11" :stroke-width="2" aria-hidden="true" />
                {{ t('comments.reply') }}
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Kosong -->
    <div v-else class="mt-5 rounded-card border border-dashed border-border px-6 py-8 text-center">
      <span class="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
        <MessageSquare :size="16" :stroke-width="1.75" />
      </span>
      <p class="mt-2.5 text-[13px] font-semibold text-text">{{ t('comments.emptyTitle') }}</p>
      <p class="mt-0.5 text-xs text-text-muted">{{ t('comments.emptyDesc') }}</p>
    </div>
  </section>
</template>

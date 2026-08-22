<script setup lang="ts">
import { MessageSquare, SendHorizonal, LoaderCircle, Info } from 'lucide-vue-next'

interface ArticleComment {
  id: string
  articleSlug: string
  name: string
  message: string
  at: string
}

const props = defineProps<{ slug: string }>()

const { lang } = useLang()
const { t } = useI18n()

// ---- Ambil komentar ----
const { data: initial } = await useAsyncData(`article-comments-${props.slug}`, () =>
  $fetch<ArticleComment[]>(`/api/content/articles/${props.slug}/comments`)
)
const comments = ref<ArticleComment[]>([...(initial.value ?? [])])

// ---- Form ----
const name = ref('')
const message = ref('')
const sending = ref(false)
const success = ref(false)
const errorMsg = ref('')
const touched = ref(false)

const nameError = computed(() => (touched.value && name.value.trim().length < 2 ? t('comments.reqName') : ''))
const messageError = computed(() => (touched.value && message.value.trim().length < 3 ? t('comments.reqMessage') : ''))

async function submit() {
  touched.value = true
  errorMsg.value = ''
  if (name.value.trim().length < 2 || message.value.trim().length < 3) return

  sending.value = true
  try {
    const created = await $fetch<ArticleComment>(`/api/content/articles/${props.slug}/comments`, {
      method: 'POST',
      body: { name: name.value.trim(), message: message.value.trim() }
    })
    comments.value.unshift(created)
    name.value = ''
    message.value = ''
    touched.value = false
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
  <section class="card p-6 md:p-8" aria-labelledby="comments-title">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
        <MessageSquare :size="18" :stroke-width="1.75" />
      </span>
      <div>
        <h2 id="comments-title" class="text-lg font-extrabold tracking-tight text-text">
          {{ t('comments.title') }}
          <span v-if="comments.length" class="ml-1 rounded-full bg-bg-alt px-2.5 py-0.5 align-middle font-mono text-[11px] font-bold text-text-muted">
            {{ comments.length }}
          </span>
        </h2>
        <p class="mt-0.5 text-xs text-text-muted">{{ t('comments.subtitle') }}</p>
      </div>
    </div>

    <!-- Form -->
    <form class="mt-6 space-y-3" novalidate @submit.prevent="submit">
      <div class="grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <input
            v-model="name"
            type="text"
            maxlength="50"
            class="input-field"
            :placeholder="t('comments.namePlaceholder')"
            :aria-label="t('comments.namePlaceholder')"
            :aria-invalid="!!nameError"
          />
          <p v-if="nameError" class="mt-1 text-xs font-medium text-red-400">{{ nameError }}</p>
        </div>
        <div>
          <textarea
            v-model="message"
            rows="3"
            maxlength="1000"
            class="input-field resize-y"
            :placeholder="t('comments.messagePlaceholder')"
            :aria-label="t('comments.messagePlaceholder')"
            :aria-invalid="!!messageError"
          />
          <p v-if="messageError" class="mt-1 text-xs font-medium text-red-400">{{ messageError }}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
          <Info :size="12" :stroke-width="1.75" aria-hidden="true" />
          {{ t('comments.notice') }}
        </p>
        <button type="submit" class="btn-primary !px-5 !py-2.5 text-sm" :disabled="sending">
          <LoaderCircle v-if="sending" :size="15" class="animate-spin" aria-hidden="true" />
          <SendHorizonal v-else :size="15" :stroke-width="2" aria-hidden="true" />
          {{ sending ? t('comments.sending') : t('comments.submit') }}
        </button>
      </div>

      <p v-if="success" class="rounded-btn border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-400">
        {{ t('comments.success') }}
      </p>
      <p v-if="errorMsg" class="rounded-btn border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400">
        {{ errorMsg }}
      </p>
    </form>

    <!-- Daftar komentar -->
    <ul v-if="comments.length" class="mt-7 space-y-4">
      <li v-for="(c, i) in comments" :key="c.id">
        <div class="flex gap-3.5">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-extrabold text-white"
            :class="avatarClass(c.name)"
            aria-hidden="true"
          >
            {{ initials(c.name) }}
          </span>
          <div class="min-w-0 flex-1 rounded-card border border-border/70 bg-bg-alt/40 px-4 py-3">
            <div class="flex flex-wrap items-baseline gap-x-2.5">
              <span class="text-sm font-bold text-text">{{ c.name }}</span>
              <span class="font-mono text-[10px] text-text-muted">{{ relTime(c.at) }}</span>
              <span v-if="i === 0 && success" class="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                {{ t('comments.newBadge') }}
              </span>
            </div>
            <p class="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-text-secondary">{{ c.message }}</p>
          </div>
        </div>
      </li>
    </ul>

    <!-- Kosong -->
    <div v-else class="mt-7 rounded-card border border-dashed border-border px-6 py-10 text-center">
      <span class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
        <MessageSquare :size="20" :stroke-width="1.75" />
      </span>
      <p class="mt-3 text-sm font-semibold text-text">{{ t('comments.emptyTitle') }}</p>
      <p class="mt-1 text-xs text-text-muted">{{ t('comments.emptyDesc') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Send, Lock, LoaderCircle, User, AtSign, Tag, MessageSquare } from 'lucide-vue-next'

const { t } = useI18n()

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMsg = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = form.name.trim() ? '' : t('contact.reqName')
  errors.email = emailRegex.test(form.email) ? '' : t('contact.reqEmail')
  errors.subject = form.subject.trim() ? '' : t('contact.reqSubject')
  errors.message = form.message.trim().length >= 10 ? '' : t('contact.reqMessage')
  return !Object.values(errors).some(Boolean)
}

async function submit() {
  if (!validate() || status.value === 'loading') return
  status.value = 'loading'
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form }
    })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    status.value = 'error'
    errorMsg.value = err.data?.statusMessage ?? t('contact.errorFallback')
  }
}
</script>

<template>
  <div class="card h-full p-6 md:p-8">
    <div class="flex items-start gap-4">
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
        <Send :size="18" :stroke-width="1.75" />
      </span>
      <div>
        <h2 class="text-lg font-bold text-text">{{ t('contact.title') }}</h2>
        <p class="mt-1 text-sm text-text-secondary">{{ t('contact.desc') }}</p>
      </div>
    </div>

    <form class="mt-7 space-y-5" novalidate @submit.prevent="submit">
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="cf-name" class="mb-1.5 block text-sm font-medium text-text">{{ t('contact.name') }}</label>
          <div class="relative">
            <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <User :size="15" :stroke-width="1.5" />
            </span>
            <input
              id="cf-name"
              v-model="form.name"
              type="text"
              :class="errors.name ? '!border-red-500/60' : ''"
              class="input-field pl-10"
              placeholder="{{ t('contact.namePlaceholder') }}"
              autocomplete="name"
            />
          </div>
          <p v-if="errors.name" class="mt-1 text-xs text-red-400">{{ errors.name }}</p>
        </div>
        <div>
          <label for="cf-email" class="mb-1.5 block text-sm font-medium text-text">{{ t('contact.email') }}</label>
          <div class="relative">
            <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <AtSign :size="15" :stroke-width="1.5" />
            </span>
            <input
              id="cf-email"
              v-model="form.email"
              type="email"
              :class="errors.email ? '!border-red-500/60' : ''"
              class="input-field pl-10"
              placeholder="{{ t('contact.emailPlaceholder') }}"
              autocomplete="email"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-xs text-red-400">{{ errors.email }}</p>
        </div>
      </div>

      <div>
        <label for="cf-subject" class="mb-1.5 block text-sm font-medium text-text">{{ t('contact.subject') }}</label>
        <div class="relative">
          <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
            <Tag :size="15" :stroke-width="1.5" />
          </span>
          <input
            id="cf-subject"
            v-model="form.subject"
            type="text"
            :class="errors.subject ? '!border-red-500/60' : ''"
            class="input-field pl-10"
            placeholder="{{ t('contact.subjectPlaceholder') }}"
          />
        </div>
        <p v-if="errors.subject" class="mt-1 text-xs text-red-400">{{ errors.subject }}</p>
      </div>

      <div>
        <label for="cf-message" class="mb-1.5 block text-sm font-medium text-text">{{ t('contact.message') }}</label>
        <div class="relative">
          <span class="pointer-events-none absolute left-3.5 top-4 text-text-muted" aria-hidden="true">
            <MessageSquare :size="15" :stroke-width="1.5" />
          </span>
          <textarea
            id="cf-message"
            v-model="form.message"
            rows="5"
            :class="errors.message ? '!border-red-500/60' : ''"
            class="input-field resize-none pl-10"
            placeholder="{{ t('contact.messagePlaceholder') }}"
          />
        </div>
        <p v-if="errors.message" class="mt-1 text-xs text-red-400">{{ errors.message }}</p>
      </div>

      <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="status === 'loading'">
        <LoaderCircle v-if="status === 'loading'" :size="17" class="animate-spin" />
        <Send v-else :size="16" :stroke-width="2" />
        {{ status === 'loading' ? t('contact.sending') : t('contact.send') }}
      </button>

      <p v-if="status === 'success'" class="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status">
        {{ t('contact.success') }}
      </p>

      <p v-if="status === 'error'" class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400" role="alert">
        {{ errorMsg }}
      </p>

      <p class="flex items-center gap-2 text-xs text-text-muted">
        <Lock :size="13" :stroke-width="1.5" aria-hidden="true" />
        {{ t('contact.privacy') }}
      </p>
    </form>
  </div>
</template>

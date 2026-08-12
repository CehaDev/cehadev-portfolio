<script setup lang="ts">
import { Send, Lock, LoaderCircle } from 'lucide-vue-next'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'loading' | 'success'>('idle')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = form.name.trim() ? '' : 'Nama wajib diisi'
  errors.email = emailRegex.test(form.email) ? '' : 'Email tidak valid'
  errors.subject = form.subject.trim() ? '' : 'Subjek wajib diisi'
  errors.message = form.message.trim().length >= 10 ? '' : 'Pesan minimal 10 karakter'
  return !Object.values(errors).some(Boolean)
}

async function submit() {
  if (!validate() || status.value === 'loading') return
  status.value = 'loading'
  await new Promise((r) => setTimeout(r, 1200))
  status.value = 'success'
}
</script>

<template>
  <div class="card p-6 md:p-7">
    <h2 class="text-xl font-bold text-text">Send Me a Message</h2>
    <p class="mt-1.5 text-sm text-text-secondary">Isi form di bawah ini dan saya akan segera membalasnya.</p>

    <form class="mt-6 space-y-5" novalidate @submit.prevent="submit">
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label for="cf-name" class="mb-1.5 block text-sm font-medium text-text">Your Name</label>
          <input
            id="cf-name"
            v-model="form.name"
            type="text"
            :class="errors.name ? '!border-red-500/60' : ''"
            class="input-field"
            placeholder="Nama lengkap"
            autocomplete="name"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-400">{{ errors.name }}</p>
        </div>
        <div>
          <label for="cf-email" class="mb-1.5 block text-sm font-medium text-text">Your Email</label>
          <input
            id="cf-email"
            v-model="form.email"
            type="email"
            :class="errors.email ? '!border-red-500/60' : ''"
            class="input-field"
            placeholder="nama@email.com"
            autocomplete="email"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-400">{{ errors.email }}</p>
        </div>
      </div>

      <div>
        <label for="cf-subject" class="mb-1.5 block text-sm font-medium text-text">Subject</label>
        <input
          id="cf-subject"
          v-model="form.subject"
          type="text"
          :class="errors.subject ? '!border-red-500/60' : ''"
          class="input-field"
          placeholder="Tujuan pesan"
        />
        <p v-if="errors.subject" class="mt-1 text-xs text-red-400">{{ errors.subject }}</p>
      </div>

      <div>
        <label for="cf-message" class="mb-1.5 block text-sm font-medium text-text">Your Message</label>
        <textarea
          id="cf-message"
          v-model="form.message"
          rows="5"
          :class="errors.message ? '!border-red-500/60' : ''"
          class="input-field resize-none"
          placeholder="Tulis pesan Anda di sini..."
        />
        <p v-if="errors.message" class="mt-1 text-xs text-red-400">{{ errors.message }}</p>
      </div>

      <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="status === 'loading'">
        <LoaderCircle v-if="status === 'loading'" :size="17" class="animate-spin" />
        <Send v-else :size="16" :stroke-width="2" />
        {{ status === 'loading' ? 'Mengirim...' : 'Send Message' }}
      </button>

      <p v-if="status === 'success'" class="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status">
        Pesan berhasil dikirim! Terima kasih, saya akan segera membalas.
      </p>

      <p class="flex items-center gap-2 text-xs text-text-muted">
        <Lock :size="13" :stroke-width="1.5" aria-hidden="true" />
        Your data is safe with me
      </p>
    </form>
  </div>
</template>

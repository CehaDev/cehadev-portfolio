<script setup lang="ts">
import { MailCheck, LoaderCircle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-vue-next'

definePageMeta({ layout: 'default', middleware: 'admin-auth' })

useSeoMeta({ title: 'Verifikasi Kode | CehaDev', robots: 'noindex, nofollow' })

const code = ref('')
const error = ref('')
const busy = ref(false)
const resendBusy = ref(false)
const cooldown = ref(0)
const devCode = ref<string | null>(sessionStorage.getItem('cehadev_dev_otp'))

let timer: ReturnType<typeof setInterval> | null = null

function startCooldown(seconds: number) {
  cooldown.value = seconds
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onMounted(() => {
  startCooldown(30)
})

async function resend() {
  if (resendBusy.value || cooldown.value > 0) return
  resendBusy.value = true
  error.value = ''
  try {
    const res = await $fetch<{ ok: boolean; devCode?: string }>('/api/auth/otp/resend', { method: 'POST' })
    if (res.devCode) sessionStorage.setItem('cehadev_dev_otp', res.devCode)
    devCode.value = res.devCode ?? null
    startCooldown(30)
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal mengirim ulang kode.'
  } finally {
    resendBusy.value = false
  }
}

const codeReady = computed(() => code.value.replace(/\s/g, '').length === 6)

async function submit() {
  if (busy.value || !codeReady.value) return
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/verify', { method: 'POST', body: { code: code.value } })
    await navigateTo('/admin')
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Kode tidak valid'
    code.value = ''
  } finally {
    busy.value = false
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="container-site flex min-h-[calc(100vh-76px)] items-center justify-center py-16">
    <Reveal class="w-full max-w-md">
      <div class="card overflow-hidden">
        <div class="h-1.5 bg-gradient-brand" aria-hidden="true" />
        <div class="p-8 md:p-10">
          <div class="flex flex-col items-center text-center">
            <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
              <MailCheck :size="26" :stroke-width="1.5" />
            </span>
            <h1 class="mt-5 text-2xl font-extrabold tracking-tight text-text">
              Kode <span class="bg-gradient-brand bg-clip-text text-transparent">Login</span>
            </h1>
            <p class="mt-2 text-sm text-text-secondary">
              Kode verifikasi 6 digit telah dikirim ke email Anda. Berlaku 10 menit.
            </p>
          </div>

          <div v-if="devCode" class="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-sm font-mono font-semibold tracking-widest text-amber-500">
            Mode pengembangan: kode = {{ devCode }}
          </div>

          <form class="mt-7 space-y-5" novalidate @submit.prevent="submit">
            <div>
              <label for="verify-code" class="mb-1.5 block text-sm font-medium text-text">Kode 6 digit</label>
              <input
                id="verify-code"
                v-model="code"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                class="input-field text-center font-mono text-lg tracking-[0.4em]"
                placeholder="••••••"
                :disabled="busy"
                @input="code = code.replace(/[^0-9]/g, '').slice(0, 6)"
              />
              <p v-if="error" class="mt-1.5 text-xs text-red-400" role="alert">{{ error }}</p>
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="busy || !codeReady">
              <LoaderCircle v-if="busy" :size="16" class="animate-spin" />
              <CheckCircle2 v-else :size="16" :stroke-width="2" />
              Verifikasi & Masuk
            </button>

            <button
              type="button"
              class="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text disabled:opacity-50"
              :disabled="resendBusy || cooldown > 0"
              @click="resend"
            >
              <LoaderCircle v-if="resendBusy" :size="14" class="animate-spin" />
              <RefreshCw v-else :size="14" :stroke-width="2" />
              {{ cooldown > 0 ? `Kirim ulang kode (${cooldown}s)` : 'Kirim ulang kode' }}
            </button>
          </form>

          <NuxtLink to="/admin/login" class="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text">
            <ArrowLeft :size="14" :stroke-width="2" />
            Kembali ke login
          </NuxtLink>
        </div>
      </div>
    </Reveal>
  </div>
</template>

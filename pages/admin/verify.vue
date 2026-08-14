<script setup lang="ts">
import { ShieldCheck, LoaderCircle, ArrowLeft, ScanLine, CheckCircle2, KeyRound } from 'lucide-vue-next'

definePageMeta({ layout: 'default', middleware: 'admin-auth' })

useSeoMeta({ title: 'Verifikasi 2FA | CehaDev', robots: 'noindex, nofollow' })

interface SetupData {
  active: boolean
  secret?: string
  otpauthUrl?: string
  qrDataUrl?: string
}

const setup = ref<SetupData | null>(null)
const code = ref('')
const error = ref('')
const busy = ref(false)
const copied = ref(false)

onMounted(async () => {
  try {
    setup.value = await $fetch<SetupData>('/api/auth/totp/setup')
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Sesi verifikasi tidak ditemukan'
  }
})

const codeReady = computed(() => code.value.replace(/\s/g, '').length === 6)

async function submit() {
  if (busy.value || !codeReady.value) return
  busy.value = true
  error.value = ''
  try {
    if (setup.value?.active) {
      await $fetch('/api/auth/verify', { method: 'POST', body: { code: code.value } })
    } else {
      await $fetch('/api/auth/totp/activate', { method: 'POST', body: { code: code.value } })
    }
    await navigateTo('/admin')
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Kode tidak valid'
    code.value = ''
  } finally {
    busy.value = false
  }
}

async function copySecret() {
  if (!setup.value?.secret) return
  try {
    await navigator.clipboard.writeText(setup.value.secret)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* clipboard tidak tersedia */
  }
}
</script>

<template>
  <div class="container-site flex min-h-[calc(100vh-76px)] items-center justify-center py-16">
    <Reveal class="w-full max-w-md">
      <div class="card overflow-hidden">
        <div class="h-1.5 bg-gradient-brand" aria-hidden="true" />
        <div class="p-8 md:p-10">
          <div class="flex flex-col items-center text-center">
            <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
              <ShieldCheck :size="26" :stroke-width="1.5" />
            </span>
            <h1 class="mt-5 text-2xl font-extrabold tracking-tight text-text">
              Verifikasi <span class="bg-gradient-brand bg-clip-text text-transparent">2 Faktor</span>
            </h1>
            <p class="mt-2 text-sm text-text-secondary">
              {{
                setup?.active
                  ? 'Masukkan kode 6 digit dari aplikasi Authenticator Anda.'
                  : 'Aktifkan 2FA: scan kode QR dengan aplikasi Authenticator (Google Authenticator, Authy, dll).'
              }}
            </p>
          </div>

          <div v-if="!setup?.active" class="mt-7 flex flex-col items-center rounded-2xl border border-border bg-bg p-5">
            <template v-if="setup?.qrDataUrl">
              <img :src="setup.qrDataUrl" alt="Kode QR TOTP" class="h-48 w-48 rounded-xl bg-white p-2" />
              <div class="mt-4 w-full">
                <p class="mb-1.5 text-center text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <KeyRound :size="11" :stroke-width="1.75" class="mr-1 inline" aria-hidden="true" />
                  Kunci rahasia (ketik manual jika tidak bisa scan)
                </p>
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-text-secondary transition-colors hover:border-primary/50"
                  @click="copySecret"
                >
                  <span class="truncate">{{ setup.secret }}</span>
                  <span class="shrink-0 text-[10px] font-semibold" :class="copied ? 'text-success' : 'text-primary'">{{ copied ? 'Tersalin ✓' : 'Salin' }}</span>
                </button>
              </div>
            </template>
            <p v-else class="flex items-center gap-2 py-6 text-sm text-text-muted">
              <LoaderCircle :size="16" class="animate-spin" aria-hidden="true" />
              Menyiapkan kode QR...
            </p>
          </div>

          <form class="mt-7 space-y-5" novalidate @submit.prevent="submit">
            <div>
              <label for="verify-code" class="mb-1.5 block text-sm font-medium text-text">Kode 6 digit</label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted" aria-hidden="true">
                  <ScanLine :size="16" :stroke-width="1.5" />
                </span>
                <input
                  id="verify-code"
                  v-model="code"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  maxlength="6"
                  class="input-field !pl-11 text-center font-mono text-lg tracking-[0.4em]"
                  placeholder="••••••"
                  :disabled="busy"
                  @input="code = code.replace(/[^0-9]/g, '').slice(0, 6)"
                />
              </div>
              <p v-if="error" class="mt-1.5 text-xs text-red-400" role="alert">{{ error }}</p>
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="busy || !codeReady">
              <LoaderCircle v-if="busy" :size="16" class="animate-spin" />
              <CheckCircle2 v-else :size="16" :stroke-width="2" />
              {{ setup?.active ? 'Verifikasi & Masuk' : 'Aktifkan & Masuk' }}
            </button>
          </form>

          <NuxtLink to="/admin/login" class="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text">
            <ArrowLeft :size="14" :stroke-width="2" />
            Kembali ke login
          </NuxtLink>
        </div>
      </div>
    </Reveal>
  </div>
</template>

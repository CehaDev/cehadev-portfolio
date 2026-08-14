<script setup lang="ts">
import { ArrowLeft, ShieldCheck, LoaderCircle, RotateCw, KeyRound, Mail } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'admin-auth'
})

useSeoMeta({ title: 'Verifikasi Admin | CehaDev', robots: 'noindex, nofollow' })

const code = ref('')
const error = ref('')
const loading = ref(false)
const resending = ref(false)
const cooldown = ref(0)
const devOtp = useCookie<string | null>('cehadev_admin_devotp', { default: () => null, maxAge: 5 * 60, path: '/' })

const formattedDevOtp = computed(() => devOtp.value || '')

function startCooldown(seconds = 30) {
  cooldown.value = seconds
  const timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

onMounted(startCooldown)

async function submit() {
  if (loading.value) return
  if (!/^\d{6}$/.test(code.value)) {
    error.value = 'Masukkan kode 6 digit'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/verify', { method: 'POST', body: { code: code.value } })
    devOtp.value = null
    await navigateTo('/admin')
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Kode verifikasi salah'
  } finally {
    loading.value = false
  }
}

async function resend() {
  if (resending.value || cooldown.value > 0) return
  resending.value = true
  error.value = ''
  try {
    const res = await $fetch<{ devCode?: string | null }>('/api/auth/otp/resend', { method: 'POST' })
    devOtp.value = res.devCode ?? null
    code.value = ''
    startCooldown()
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal mengirim ulang kode'
  } finally {
    resending.value = false
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
            <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-btn-glow">
              <ShieldCheck :size="30" :stroke-width="1.75" />
            </span>
            <h1 class="mt-6 text-2xl font-extrabold tracking-tight text-text">
              Verifikasi <span class="bg-gradient-brand bg-clip-text text-transparent">Akun</span>
            </h1>
            <p class="mt-2 text-sm text-text-secondary">
              Kode verifikasi telah dikirim ke WhatsApp atau email Anda. Masukkan 6 digit kode untuk melanjutkan.
            </p>
          </div>

          <div
            v-if="formattedDevOtp"
            class="mt-6 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-sm"
          >
            <p class="flex items-center gap-2 font-semibold text-amber-300">
              <Mail :size="15" :stroke-width="1.75" />
              Mode fallback (SMTP belum aktif)
            </p>
            <p class="mt-1 text-text-secondary">
              Kode Anda: <span class="text-lg font-extrabold tracking-widest text-amber-300">{{ formattedDevOtp }}</span>
            </p>
            <p class="mt-1 text-xs text-text-muted">Atur SMTP/WhatsApp di Settings admin agar kode terkirim otomatis.</p>
          </div>

          <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
            <div>
              <label for="verify-code" class="mb-1.5 block text-sm font-medium text-text">Kode Verifikasi</label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted" aria-hidden="true">
                  <KeyRound :size="16" :stroke-width="1.5" />
                </span>
                <input
                  id="verify-code"
                  v-model="code"
                  type="text"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  maxlength="6"
                  class="input-field !pl-11 text-center !text-xl !font-extrabold tracking-[0.5em]"
                  placeholder="______"
                  @input="code = code.replace(/\D/g, '')"
                />
              </div>
              <p v-if="error" class="mt-1.5 text-xs text-red-400" role="alert">{{ error }}</p>
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="loading">
              <LoaderCircle v-if="loading" :size="16" class="animate-spin" />
              <ShieldCheck v-else :size="16" :stroke-width="2" />
              {{ loading ? 'Memverifikasi...' : 'Verifikasi' }}
            </button>
          </form>

          <div class="mt-5 text-center">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-violet disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="resending || cooldown > 0"
              @click="resend"
            >
              <LoaderCircle v-if="resending" :size="14" class="animate-spin" />
              <RotateCw v-else :size="14" :stroke-width="2" />
              {{ cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : 'Kirim ulang kode' }}
            </button>
          </div>

          <NuxtLink to="/admin/login" class="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text">
            <ArrowLeft :size="14" :stroke-width="2" />
            Kembali ke login
          </NuxtLink>
        </div>
      </div>
    </Reveal>
  </div>
</template>

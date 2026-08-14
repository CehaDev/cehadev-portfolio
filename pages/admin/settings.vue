<script setup lang="ts">
import { Settings2, Save, PlugZap, LoaderCircle, CheckCircle2, XCircle, KeyRound, Globe, AtSign, Lock, Send, ShieldCheck, Copy } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Settings'
})

interface SmtpForm {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  fromName: string
}

const { data: saved } = await useAsyncData('smtp-settings', () =>
  useRequestFetch()<{
    host: string
    port: number
    secure: boolean
    user: string
    hasPass: boolean
    from: string
    fromName: string
  }>('/api/admin/settings/smtp')
)

const form = reactive<SmtpForm>({
  host: saved.value?.host ?? '',
  port: saved.value?.port ?? 465,
  secure: saved.value?.secure ?? true,
  user: saved.value?.user ?? '',
  pass: '',
  from: saved.value?.from ?? '',
  fromName: saved.value?.fromName ?? 'CehaDev'
})

const hasStoredPass = ref(Boolean(saved.value?.hasPass))
const saving = ref(false)
const testing = ref(false)
const status = ref<{ ok: boolean; message: string } | null>(null)

const isConfigured = computed(() => Boolean(form.host && form.user && (form.pass || hasStoredPass.value)))

async function saveSettings() {
  saving.value = true
  status.value = null
  try {
    const res = await $fetch<{ ok: boolean; configured: boolean }>('/api/admin/settings/smtp', {
      method: 'POST',
      body: { ...form }
    })
    if (form.pass) hasStoredPass.value = true
    form.pass = ''
    status.value = {
      ok: true,
      message: res.configured ? 'Pengaturan SMTP tersimpan dan aktif.' : 'Pengaturan tersimpan, tetapi SMTP belum lengkap.'
    }
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    status.value = { ok: false, message: err.data?.statusMessage ?? 'Gagal menyimpan pengaturan.' }
  } finally {
    saving.value = false
  }
}

async function testConnection() {
  testing.value = true
  status.value = null
  try {
    const res = await $fetch<{ ok: boolean; message: string }>('/api/admin/settings/smtp/test', {
      method: 'POST',
      body: { ...form }
    })
    status.value = res
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    status.value = { ok: false, message: err.data?.statusMessage ?? 'Gagal menguji koneksi.' }
  } finally {
    testing.value = false
  }
}

// --- Verifikasi 2 langkah (TOTP) ---

const { data: totp, refresh: refreshTotp } = await useAsyncData('admin-totp', () =>
  useRequestFetch()<{ enabled: boolean; secret: string; otpauthUrl: string; qrDataUrl: string; verifiedAt: string | null }>('/api/admin/totp')
)

const copiedTotp = ref(false)

const verifiedDate = computed(() => {
  if (!totp.value?.verifiedAt) return null
  return new Date(totp.value.verifiedAt).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

async function copyTotpSecret() {
  if (!totp.value?.secret) return
  try {
    await navigator.clipboard.writeText(totp.value.secret)
    copiedTotp.value = true
    setTimeout(() => (copiedTotp.value = false), 2000)
  } catch {
    /* clipboard tidak tersedia */
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div v-if="status" class="card mb-6 flex items-start gap-3 px-5 py-4">
      <CheckCircle2 v-if="status.ok" :size="18" class="mt-0.5 shrink-0 text-success" aria-hidden="true" />
      <XCircle v-else :size="18" class="mt-0.5 shrink-0 text-red-400" aria-hidden="true" />
      <p class="text-sm leading-relaxed text-text-secondary" :class="status.ok ? 'text-success' : 'text-red-400'">{{ status.message }}</p>
    </div>

    <div class="card">
      <div class="flex items-center gap-3 border-b border-border px-6 py-5">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
          <Send :size="18" :stroke-width="1.5" />
        </span>
        <div>
          <h2 class="text-base font-bold text-text">Email (SMTP)</h2>
          <p class="text-xs text-text-muted">Pengaturan untuk membalas pesan kontak via email.</p>
        </div>
        <span
          class="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          :class="isConfigured ? 'border border-success/30 bg-success/10 text-success' : 'border border-red-500/30 bg-red-500/10 text-red-400'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="isConfigured ? 'bg-success' : 'bg-red-500'" aria-hidden="true" />
          {{ isConfigured ? 'Aktif' : 'Belum aktif' }}
        </span>
      </div>

      <div class="space-y-5 p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <Globe :size="13" :stroke-width="1.75" aria-hidden="true" />
              SMTP Host
            </label>
            <input v-model="form.host" type="text" class="input-field text-sm" placeholder="smtp.gmail.com" />
          </div>
          <div>
            <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <Settings2 :size="13" :stroke-width="1.75" aria-hidden="true" />
              Port
            </label>
            <input v-model.number="form.port" type="number" class="input-field text-sm" placeholder="465" />
          </div>
        </div>

        <label class="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
          <input v-model="form.secure" type="checkbox" class="h-4 w-4 accent-primary" />
          <span class="text-sm text-text-secondary">Gunakan koneksi aman (SSL/TLS) — untuk Gmail pakai port 465</span>
        </label>

        <div>
          <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <AtSign :size="13" :stroke-width="1.75" aria-hidden="true" />
            User (email pengirim)
          </label>
          <input v-model="form.user" type="email" class="input-field text-sm" placeholder="email-anda@gmail.com" />
        </div>

        <div>
          <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <Lock :size="13" :stroke-width="1.75" aria-hidden="true" />
            Password / App Password
          </label>
          <input v-model="form.pass" type="password" class="input-field text-sm" autocomplete="new-password"
            :placeholder="hasStoredPass ? '•••••••• (tersimpan — kosongkan untuk biarkan)' : 'App Password 16 karakter'" />
          <p v-if="hasStoredPass" class="mt-1.5 flex items-center gap-1 text-[11px] text-text-muted">
            <KeyRound :size="11" :stroke-width="1.75" aria-hidden="true" />
            Password tersimpan. Biarkan kosong jika tidak ingin mengubahnya.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <Send :size="13" :stroke-width="1.75" aria-hidden="true" />
              Alamat pengirim (From)
            </label>
            <input v-model="form.from" type="email" class="input-field text-sm" placeholder="email-anda@gmail.com" />
            <p class="mt-1 text-[11px] text-text-muted">Salinan setiap balasan juga masuk ke alamat ini.</p>
          </div>
          <div>
            <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <ShieldCheck :size="13" :stroke-width="1.75" aria-hidden="true" />
              Nama pengirim
            </label>
            <input v-model="form.fromName" type="text" class="input-field text-sm" placeholder="CehaDev" />
          </div>
        </div>

        <div class="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-text-secondary">
          Untuk Gmail: aktifkan <strong>2-Step Verification</strong>, lalu buat <strong>App Password</strong> di
          <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" class="text-primary hover:underline">myaccount.google.com/apppasswords</a>.
          Gunakan App Password (16 karakter, tanpa spasi) sebagai Password di atas.
        </div>

        <div class="flex items-center gap-3 pt-1">
          <button type="button" class="btn-primary inline-flex items-center gap-2" :disabled="saving" @click="saveSettings">
            <LoaderCircle v-if="saving" :size="16" class="animate-spin" />
            <Save v-else :size="16" :stroke-width="1.75" />
            Simpan
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
            :disabled="testing"
            @click="testConnection"
          >
            <LoaderCircle v-if="testing" :size="16" class="animate-spin" />
            <PlugZap v-else :size="16" :stroke-width="1.75" />
            Uji Koneksi
          </button>
        </div>
      </div>
    </div>

    <!-- Keamanan: Verifikasi 2 langkah -->
    <div class="card">
      <div class="flex items-center gap-3 border-b border-border px-6 py-5">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
          <ShieldCheck :size="18" :stroke-width="1.5" />
        </span>
        <div>
          <h2 class="text-base font-bold text-text">Keamanan — Verifikasi 2 Langkah</h2>
          <p class="text-xs text-text-muted">Login admin membutuhkan kode dari aplikasi Authenticator (TOTP).</p>
        </div>
        <span
          class="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          :class="totp?.enabled ? 'border border-success/30 bg-success/10 text-success' : 'border border-amber-400/30 bg-amber-400/10 text-amber-500'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="totp?.enabled ? 'bg-success' : 'bg-amber-500'" aria-hidden="true" />
          {{ totp?.enabled ? 'Aktif' : 'Belum aktif' }}
        </span>
      </div>

      <div class="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
        <div class="shrink-0 rounded-xl border border-border bg-white p-2">
          <img v-if="totp?.qrDataUrl" :src="totp.qrDataUrl" alt="Kode QR TOTP" class="h-40 w-40" />
          <div v-else class="flex h-40 w-40 items-center justify-center">
            <LoaderCircle :size="20" class="animate-spin text-text-muted" aria-hidden="true" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-text">Kunci rahasia & QR</p>
          <p class="mt-1 text-xs leading-relaxed text-text-secondary">
            Scan ulang QR ini (atau ketik kunci rahasia) di aplikasi <strong class="text-text">Google Authenticator</strong>, <strong class="text-text">Authy</strong>, atau aplikasi TOTP lain untuk perangkat baru.
          </p>

          <div class="mt-3 flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <code class="truncate font-mono text-xs text-text-secondary">{{ totp?.secret }}</code>
            <button
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-primary"
              @click="copyTotpSecret"
            >
              <Copy :size="11" :stroke-width="1.75" />
              {{ copiedTotp ? 'Tersalin ✓' : 'Salin' }}
            </button>
          </div>

          <p v-if="verifiedDate" class="mt-3 text-[11px] text-text-muted">
            <KeyRound :size="11" :stroke-width="1.75" class="mr-1 inline" aria-hidden="true" />
            Aktif sejak {{ verifiedDate }}
          </p>
          <p v-else class="mt-3 text-[11px] text-amber-500">
            Belum diaktifkan — kode akan diminta saat login berikutnya.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

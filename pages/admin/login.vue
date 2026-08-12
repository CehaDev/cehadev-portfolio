<script setup lang="ts">
import { ArrowLeft, Lock, LogIn, LoaderCircle } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

useSeoMeta({ title: 'Login Admin | CehaDev', robots: 'noindex, nofollow' })

const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    await navigateTo('/admin')
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } }
    error.value = err.data?.statusMessage ?? 'Gagal masuk, coba lagi'
  } finally {
    loading.value = false
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
            <img src="/ch.png" alt="CehaDev" class="h-20 w-20 rounded-2xl object-cover shadow-btn-glow" />
            <h1 class="mt-6 text-2xl font-extrabold tracking-tight text-text">
              Admin <span class="bg-gradient-brand bg-clip-text text-transparent">Panel</span>
            </h1>
            <p class="mt-2 text-sm text-text-secondary">Masuk untuk mengelola konten website</p>
          </div>

          <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
            <div>
              <label for="admin-password" class="mb-1.5 block text-sm font-medium text-text">Password</label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted" aria-hidden="true">
                  <Lock :size="16" :stroke-width="1.5" />
                </span>
                <input
                  id="admin-password"
                  v-model="password"
                  type="password"
                  class="input-field !pl-11"
                  placeholder="Masukkan password admin"
                  autocomplete="current-password"
                  required
                />
              </div>
              <p v-if="error" class="mt-1.5 text-xs text-red-400" role="alert">{{ error }}</p>
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="loading">
              <LoaderCircle v-if="loading" :size="16" class="animate-spin" />
              <LogIn v-else :size="16" :stroke-width="2" />
              {{ loading ? 'Memverifikasi...' : 'Masuk' }}
            </button>
          </form>

          <NuxtLink to="/" class="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-white">
            <ArrowLeft :size="14" :stroke-width="2" />
            Kembali ke website
          </NuxtLink>
        </div>
      </div>
    </Reveal>
  </div>
</template>

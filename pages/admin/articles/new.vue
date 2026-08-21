<script setup lang="ts">
import { Plus, ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Tulis Artikel'
})

async function onSaved(slug: string) {
  await navigateTo(`/admin/articles/${slug}`)
}
</script>

<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Plus :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Tulis Artikel Baru</h2>
            <p class="mt-1 text-sm text-text-secondary">Isi konten markdown dua bahasa, atur status terbit/draft, lalu simpan. Artikel langsung tampil di /articles.</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <NuxtLink to="/admin/articles" class="btn-outline !py-2.5">
            <ArrowLeft :size="15" :stroke-width="2" />
            Kembali ke Daftar
          </NuxtLink>
          <span class="text-[10px] text-text-muted">Kelola semua artikel</span>
        </div>
      </div>
    </div>
    <AdminArticleForm endpoint="/api/admin/articles" method="POST" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { Pencil, ArrowLeft, ExternalLink } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Edit Artikel'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: article, error } = await useAsyncData(`admin-article-${slug.value}`, () =>
  useRequestFetch()(`/api/admin/articles/${slug.value}`)
)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan', fatal: true })
}

async function onSaved(newSlug: string) {
  if (newSlug !== slug.value) {
    await navigateTo(`/admin/articles/${newSlug}`, { replace: true })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="card relative overflow-hidden p-7">
      <div class="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="relative flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-btn-glow" aria-hidden="true">
            <Pencil :size="22" :stroke-width="1.75" />
          </span>
          <div>
            <h2 class="text-lg font-extrabold tracking-tight text-text">Edit Artikel</h2>
            <p class="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              <NuxtLink :to="`/articles/${slug}`" target="_blank" class="inline-flex items-center gap-1 font-mono text-xs text-primary transition-colors hover:text-primary-violet">
                /articles/{{ slug }}
                <ExternalLink :size="11" :stroke-width="1.75" />
              </NuxtLink>
              <span v-if="article?.status === 'draft'" class="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">Draft — belum terlihat publik</span>
            </p>
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
    <AdminArticleForm :endpoint="`/api/admin/articles/${slug}`" method="PUT" :initial="article" @saved="onSaved" />
  </div>
</template>

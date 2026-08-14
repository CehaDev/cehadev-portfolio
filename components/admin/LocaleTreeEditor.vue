<script setup lang="ts">
defineProps<{
  data: any
  depth?: number
}>()

function isLS(v: any): boolean {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const keys = Object.keys(v)
  if (!keys.length) return false
  return keys.every((k) => k === 'id' || k === 'en')
}

function setLS(v: Record<string, unknown>, next: { id: string; en: string }) {
  v.id = next.id
  v.en = next.en
}

function removeKey(parent: Record<string, unknown>, key: string) {
  delete parent[key]
}

function addKey(parent: Record<string, unknown>) {
  const key = window.prompt('Nama key (contoh: tabGallery)')?.trim()
  if (key && !(key in parent)) {
    parent[key] = { id: '', en: '' }
  }
}
</script>

<template>
  <template v-if="isLS(data)">
    <LocaleInput :model-value="data" placeholder="..." @update:model-value="setLS(data, $event)" />
  </template>

  <div v-else-if="data && typeof data === 'object' && !Array.isArray(data)" class="space-y-3">
    <div v-for="(v, k) in data" :key="String(k)" class="rounded-lg border border-border bg-bg p-4">
      <div class="mb-2 flex items-center justify-between gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">{{ k }}</span>
        <button type="button" class="text-xs font-medium text-red-400 transition-colors hover:text-red-300" :aria-label="`Hapus ${String(k)}`" @click="removeKey(data, String(k))">
          Hapus
        </button>
      </div>
      <LocaleTreeEditor :data="v" :depth="(depth ?? 0) + 1" />
    </div>
    <button type="button" class="btn-outline !px-3 !py-1.5 text-xs" @click="addKey(data)">
      + Tambah Key
    </button>
  </div>

  <p v-else class="text-xs text-text-muted">(nilai: {{ String(data) }})</p>
</template>

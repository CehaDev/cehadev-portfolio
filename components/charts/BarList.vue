<script setup lang="ts">
const props = defineProps<{
  items: Array<{ label: string; value: number; hint?: string }>
  color?: string
}>()

const palette = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EC4899', '#38BDF8', '#F43F5E', '#A3E635']

const max = computed(() => Math.max(...props.items.map((i) => i.value), 1))

function pct(value: number) {
  return Math.max((value / max.value) * 100, value > 0 ? 3 : 0)
}
</script>

<template>
  <div class="space-y-3.5">
    <div v-for="(item, i) in items" :key="item.label" class="group">
      <div class="mb-1.5 flex items-baseline justify-between gap-3">
        <div class="flex min-w-0 items-baseline gap-2">
          <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: color ?? palette[i % palette.length] }" aria-hidden="true" />
          <span class="truncate text-xs font-medium text-text-secondary">{{ item.label }}</span>
          <span v-if="item.hint" class="shrink-0 text-[10px] text-text-muted">{{ item.hint }}</span>
        </div>
        <span class="shrink-0 text-xs font-bold text-text">{{ item.value.toLocaleString('id-ID') }}<span class="ml-0.5 font-medium text-text-muted">×</span></span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-bg-alt">
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{ width: pct(item.value) + '%', backgroundColor: color ?? palette[i % palette.length] }"
        />
      </div>
    </div>
  </div>
</template>

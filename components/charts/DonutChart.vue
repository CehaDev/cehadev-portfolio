<script setup lang="ts">
const props = defineProps<{
  items: Array<{ label: string; value: number }>
  size?: number
  thickness?: number
  centerLabel?: string
}>()

const palette = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EC4899', '#38BDF8', '#F43F5E', '#A3E635']

const size = props.size ?? 170
const thickness = props.thickness ?? 20
const r = (size - thickness) / 2
const C = 2 * Math.PI * r

const total = computed(() => props.items.reduce((acc, i) => acc + i.value, 0))

const segments = computed(() => {
  let offset = 0
  return props.items.map((item, i) => {
    const len = total.value > 0 ? (item.value / total.value) * C : 0
    const seg = { color: palette[i % palette.length], len, offset, label: item.label, value: item.value }
    offset += len
    return seg
  })
})
</script>

<template>
  <div class="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
    <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" class="block">
        <g transform="rotate(-90)" :style="{ transformOrigin: `${size / 2}px ${size / 2}px` }">
          <circle :cx="size / 2" :cy="size / 2" :r="r" fill="none" stroke="currentColor" class="text-bg-alt" :stroke-width="thickness" />
          <circle
            v-for="seg in segments"
            :key="seg.label"
            :cx="size / 2"
            :cy="size / 2"
            :r="r"
            fill="none"
            :stroke="seg.color"
            :stroke-width="thickness"
            :stroke-dasharray="`${seg.len} ${C - seg.len}`"
            :stroke-dashoffset="`${-seg.offset}`"
            stroke-linecap="butt"
            class="transition-all duration-700"
          />
        </g>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <p class="text-2xl font-extrabold text-text">{{ total.toLocaleString('id-ID') }}</p>
        <p class="text-[10px] font-medium uppercase tracking-wider text-text-muted">{{ centerLabel ?? 'Total' }}</p>
      </div>
    </div>

    <ul class="min-w-[180px] space-y-2">
      <li v-for="seg in segments" :key="seg.label" class="flex items-center justify-between gap-3">
        <span class="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <span class="h-2.5 w-2.5 rounded-[4px]" :style="{ backgroundColor: seg.color }" aria-hidden="true" />
          {{ seg.label }}
        </span>
        <span class="text-xs font-bold text-text">{{ seg.value.toLocaleString('id-ID') }}</span>
      </li>
    </ul>
  </div>
</template>

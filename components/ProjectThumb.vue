<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    gradient?: [string, string]
    seed?: number
    label?: string
    height?: string
  }>(),
  {
    seed: 0,
    height: 'h-44'
  }
)

const palettes = [
  ['#8B5CF6', '#3B82F6'],
  ['#06B6D4', '#3B82F6'],
  ['#22C55E', '#84CC16'],
  ['#F59E0B', '#F43F5E'],
  ['#EC4899', '#8B5CF6'],
  ['#14B8A6', '#22C55E']
]
const colors = computed(() => palettes[Math.abs(props.seed) % palettes.length])
const lineColor = computed(() => 'rgba(255,255,255,0.28)')

const bars = [40, 62, 50, 74, 44, 58, 68, 52]
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-card border border-border"
    :class="height"
    role="img"
    aria-label="Preview gambar project"
  >
    <div class="absolute inset-0" :style="`background: linear-gradient(135deg, ${colors[0]}, ${colors[1]})`" />
    <div class="absolute inset-0 opacity-20" :style="`background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 18px 18px`" />
    <svg class="absolute inset-0 h-full w-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g :stroke="lineColor" stroke-width="2" fill="none">
        <path d="M8 84 L48 62 L84 74 L124 44 L160 56 L192 30" />
        <path d="M8 96 L56 78 L96 88 L140 62 L192 76" opacity="0.6" />
      </g>
      <g opacity="0.9">
        <circle cx="48" cy="40" r="6" fill="rgba(255,255,255,0.5)" />
        <circle cx="140" cy="56" r="4" fill="rgba(255,255,255,0.6)" />
        <circle cx="104" cy="90" r="5" fill="rgba(255,255,255,0.35)" />
      </g>
    </svg>
    <span
      class="absolute left-3 top-3 rounded-md bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
    >
      {{ label }}
    </span>
    <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
  </div>
</template>

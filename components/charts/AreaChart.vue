<script setup lang="ts">
const props = defineProps<{
  labels: string[]
  values: number[]
  secondary?: number[]
  height?: number
  color?: string
  secondaryColor?: string
}>()

const color = props.color ?? '#8B5CF6'
const secondaryColor = props.secondaryColor ?? '#38BDF8'
const height = props.height ?? 240

const container = ref<HTMLElement | null>(null)
const width = ref(640)
const hover = ref<{ i: number; x: number; y: number } | null>(null)

let gradCounter = 0
const gradId = `areachart-grad-${++gradCounter}`

onMounted(() => {
  const el = container.value
  if (!el) return
  const update = () => {
    width.value = el.clientWidth
  }
  update()
  const ro = new ResizeObserver(update)
  ro.observe(el)
})

const PAD_X = 10
const PAD_TOP = 14
const PAD_BOTTOM = 26

const maxValue = computed(() => {
  const all = [...props.values, ...(props.secondary ?? [])]
  const m = Math.max(...all, 1)
  return m === 0 ? 1 : m
})

const plotW = computed(() => width.value - PAD_X * 2)
const plotH = computed(() => height - PAD_TOP - PAD_BOTTOM)

function xAt(i: number) {
  const n = props.labels.length
  return PAD_X + (n <= 1 ? plotW.value / 2 : (i / (n - 1)) * plotW.value)
}

function yAt(v: number) {
  return PAD_TOP + plotH.value - (v / maxValue.value) * plotH.value
}

const points = computed(() => props.values.map((v, i) => ({ x: xAt(i), y: yAt(v) })))

const linePath = computed(() => points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '))

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const base = PAD_TOP + plotH.value
  return `${linePath.value} L ${points.value[points.value.length - 1].x} ${base} L ${points.value[0].x} ${base} Z`
})

const secondaryPoints = computed(() => (props.secondary ?? []).map((v, i) => ({ x: xAt(i), y: yAt(v) })))

const secondaryPath = computed(() => secondaryPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '))

const gridLines = computed(() => {
  const lines: { y: number; value: number }[] = []
  for (let g = 0; g <= 4; g++) {
    const v = (maxValue.value / 4) * g
    lines.push({ y: yAt(v), value: Math.round(v) })
  }
  return lines
})

const xLabelStep = computed(() => Math.max(1, Math.ceil(props.labels.length / 7)))

function onMove(e: MouseEvent) {
  const el = container.value
  if (!el || !props.values.length) return
  const rect = el.getBoundingClientRect()
  const mx = e.clientX - rect.left
  let best = 0
  let bestDist = Infinity
  points.value.forEach((p, i) => {
    const d = Math.abs(p.x - mx)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  })
  if (bestDist < 40) {
    hover.value = { i: best, x: points.value[best].x, y: points.value[best].y }
  } else {
    hover.value = null
  }
}

function fmtDate(d: string) {
  return d.slice(5).replace('-', '/')
}
</script>

<template>
  <div ref="container" class="relative w-full select-none" :style="{ height: `${height}px` }">
    <svg v-if="width > 0" :width="width" :height="height" class="block overflow-visible">
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
          <stop :offset="0%" :stop-color="color" stop-opacity="0.3" />
          <stop :offset="100%" :stop-color="color" stop-opacity="0.01" />
        </linearGradient>
      </defs>

      <g v-for="g in gridLines" :key="g.y">
        <line :x1="PAD_X" :x2="width - PAD_X" :y1="g.y" :y2="g.y" stroke="currentColor" class="text-border" stroke-width="1" stroke-dasharray="3 5" />
        <text :x="PAD_X + 2" :y="g.y - 5" font-size="10" fill="#8E95A9">{{ g.value }}</text>
      </g>

      <path :d="areaPath" :fill="`url(#${gradId})`" />
      <path :d="linePath" fill="none" :stroke="color" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        v-if="secondaryPath"
        :d="secondaryPath"
        fill="none"
        :stroke="secondaryColor"
        stroke-width="2"
        stroke-dasharray="4 5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <g v-for="(p, i) in points" :key="i">
        <circle
          :cx="p.x"
          :cy="p.y"
          :r="hover && hover.i === i ? 5 : 3"
          :fill="hover && hover.i === i ? color : '#fff'"
          :stroke="color"
          stroke-width="2"
        />
      </g>

      <text
        v-for="(l, i) in labels"
        :key="i"
        v-show="i % xLabelStep === 0"
        :x="xAt(i)"
        :y="height - 8"
        font-size="10"
        fill="#8E95A9"
        text-anchor="middle"
      >{{ fmtDate(l) }}</text>

      <rect :width="width" :height="height" fill="transparent" @mousemove="onMove" @mouseleave="hover = null" />
    </svg>

    <div
      v-if="hover"
      class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-card px-3 py-2 shadow-btn-glow"
      :style="{ left: `${hover.x}px`, top: `${hover.y - 12}px` }"
    >
      <p class="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{{ labels[hover.i] }}</p>
      <p class="mt-0.5 text-sm font-bold text-text">{{ values[hover.i] }} kunjungan</p>
      <p v-if="secondary" class="text-[11px] text-text-secondary">{{ secondary[hover.i] }} pengunjung</p>
    </div>
  </div>
</template>

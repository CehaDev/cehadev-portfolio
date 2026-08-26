<script setup lang="ts">
import type { Component } from 'vue'

interface Fact {
  icon?: Component
  label: string
  value?: string
}

const props = withDefaults(defineProps<{
  name?: string
  role?: string
  badge?: string
  photo?: string
  photoAlt?: string
  facts?: Fact[]
  footerText?: string
  hint?: string
  uid?: string
}>(), {
  name: 'Your Name',
  role: 'Your Role',
  badge: 'Available',
  photo: '',
  photoAlt: 'Photo',
  facts: () => [],
  footerText: 'yoursite.id',
  hint: '↕ Geser ID card ke mana saja',
  uid: () => Math.random().toString(36).slice(2, 8)
})

const idCardRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const offsetX = ref(0)
const offsetY = ref(0)
const tiltX = ref(0)
const tiltY = ref(0)
const isDragging = ref(false)
const isWobbling = ref(false)
const velocityX = ref(0)
const velocityY = ref(0)
let pointerId = 0
let lastX = 0
let lastY = 0
let lastTime = 0
let animFrame = 0

function onDragStart(e: PointerEvent) {
  if (!idCardRef.value) return
  e.preventDefault()
  isDragging.value = true
  isWobbling.value = false
  cancelAnimationFrame(animFrame)
  pointerId = e.pointerId
  lastX = e.clientX
  lastY = e.clientY
  lastTime = performance.now()
  velocityX.value = 0
  velocityY.value = 0
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function onDragMove(e: PointerEvent) {
  if (!isDragging.value || e.pointerId !== pointerId) return
  const now = performance.now()
  const dt = Math.max(now - lastTime, 1)
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  const dist = Math.hypot(offsetX.value + dx, offsetY.value + dy)
  const rubber = 1 / (1 + dist * 0.001)
  offsetX.value += dx * rubber
  offsetY.value += dy * rubber
  velocityX.value = dx / dt * 16
  velocityY.value = dy / dt * 16
  tiltX.value = Math.max(-18, Math.min(18, -velocityX.value * 1.2))
  tiltY.value = Math.max(-12, Math.min(12, velocityY.value * 1.2))
  lastX = e.clientX
  lastY = e.clientY
  lastTime = now
}

function springBack() {
  const stiffness = 0.08
  const damping = 0.78
  const threshold = 0.3
  velocityX.value = (velocityX.value - offsetX.value * stiffness) * damping
  velocityY.value = (velocityY.value - offsetY.value * stiffness) * damping
  offsetX.value += velocityX.value
  offsetY.value += velocityY.value
  tiltX.value *= 0.92
  tiltY.value *= 0.92
  if (Math.abs(offsetX.value) > threshold || Math.abs(offsetY.value) > threshold ||
      Math.abs(velocityX.value) > threshold || Math.abs(velocityY.value) > threshold) {
    animFrame = requestAnimationFrame(springBack)
  } else {
    offsetX.value = 0
    offsetY.value = 0
    tiltX.value = 0
    tiltY.value = 0
    isWobbling.value = true
    setTimeout(() => { isWobbling.value = false }, 600)
  }
}

function onDragEnd(e?: PointerEvent) {
  if (e && e.pointerId !== pointerId) return
  isDragging.value = false
  springBack()
}

function onDragCancel(e: PointerEvent) {
  if (e.pointerId === pointerId) onDragEnd()
}

function lanyardPaths() {
  const hx = 130, hy = 12
  const bx = 130 + offsetX.value
  const by = 186 + offsetY.value
  const sw = 4.5
  const dx = bx - hx
  const dy = by - hy
  const c1xL = hx - 38 + dx * 0.08
  const c1yL = hy + dy * 0.32
  const c2xL = bx - 8 + dx * 0.15
  const c2yL = hy + dy * 0.72
  const c1xR = hx + 38 + dx * 0.08
  const c1yR = hy + dy * 0.32
  const c2xR = bx + 8 + dx * 0.15
  const c2yR = hy + dy * 0.72
  const lo = `M${hx - sw} ${hy} C${c1xL - sw} ${c1yL} ${c2xL - sw} ${c2yL} ${bx - sw} ${by}`
  const li = `M${hx} ${hy} C${c1xL} ${c1yL + 4} ${c2xL} ${c2yL + 4} ${bx} ${by}`
  const ri = `M${hx} ${hy} C${c1xR} ${c1yR + 4} ${c2xR} ${c2yR + 4} ${bx} ${by}`
  const ro = `M${hx + sw} ${hy} C${c1xR + sw} ${c1yR} ${c2xR + sw} ${c2yR} ${bx + sw} ${by}`
  const co = 2
  const weaveL = `M${hx - co} ${hy} C${c1xL - co} ${c1yL + 2} ${c2xL - co} ${c2yL + 2} ${bx - co} ${by}`
  const weaveR = `M${hx + co} ${hy} C${c1xR + co} ${c1yR + 2} ${c2xR + co} ${c2yR + 2} ${bx + co} ${by}`
  return { lo, li, ri, ro, weaveL, weaveR }
}

const lanyardData = computed(() => lanyardPaths())

const shadowStyle = computed(() => {
  const dx = -offsetX.value * 0.06
  const dy = 20 + Math.abs(offsetY.value) * 0.04
  const spread = 30 + Math.hypot(offsetX.value, offsetY.value) * 0.08
  return {
    boxShadow: `${dx}px ${dy}px ${spread}px rgba(0,0,0,0.35), ${dx * 0.5}px ${dy * 0.5}px ${spread * 0.5}px rgba(139,92,246,0.15)`
  }
})

const cardTransform = computed(() =>
  `perspective(800px) rotateY(${tiltX.value}deg) rotateX(${tiltY.value}deg)`
)
</script>

<template>
  <div ref="wrapperRef" class="id-card-wrapper">
    <div class="id-card-hook" aria-hidden="true">
      <div class="hook-ring"></div>
      <div class="hook-dot"></div>
    </div>

    <svg class="id-card-lanyard" :viewBox="'0 0 260 420'" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
      <defs>
        <linearGradient :id="`strapFill-${uid}`" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#8B5CF6" />
          <stop offset="35%" stop-color="#7C3AED" />
          <stop offset="70%" stop-color="#6D28D9" />
          <stop offset="92%" stop-color="#5B21B6" />
          <stop offset="100%" stop-color="#5B21B6" stop-opacity="0" />
        </linearGradient>
        <linearGradient :id="`strapShadow-${uid}`" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.12)" />
          <stop offset="92%" stop-color="rgba(0,0,0,0.12)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient :id="`strapSheen-${uid}`" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.45)" />
          <stop offset="30%" stop-color="rgba(255,255,255,0.12)" />
          <stop offset="60%" stop-color="rgba(255,255,255,0.02)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <pattern :id="`weavePattern-${uid}`" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,0.06)" stroke-width="0.8" />
        </pattern>
      </defs>
      <path :d="lanyardData.lo" :stroke="`url(#strapShadow-${uid})`" stroke-width="11" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.li" :stroke="`url(#strapShadow-${uid})`" stroke-width="11" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.lo" :stroke="`url(#strapFill-${uid})`" stroke-width="9" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.lo" :stroke="`url(#weavePattern-${uid})`" stroke-width="8" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.lo" :stroke="`url(#strapSheen-${uid})`" stroke-width="3.5" fill="none" stroke-linecap="butt" opacity="0.6" />
      <path :d="lanyardData.lo" stroke="rgba(167,139,250,0.25)" stroke-width="1" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.ro" :stroke="`url(#strapShadow-${uid})`" stroke-width="11" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.ri" :stroke="`url(#strapShadow-${uid})`" stroke-width="11" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.ro" :stroke="`url(#strapFill-${uid})`" stroke-width="9" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.ro" :stroke="`url(#weavePattern-${uid})`" stroke-width="8" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.ro" :stroke="`url(#strapSheen-${uid})`" stroke-width="3.5" fill="none" stroke-linecap="butt" opacity="0.6" />
      <path :d="lanyardData.ro" stroke="rgba(167,139,250,0.25)" stroke-width="1" fill="none" stroke-linecap="butt" />
      <path :d="lanyardData.weaveL" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" fill="none" stroke-linecap="butt" stroke-dasharray="4 3" />
      <path :d="lanyardData.weaveR" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" fill="none" stroke-linecap="butt" stroke-dasharray="4 3" />
    </svg>

    <div class="id-card-assembly" :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }">
      <div
        ref="idCardRef"
        class="id-card"
        :class="{ 'id-card--dragging': isDragging, 'id-card--wobbling': isWobbling }"
        :style="{ transform: cardTransform, ...shadowStyle }"
        @pointerdown="onDragStart"
        @pointermove="onDragMove"
        @pointerup="onDragEnd"
        @pointercancel="onDragCancel"
      >
        <div class="id-card-buckle-inline" aria-hidden="true">
          <svg width="52" height="18" viewBox="0 0 52 18">
            <defs>
              <linearGradient :id="`buckleMetal-${uid}`" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#9CA3AF" />
                <stop offset="50%" stop-color="#6B7280" />
                <stop offset="100%" stop-color="#4B5563" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="50" height="16" rx="4" :fill="`url(#buckleMetal-${uid})`" stroke="#374151" stroke-width="1" />
            <rect x="5" y="4" width="42" height="10" rx="2" fill="#1F2937" opacity="0.6" />
            <circle cx="14" cy="9" r="2.5" fill="#374151" stroke="#9CA3AF" stroke-width="0.7" />
            <circle cx="14" cy="9" r="1" fill="#8B5CF6" />
            <circle cx="38" cy="9" r="2.5" fill="#374151" stroke="#9CA3AF" stroke-width="0.7" />
            <circle cx="38" cy="9" r="1" fill="#8B5CF6" />
            <line x1="26" y1="2.5" x2="26" y2="15.5" stroke="#4B5563" stroke-width="1.5" />
            <rect x="16" y="0" width="20" height="3" rx="1.5" fill="#1F2937" />
          </svg>
        </div>

        <div class="id-card-glow" :class="{ 'id-card-glow--active': isDragging }"></div>

        <div class="id-card-stripe">
          <div class="id-card-stripe-inner"></div>
          <div class="id-card-stripe-dots" aria-hidden="true">
            <span v-for="n in 6" :key="n" class="stripe-dot" />
          </div>
        </div>

        <div class="id-card-body">
          <slot name="photo">
            <div v-if="photo" class="id-card-photo-ring">
              <div class="id-card-photo">
                <img :src="photo" :alt="photoAlt" class="id-card-photo-img" />
              </div>
              <svg class="id-card-photo-ring-svg" width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                <circle cx="48" cy="48" r="46" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="6 4" opacity="0.5" />
                <circle cx="48" cy="48" r="42" fill="none" stroke="#3B82F6" stroke-width="1" opacity="0.3" />
              </svg>
            </div>
          </slot>

          <h3 class="id-card-name">{{ name }}</h3>
          <p class="id-card-role">{{ role }}</p>

          <div class="id-card-status">
            <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            {{ badge }}
          </div>

          <div class="id-card-divider"></div>

          <slot>
            <div v-if="facts.length" class="id-card-facts">
              <div v-for="f in facts" :key="f.label" class="id-card-fact">
                <component :is="f.icon" v-if="f.icon" :size="13" :stroke-width="1.5" class="id-card-fact-icon" />
                <span class="id-card-fact-label">{{ f.label }}</span>
                <span class="id-card-fact-value">{{ f.value }}</span>
              </div>
            </div>
          </slot>
        </div>

        <slot name="footer">
          <div class="id-card-footer">
            <span class="id-card-footer-text">{{ footerText }}</span>
            <div class="id-card-barcode" aria-hidden="true">
              <span v-for="n in 24" :key="n" class="barcode-line" :style="{ height: `${10 + ((n * 7 + n * n * 3) % 11)}px`, opacity: 0.3 + ((n * 13) % 7) * 0.1 }" />
            </div>
          </div>
        </slot>
      </div>
    </div>

    <p class="id-card-hint" :class="{ 'opacity-0': isDragging }">
      <span class="hint-icon">↕</span> {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.id-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0;
  user-select: none;
  touch-action: none;
  min-height: 460px;
  overflow: visible;
}

.id-card-assembly {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 180px;
  transition: transform 0.08s linear;
  will-change: transform;
}

.id-card-hook {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.hook-ring {
  width: 24px;
  height: 12px;
  border-radius: 0 0 12px 12px;
  border: 2.5px solid #6D28D9;
  border-top: none;
  background: transparent;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  position: relative;
}

.hook-dot {
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #A78BFA, #7C3AED);
  box-shadow: 0 0 6px rgba(139, 92, 246, 0.5);
}

.id-card-lanyard {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  height: 420px;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
}

.id-card-buckle-inline {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35));
  pointer-events: none;
}

.id-card {
  position: relative;
  z-index: 3;
  width: 280px;
  background: var(--color-card);
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(139, 92, 246, 0.15);
  cursor: grab;
  transition:
    transform 0.08s linear,
    box-shadow 0.15s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.id-card:hover {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    0 0 0 2px rgba(139, 92, 246, 0.3);
}

.id-card--dragging {
  cursor: grabbing;
  transition: box-shadow 0.15s ease;
}

.id-card--wobbling {
  animation: idCardWobble 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes idCardWobble {
  0%   { transform: perspective(800px) rotateY(0) rotateX(0); }
  20%  { transform: perspective(800px) rotateY(4deg) rotateX(-2deg); }
  40%  { transform: perspective(800px) rotateY(-3deg) rotateX(1.5deg); }
  60%  { transform: perspective(800px) rotateY(2deg) rotateX(-1deg); }
  80%  { transform: perspective(800px) rotateY(-1deg) rotateX(0.5deg); }
  100% { transform: perspective(800px) rotateY(0) rotateX(0); }
}

.id-card-glow {
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: linear-gradient(135deg, #8B5CF6, #3B82F6, #8B5CF6);
  background-size: 200% 200%;
  animation: glowShift 3s ease infinite;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  padding: 2px;
}

.id-card-glow--active {
  opacity: 1;
}

@keyframes glowShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.id-card-stripe {
  height: 8px;
  background: linear-gradient(90deg, #8B5CF6 0%, #3B82F6 50%, #8B5CF6 100%);
  background-size: 200% 100%;
  position: relative;
  overflow: hidden;
}

.id-card-stripe-inner {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: stripeShimmer 2.5s ease-in-out infinite;
}

.id-card-stripe-dots {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stripe-dot {
  width: 3px;
  height: 3px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.5);
}

@keyframes stripeShimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.id-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 16px;
}

.id-card-photo-ring {
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.id-card-photo {
  width: 82px;
  height: 82px;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.12));
  border: 2.5px solid rgba(139, 92, 246, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.id-card-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.id-card-photo-ring-svg {
  position: absolute;
  inset: 0;
  animation: ringRotate 12s linear infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.id-card-name {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 800;
  color: rgb(var(--color-text));
  letter-spacing: -0.01em;
}

.id-card-role {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--color-text-secondary));
}

.id-card-status {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(34, 197, 94, 0.25);
  background: rgba(34, 197, 94, 0.08);
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 500;
  color: #22C55E;
}

.id-card-divider {
  width: 100%;
  height: 1px;
  margin: 14px 0 12px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
}

.id-card-facts {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.id-card-fact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.id-card-fact:hover {
  background: rgba(139, 92, 246, 0.06);
}

.id-card-fact-icon {
  color: #8B5CF6;
  flex-shrink: 0;
}

.id-card-fact-label {
  font-size: 10px;
  color: rgb(var(--color-text-muted));
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 48px;
}

.id-card-fact-value {
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--color-text));
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.id-card-footer {
  border-top: 1px solid rgb(var(--color-border));
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.id-card-footer-text {
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  color: #8B5CF6;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.id-card-barcode {
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 20px;
}

.barcode-line {
  width: 2px;
  background: rgb(var(--color-text));
  border-radius: 1px;
}

.id-card-hint {
  margin-top: 18px;
  font-size: 11px;
  color: rgb(var(--color-text-muted));
  text-align: center;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: hintPulse 2.5s ease-in-out infinite;
}

.hint-icon {
  font-size: 14px;
  animation: hintBounce 1.5s ease-in-out infinite;
}

@keyframes hintBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

html:not(.dark) .id-card {
  box-shadow:
    0 4px 16px rgba(15, 23, 42, 0.08),
    0 1px 4px rgba(15, 23, 42, 0.04),
    0 0 0 1px rgba(139, 92, 246, 0.12);
}

html:not(.dark) .hook-ring {
  border-color: #7C3AED;
}
</style>

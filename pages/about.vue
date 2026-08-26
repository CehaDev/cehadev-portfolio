<script setup lang="ts">
import { Quote, MapPin, Mail, Phone, Globe, CheckCircle2, Code2, Braces, Boxes, Terminal, Palette, Wrench, Monitor, Database, Download } from 'lucide-vue-next'
import { findTechByName } from '~/composables/useSkills'

const { data: site } = await useSiteSettings()
const { t } = useI18n()

useSeoMeta({
  title: () => site.value?.seo?.about?.title ?? 'About | CehaDev',
  description: () => site.value?.seo?.about?.description ?? 'Kenali lebih dekat CehaDev — Web Developer yang berfokus pada Nuxt.js, Vue.js, dan Node.js.'
})
useCanonical('/about')

const headings = computed(() => site.value?.headings?.about ?? {})

const { data: skills } = await useSkillsContent()

const facts = computed(() => [
  { icon: MapPin, label: headings.value.factLocation ?? 'Lokasi', value: site.value?.location },
  { icon: Mail, label: headings.value.factEmail ?? 'Email', value: site.value?.email },
  { icon: Globe, label: headings.value.factWebsite ?? 'Website', value: site.value?.website },
  { icon: Phone, label: headings.value.factPhone ?? 'Telepon', value: site.value?.phone }
])

const categoryIcons: Record<string, Component> = {
  Bahasa: Braces,
  Language: Braces,
  Framework: Boxes,
  Runtime: Terminal,
  Styling: Palette,
  Tooling: Wrench,
  OS: Monitor,
  Database,
  Lainnya: Code2,
  Others: Code2
}

const legacyCategory: Record<string, string> = {
  javascript: 'Bahasa',
  typescript: 'Bahasa',
  php: 'Bahasa',
  html5: 'Bahasa',
  vue: 'Framework',
  nuxt: 'Framework',
  node: 'Runtime',
  tailwind: 'Styling',
  css3: 'Styling',
  mysql: 'Database',
  git: 'Tooling',
  linux: 'OS'
}

const techSkills = computed(() => {
  const fallback = site.value?.headings?.about?.otherCategory ?? 'Lainnya'
  return (skills.value?.technicalSkills ?? []).map((s: any) => ({
    ...s,
    category: s.category || legacyCategory[s.tech] || fallback
  }))
})

const stackGroups = computed(() => {
  const fallback = site.value?.headings?.about?.otherCategory ?? 'Lainnya'
  const groups: { category: string; items: typeof techSkills.value }[] = []
  for (const item of techSkills.value) {
    const category = item.category || fallback
    let group = groups.find((g) => g.category === category)
    if (!group) {
      group = { category, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups.map((g) => ({ ...g, icon: categoryIcons[g.category] ?? Code2 }))
})

function techColor(name: string) {
  return findTechByName(name)?.color ?? '#8B5CF6'
}

/* ── ID Card Drag + Lanyard Physics ── */
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

  /* Rubber-band: resistance increases with distance */
  const dist = Math.hypot(offsetX.value + dx, offsetY.value + dy)
  const rubber = 1 / (1 + dist * 0.001)

  offsetX.value += dx * rubber
  offsetY.value += dy * rubber

  /* Track velocity for throw release */
  velocityX.value = dx / dt * 16
  velocityY.value = dy / dt * 16

  /* 3D tilt from velocity */
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

/* Lanyard: fixed SVG, dynamic paths, gradient fade into card */
function lanyardPaths() {
  const hx = 130, hy = 12         // below hook-ring opening (ring bottom ≈ y=11)
  const bx = 130 + offsetX.value  // buckle X tracks card
  const by = 186 + offsetY.value  // buckle Y tracks card
  const sw = 4.5                  // strap half-width (9px total)
  const dx = bx - hx
  const dy = by - hy

  /* S-curve control points — natural hanging rope shape */
  const c1xL = hx - 38 + dx * 0.08
  const c1yL = hy + dy * 0.32
  const c2xL = bx - 8 + dx * 0.15
  const c2yL = hy + dy * 0.72

  const c1xR = hx + 38 + dx * 0.08
  const c1yR = hy + dy * 0.32
  const c2xR = bx + 8 + dx * 0.15
  const c2yR = hy + dy * 0.72

  /* Left strap: outer + inner edges */
  const lo = `M${hx - sw} ${hy} C${c1xL - sw} ${c1yL} ${c2xL - sw} ${c2yL} ${bx - sw} ${by}`
  const li = `M${hx} ${hy} C${c1xL} ${c1yL + 4} ${c2xL} ${c2yL + 4} ${bx} ${by}`

  /* Right strap: inner + outer edges */
  const ri = `M${hx} ${hy} C${c1xR} ${c1yR + 4} ${c2xR} ${c2yR + 4} ${bx} ${by}`
  const ro = `M${hx + sw} ${hy} C${c1xR + sw} ${c1yR} ${c2xR + sw} ${c2yR} ${bx + sw} ${by}`

  /* Weave center accent lines */
  const co = 2
  const weaveL = `M${hx - co} ${hy} C${c1xL - co} ${c1yL + 2} ${c2xL - co} ${c2yL + 2} ${bx - co} ${by}`
  const weaveR = `M${hx + co} ${hy} C${c1xR + co} ${c1yR + 2} ${c2xR + co} ${c2yR + 2} ${bx + co} ${by}`

  return { lo, li, ri, ro, weaveL, weaveR }
}

const lanyardData = computed(() => lanyardPaths())

/* Dynamic shadow offset */
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
  <div class="overflow-hidden">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 -z-10"
        style="
          background-image:
            radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.12), transparent 50%),
            radial-gradient(circle at 85% 60%, rgba(59, 130, 246, 0.1), transparent 42%);
        "
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern"
        style="mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)"
        aria-hidden="true"
      />

      <div class="container-site py-16 text-center md:py-24">
        <Reveal :parallax="20">
          <div class="relative mx-auto flex justify-center">
            <AvatarIllustration :size="180" variant="code" src="/my.webp" alt="Foto CehaDev" />

            <div class="animate-float absolute bottom-4 -left-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:left-10">
              <p class="font-mono text-base font-bold text-text">2<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">{{ headings.yearsShort ?? 'yrs' }}</span></p>
            </div>

            <div class="animate-float absolute right-0 top-2 z-10 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-card backdrop-blur md:right-10" style="animation-delay: 0.8s">
              <p class="font-mono text-base font-bold text-text">10<span class="text-primary">+</span> <span class="text-xs font-medium text-text-muted">{{ headings.projectsShort ?? 'projects' }}</span></p>
            </div>
          </div>

          <span class="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-text-secondary shadow-card">
            <span class="relative flex h-2 w-2" aria-hidden="true">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {{ site?.heroBadge }} · {{ site?.location }}
          </span>

          <h1 class="mt-6 text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            <span class="text-text">Ceha</span><span class="bg-gradient-brand bg-clip-text text-transparent">Dev</span>
          </h1>

          <p class="mt-4 text-lg font-semibold text-text-secondary md:text-xl">{{ site?.role }}</p>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a :href="site?.cvUrl ? `${site.cvUrl}?download=1` : '/cv?download=1'" class="btn-primary">
              <Download :size="16" :stroke-width="2" />
              {{ headings.downloadCv ?? t('nav.downloadCv') }}
            </a>
            <NuxtLink to="/contact" class="btn-outline">
              <Mail :size="16" :stroke-width="1.75" />
              {{ headings.letsTalk ?? 'Let\'s Talk' }}
            </NuxtLink>
          </div>
        </Reveal>
      </div>

    </section>

    <!-- 01 · TENTANG SAYA -->
    <section class="container-site pb-20">
      <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">{{ headings.aboutLabel ?? '01 · Tentang Saya' }}</p>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-text md:text-4xl">
              {{ headings.whyHead1 ?? 'Why I love' }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ headings.whyHead2 ?? 'building for the web' }}</span>
            </h2>
          </Reveal>

          <Reveal class="mt-6 space-y-4 text-[15px] leading-relaxed text-text-secondary" direction="left" :parallax="12">
            <p v-for="(para, i) in site?.aboutIntro ?? []" :key="i">{{ para }}</p>
          </Reveal>

          <ul class="mt-8 space-y-3">
            <Reveal
              v-for="(item, idx) in site?.aboutChecklist ?? []"
              :key="item"
              class="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40"
              :delay="idx * 80"
              direction="left"
              :parallax="6 + idx * 3"
            >
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/25"
                aria-hidden="true"
              >
                <CheckCircle2 :size="16" :stroke-width="2" />
              </span>
              <p class="text-sm leading-relaxed text-text-secondary">{{ item }}</p>
            </Reveal>
          </ul>
        </div>

        <Reveal class="lg:sticky lg:top-24" direction="right">
          <div ref="wrapperRef" class="id-card-wrapper">
            <div class="id-card-hook" aria-hidden="true">
              <div class="hook-ring"></div>
              <div class="hook-dot"></div>
            </div>

            <!-- Lanyard SVG — fixed in wrapper, paths track card dynamically -->
            <svg class="id-card-lanyard" viewBox="0 0 260 420" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
              <defs>
                <linearGradient id="strapFill" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stop-color="#8B5CF6" />
                  <stop offset="35%" stop-color="#7C3AED" />
                  <stop offset="70%" stop-color="#6D28D9" />
                  <stop offset="92%" stop-color="#5B21B6" />
                  <stop offset="100%" stop-color="#5B21B6" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="strapShadow" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stop-color="rgba(0,0,0,0.12)" />
                  <stop offset="92%" stop-color="rgba(0,0,0,0.12)" />
                  <stop offset="100%" stop-color="rgba(0,0,0,0)" />
                </linearGradient>
                <linearGradient id="strapSheen" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stop-color="rgba(255,255,255,0.45)" />
                  <stop offset="30%" stop-color="rgba(255,255,255,0.12)" />
                  <stop offset="60%" stop-color="rgba(255,255,255,0.02)" />
                  <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </linearGradient>
                <pattern id="weavePattern" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,0.06)" stroke-width="0.8" />
                </pattern>
              </defs>

              <!-- Left strap -->
              <path :d="lanyardData.lo" stroke="url(#strapShadow)" stroke-width="11" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.li" stroke="url(#strapShadow)" stroke-width="11" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.lo" stroke="url(#strapFill)" stroke-width="9" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.lo" stroke="url(#weavePattern)" stroke-width="8" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.lo" stroke="url(#strapSheen)" stroke-width="3.5" fill="none" stroke-linecap="butt" opacity="0.6" />
              <path :d="lanyardData.lo" stroke="rgba(167,139,250,0.25)" stroke-width="1" fill="none" stroke-linecap="butt" />
              <!-- Right strap -->
              <path :d="lanyardData.ro" stroke="url(#strapShadow)" stroke-width="11" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.ri" stroke="url(#strapShadow)" stroke-width="11" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.ro" stroke="url(#strapFill)" stroke-width="9" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.ro" stroke="url(#weavePattern)" stroke-width="8" fill="none" stroke-linecap="butt" />
              <path :d="lanyardData.ro" stroke="url(#strapSheen)" stroke-width="3.5" fill="none" stroke-linecap="butt" opacity="0.6" />
              <path :d="lanyardData.ro" stroke="rgba(167,139,250,0.25)" stroke-width="1" fill="none" stroke-linecap="butt" />
              <!-- Weave accent lines -->
              <path :d="lanyardData.weaveL" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" fill="none" stroke-linecap="butt" stroke-dasharray="4 3" />
              <path :d="lanyardData.weaveR" stroke="rgba(255,255,255,0.04)" stroke-width="0.8" fill="none" stroke-linecap="butt" stroke-dasharray="4 3" />
            </svg>

            <!-- Assembly: card + buckle move together -->
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
                      <linearGradient id="buckleMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#9CA3AF" />
                        <stop offset="50%" stop-color="#6B7280" />
                        <stop offset="100%" stop-color="#4B5563" />
                      </linearGradient>
                    </defs>
                    <rect x="1" y="1" width="50" height="16" rx="4" fill="url(#buckleMetal)" stroke="#374151" stroke-width="1" />
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

              <!-- Top stripe with shimmer -->
              <div class="id-card-stripe">
                <div class="id-card-stripe-inner"></div>
                <div class="id-card-stripe-dots" aria-hidden="true">
                  <span v-for="n in 6" :key="n" class="stripe-dot" />
                </div>
              </div>

              <div class="id-card-body">
                <!-- Photo with ring -->
                <div class="id-card-photo-ring">
                  <div class="id-card-photo">
                    <AvatarIllustration :size="76" variant="code" src="/my.webp" alt="Foto CehaDev" class="relative z-10" />
                  </div>
                  <svg class="id-card-photo-ring-svg" width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                    <circle cx="48" cy="48" r="46" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="6 4" opacity="0.5" />
                    <circle cx="48" cy="48" r="42" fill="none" stroke="#3B82F6" stroke-width="1" opacity="0.3" />
                  </svg>
                </div>

                <!-- Name & role -->
                <h3 class="id-card-name">{{ site?.name }}</h3>
                <p class="id-card-role">{{ site?.role }}</p>

                <!-- Status badge -->
                <div class="id-card-status">
                  <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  {{ site?.heroBadge }}
                </div>

                <!-- Divider -->
                <div class="id-card-divider"></div>

                <!-- Facts -->
                <div class="id-card-facts">
                  <div
                    v-for="f in facts"
                    :key="f.label"
                    class="id-card-fact"
                  >
                    <component :is="f.icon" :size="13" :stroke-width="1.5" class="id-card-fact-icon" />
                    <span class="id-card-fact-label">{{ f.label }}</span>
                    <span class="id-card-fact-value">{{ f.value }}</span>
                  </div>
                </div>
              </div>

              <!-- Card footer -->
              <div class="id-card-footer">
                <span class="id-card-footer-text">cehadev.id</span>
                <div class="id-card-barcode" aria-hidden="true">
                  <span v-for="n in 24" :key="n" class="barcode-line" :style="{ height: `${10 + ((n * 7 + n * n * 3) % 11)}px`, opacity: 0.3 + ((n * 13) % 7) * 0.1 }" />
                </div>
              </div>
            </div>
            </div>

            <p class="id-card-hint" :class="{ 'opacity-0': isDragging }">
              <span class="hint-icon">↕</span> Geser ID card ke mana saja
            </p>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- QUOTE -->
    <section class="container-site pb-20">
      <Reveal class="mx-auto max-w-3xl text-center" direction="blur" :parallax="18">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
          <Quote :size="22" :stroke-width="1.5" />
        </span>
        <blockquote class="mt-6 text-2xl font-bold leading-snug tracking-tight text-text md:text-3xl">
          {{ site?.quote }}
          <span class="bg-gradient-brand bg-clip-text text-transparent">{{ site?.quoteHighlight }}</span>
        </blockquote>
        <p class="mt-4 font-mono text-sm text-text-muted">— {{ site?.heroTitleGradient }}</p>
      </Reveal>
    </section>

    <!-- 02 · TECH STACK -->
    <section class="container-site pb-20 text-center">
      <Reveal>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">{{ headings.techLabel ?? '02 · Tech Stack' }}</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
          {{ headings.toolsHead1 ?? 'Tools I' }} <span class="bg-gradient-brand bg-clip-text text-transparent">{{ headings.toolsHead2 ?? 'work with' }}</span>
        </h2>
      </Reveal>

      <div class="mx-auto mt-12 grid max-w-5xl gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(group, gIdx) in stackGroups"
          :key="group.category"
          class="card group/card relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
          :delay="gIdx * 100"
          :direction="gIdx % 2 === 0 ? 'left' : 'right'"
          :parallax="10 + gIdx * 4"
        >
          <div
            class="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 opacity-0 group-hover/card:opacity-100"
            aria-hidden="true"
          />
          <div class="relative flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
              <component :is="group.icon" :size="18" :stroke-width="1.5" />
            </span>
            <h3 class="text-base font-bold text-text">{{ group.category }}</h3>
            <span class="ml-auto rounded-full border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] text-text-muted">{{ group.items.length }}</span>
          </div>

          <ul class="relative mt-6 flex-1 space-y-4">
            <li v-for="s in group.items" :key="s.name">
              <div class="flex items-center gap-3">
                <span
                  class="stack-glyph flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-[10px] font-bold"
                  :style="{ '--glyph-color': techColor(s.name) }"
                  :aria-label="s.name"
                >
                  {{ findTechByName(s.name)?.glyph ?? s.name.slice(0, 2).toUpperCase() }}
                </span>
                <span class="min-w-0 flex-1 truncate text-sm font-semibold text-text">{{ s.name }}</span>
                <span class="font-mono text-xs font-bold text-text-secondary">{{ s.level }}<span class="text-text-muted">%</span></span>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-alt" role="progressbar" :aria-label="(headings.levelAria ?? 'Tingkat {{name}}').replace('{{name}}', s.name)" :aria-valuenow="s.level" aria-valuemin="0" aria-valuemax="100">
                <div class="skill-bar h-full rounded-full bg-gradient-brand" :style="{ width: `${s.level}%` }" />
              </div>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgb(var(--color-border) / 0.4) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--color-border) / 0.4) 1px, transparent 1px);
  background-size: 56px 56px;
}

.stack-glyph {
  color: var(--glyph-color);
}

.skill-bar {
  transform-origin: left;
  animation: skillGrow 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes skillGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Mode terang: gelapkan warna logo agar tetap terbaca di background putih */
html:not(.dark) .stack-glyph {
  color: color-mix(in srgb, var(--glyph-color) 55%, #1e293b);
}

/* ═══════════════════════════════════════
   ID CARD + LANYARD (Modern)
   ═══════════════════════════════════════ */

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

/* ── Assembly: only card + buckle move ── */
.id-card-assembly {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 180px;
  transition: transform 0.08s linear;
  will-change: transform;
}

/* ── Hook anchor (D-ring, fixed at wrapper top) ── */
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

/* ── Lanyard SVG (fixed in wrapper, paths track card) ── */
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

/* ── Buckle (inside card, at top) ── */
.id-card-buckle-inline {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35));
  pointer-events: none;
}

/* ── ID Card ── */
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

/* ── Glow border overlay ── */
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

/* ── Stripe header ── */
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

/* ── Card body ── */
.id-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 16px;
}

/* ── Photo with ring ── */
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

.id-card-photo-ring-svg {
  position: absolute;
  inset: 0;
  animation: ringRotate 12s linear infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Name ── */
.id-card-name {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 800;
  color: rgb(var(--color-text));
  letter-spacing: -0.01em;
}

/* ── Role ── */
.id-card-role {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 500;
  color: rgb(var(--color-text-secondary));
}

/* ── Status ── */
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

/* ── Divider ── */
.id-card-divider {
  width: 100%;
  height: 1px;
  margin: 14px 0 12px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
}

/* ── Facts ── */
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

/* ── Footer ── */
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

/* ── Drag hint ── */
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

/* ── Dark mode tweaks ── */
html:not(.dark) .id-card {
  box-shadow:
    0 4px 16px rgba(15, 23, 42, 0.08),
    0 1px 4px rgba(15, 23, 42, 0.04),
    0 0 0 1px rgba(139, 92, 246, 0.12);
}

html:not(.dark) .hook-ring {
  border-color: #7C3AED;
}

html:not(.dark) .id-card-buckle {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}
</style>

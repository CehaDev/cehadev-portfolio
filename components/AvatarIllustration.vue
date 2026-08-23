<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number
    variant?: 'default' | 'laptop' | 'code'
    src?: string
    alt?: string
  }>(),
  { size: 260, variant: 'default', src: '', alt: 'Ilustrasi karakter CehaDev' }
)
</script>

<template>
  <div
    class="relative"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="img"
    :aria-label="alt"
  >
    <div class="absolute -inset-10 bg-glow-circle blur-2xl" aria-hidden="true" />
    <div
      class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-border bg-card shadow-card"
    >
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <svg
        v-else
        :viewBox="'0 0 200 200'"
        class="h-[82%] w-[82%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="brand-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#8B5CF6" />
            <stop offset="100%" stop-color="#3B82F6" />
          </linearGradient>
        </defs>

        <!-- body / hoodie -->
        <path
          d="M62 116c8-14 18-20 38-20s30 6 38 20v18c0 6-5 10-11 10H73c-6 0-11-4-11-10v-18z"
          fill="url(#brand-g)"
        />
        <!-- hoodie pocket -->
        <path d="M84 128h32c-2 8-10 13-16 13s-14-5-16-13z" fill="rgba(255,255,255,0.18)" />
        <!-- neck -->
        <rect x="92" y="90" width="16" height="12" rx="5" fill="#E8B98A" />
        <!-- head -->
        <circle cx="100" cy="72" r="30" fill="#F2C79B" />
        <!-- hair -->
        <path
          d="M70 62c0-16 13-26 30-26s30 10 30 26c-4-6-9-8-16-9 1-5-3-9-8-9-4 0-7 3-7 7-5 0-10 2-13 5-5-2-10-3-16 6z"
          fill="#262633"
        />
        <!-- glasses -->
        <g stroke="url(#brand-g)" stroke-width="4">
          <circle cx="87" cy="72" r="9" fill="rgba(255,255,255,0.08)" />
          <circle cx="113" cy="72" r="9" fill="rgba(255,255,255,0.08)" />
          <path d="M96 72h8" stroke-width="3" />
        </g>
        <!-- eyes -->
        <circle cx="87" cy="72" r="2" fill="#262633" />
        <circle cx="113" cy="72" r="2" fill="#262633" />
        <!-- smile -->
        <path d="M92 82c4 3 12 3 16 0" stroke="#B9774A" stroke-width="2.5" stroke-linecap="round" />

        <!-- variant extras -->
        <g v-if="variant === 'laptop'">
          <rect x="62" y="132" width="76" height="30" rx="5" fill="#0B0B12" stroke="url(#brand-g)" stroke-width="2.5" />
          <rect x="68" y="138" width="64" height="18" rx="2" fill="#161620" />
          <path d="M72 146l10 6 8-10 8 8 8-14 8 10" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" />
          <rect x="84" y="162" width="32" height="5" rx="2.5" fill="#262633" />
        </g>
        <g v-else-if="variant === 'code'">
          <rect x="58" y="128" width="84" height="26" rx="6" fill="#0B0B12" stroke="url(#brand-g)" stroke-width="2.5" />
          <text x="70" y="146" font-family="monospace" font-size="13" font-weight="bold" fill="#22C55E">&lt;/&gt;</text>
        </g>
      </svg>
    </div>
  </div>
</template>

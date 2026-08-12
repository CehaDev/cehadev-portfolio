<script setup lang="ts">
import { MapPin, Navigation } from 'lucide-vue-next'
</script>

<template>
  <div class="card overflow-hidden">
    <div
      class="relative h-44 overflow-hidden border-b border-border bg-bg-alt"
      role="img"
      aria-label="Peta Jakarta dengan penanda lokasi"
    >
      <div
        class="absolute inset-0"
        style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 28px 28px"
        aria-hidden="true"
      />
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="rgba(139,92,246,0.35)" stroke-width="2">
          <path d="M0 60 C60 20, 120 90, 180 50 S300 40, 300 70" />
          <path d="M0 110 C80 70, 160 130, 240 100 S300 110, 300 120" opacity="0.7" />
          <path d="M40 0 C60 50, 20 100, 60 150" opacity="0.6" />
          <path d="M180 0 C200 40, 170 110, 200 150" opacity="0.8" />
          <path d="M120 0 C110 60, 150 100, 140 150" opacity="0.5" />
        </g>
        <circle cx="150" cy="75" r="34" fill="rgba(124,58,237,0.18)" />
        <circle cx="150" cy="75" r="22" fill="rgba(124,58,237,0.28)" />
      </svg>
      <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-btn-glow" aria-hidden="true">
          <MapPin :size="20" :stroke-width="1.75" />
          <span class="absolute inset-0 animate-ping rounded-full bg-primary/50" />
        </span>
      </span>
      <span class="absolute right-3 top-3 rounded-md bg-black/50 px-2.5 py-1 text-[10px] font-medium text-text-secondary backdrop-blur-sm">Jakarta, Indonesia</span>
    </div>

    <div class="p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-text">Jakarta, Indonesia</p>
          <p class="mt-1 text-xs text-text-muted">Open to remote work worldwide</p>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-medium text-success">
          <span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          Online
        </span>
      </div>
      <a
        href="https://maps.google.com/?q=Jakarta,Indonesia"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-outline mt-5 w-full !py-2.5"
      >
        <Navigation :size="15" :stroke-width="1.75" />
        View on Maps
      </a>
    </div>
  </div>
</template>

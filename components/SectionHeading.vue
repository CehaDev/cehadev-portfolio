<script setup lang="ts">
import type { Component } from 'vue'
import { Quote } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    icon?: Component
    label?: string
    title?: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' }
)

const Icon = props.icon || Quote
</script>

<template>
  <div class="mb-12" :class="align === 'center' ? 'text-center' : ''">
    <span v-if="label" class="section-label" :class="align === 'center' ? 'mx-auto' : ''">
      <span class="dot" aria-hidden="true" />
      {{ label }}
    </span>
    <h1
      v-if="title"
      class="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl"
    >{{ title }}</h1>
    <p v-if="description" class="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary" :class="align === 'center' ? 'mx-auto' : ''">
      {{ description }}
    </p>
  </div>
</template>

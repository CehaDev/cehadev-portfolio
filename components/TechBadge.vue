<script setup lang="ts">
import { techIcons } from '~/composables/useSkills'

const props = withDefaults(
  defineProps<{
    name: string
    showGlyph?: boolean
  }>(),
  { showGlyph: true }
)

const tech = computed(() => techIcons[props.name.toLowerCase().replace('&', '').trim()])
</script>

<template>
  <span v-if="tech" class="chip">
    <span
      v-if="showGlyph"
      class="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold"
      :style="{ backgroundColor: tech.color + '22', color: tech.color }"
      aria-hidden="true"
    >
      {{ tech.glyph }}
    </span>
    {{ tech.name }}
  </span>
  <span v-else class="chip">{{ name }}</span>
</template>

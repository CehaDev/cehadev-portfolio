<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | { id?: string; en?: string } | null
    id?: string
    placeholder?: string
    rows?: number
    labelId?: string
    labelEn?: string
  }>(),
  {
    modelValue: '',
    id: undefined,
    placeholder: '',
    rows: 3,
    labelId: 'ID',
    labelEn: 'EN'
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: { id: string; en: string }] }>()

const ls = computed({
  get() {
    const v = props.modelValue
    if (typeof v === 'string') return { id: v, en: v }
    return { id: v?.id ?? '', en: v?.en ?? '' }
  },
  set(value: { id: string; en: string }) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="grid gap-2 sm:grid-cols-2">
    <div>
      <span class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">{{ labelId }}</span>
      <textarea
        :id="id ? `${id}-id` : undefined"
        v-model="ls.id"
        :rows="rows"
        class="input-field resize-none"
        :placeholder="placeholder"
      />
    </div>
    <div>
      <span class="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">{{ labelEn }}</span>
      <textarea
        :id="id ? `${id}-en` : undefined"
        v-model="ls.en"
        :rows="rows"
        class="input-field resize-none"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

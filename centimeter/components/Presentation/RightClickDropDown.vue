<template>
    <div
        class="fixed z-50 inline-block bg-[var(--bg-color)] rounded-md shadow-lg border border-[var(--faded-bg-color)]"
        :style="{ left: x + 'px', top: y + 'px' }"
        @click.stop
    >
        <div class="p-1">
            <button
                type="button"
                class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--faded-bg-color)] transition-colors whitespace-nowrap"
                aria-label="Delete slide"
                @click="onDelete"
            >
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--danger-bg)] text-[var(--danger)]">
                    <Trash :size="16" />
                </span>
                <span class="text-sm font-medium text-[var(--text-color)]">Delete Slide</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Trash } from 'lucide-vue-next'

const props = defineProps<{
  x: number
  y: number
  slideIndex?: number
}>()

const emit = defineEmits<{
  delete: [index?: number]  
  close: []
}>()

function onDelete() {
  emit('delete', props.slideIndex)
  emit('close')
}
</script>
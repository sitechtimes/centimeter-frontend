<template>
  <div class="w-full max-w-xs bg-[var(--bg-color)] rounded-lg shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-[var(--text-color)]">Slide</h2>
      <button
        class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]"
        @click="$emit('close')"
      >
        <X class="w-6 h-6" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-8">
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-[var(--text-color)]">Question type</h3>
        <div class="relative">
          <button
            class="w-full flex items-center gap-3 px-4 py-3 bg-[var(--faded-bg-color-light)] hover:bg-[var(--faded-bg-color)] rounded-lg border border-[var(--faded-bg-color-dark)] transition-colors"
          >
            <BookPlus class="w-6 h-6 text-[var(--faded-text-color)]" />
            <span class="text-sm font-medium text-[var(--faded-text-color)]"> 
              {{ selectedSlide?.type ?? 'Multiple Choice' }}
            </span> 
            <span class="ml-auto">
              <ArrowDown class="w-6 h-6 text-[var(--faded-text-color)]" />
            </span>
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <h3 class="text-sm font-semibold text-[var(--text-color)] mb-1">Image</h3>
          <p class="text-sm text-[var(--faded-text-color)]">
            We support png, gif, jpg, jpeg and svg
          </p>
        </div>
        <div
          class="border-2 border-dashed border-[var(--faded-bg-color-dark)] rounded-lg p-8 text-center hover:border-[var(--faded-bg-color)] hover:bg-[var(--faded-bg-color-light)] transition-colors cursor-pointer"
        >
          <p class="text-sm text-[var(--faded-text-color)]">
            Drag and drop or
            <button class="text-[var(--primary)] hover:text-[var(--primary-shade)] font-medium">
              Click to add image
            </button>
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-semibold text-[var(--text-color)]">Background</h3>

        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)] font-medium">Background color</label>
          <div class="flex items-center gap-2">
            <ArrowDown class="text-black" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)] font-medium">Background image</label>
          <div class="flex items-center gap-2">
            <ArrowDown class="text-black" />
          </div>
        </div>

        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 text-[var(--faded-text-color)] text-sm font-medium hover:text-[var(--text-color)] transition-colors"
        >
          <Plus class="w-4 h-4" />
          Add
        </button>

        <button
          class="w-full text-center text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors py-2"
        >
          Reset to theme defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookPlus, X, ArrowDown, Plus } from 'lucide-vue-next'
import type { Slide } from '../../../utils/types'
defineProps<{ selectedSlide?: Slide }>()
</script>
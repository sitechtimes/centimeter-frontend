<template>
  <div class="w-full max-w-xs bg-[var(--bg-color)] rounded-lg shadow-sm h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
  <h2 class="text-lg font-semibold text-[var(--text-color)]">Slide</h2>
    <button class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
        <X class="w-6 h-6"/>
      </button>
    </div>

    <!-- Added flex-col and overflow-y-auto to allow scrolling, added padding to content -->
    <div class="flex-1 overflow-y-auto p-6 space-y-8">
      <!-- Question Type Section -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-gray-900">Question type</h3>
        <div class="relative">
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-[var(--faded-bg-color-light)] hover:bg-[var(--faded-bg-color)] rounded-lg border border-[var(--faded-bg-color-dark)] transition-colors">
            <svg class="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 0a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1h10a1 1 0 001-1V5z" />
            </svg>
            <span class="text-sm font-medium text-[var(--faded-text-color)]">Multiple Choice</span>
            <svg class="w-5 h-5 text-[var(--faded-text-color)] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Image Section -->
      <div class="space-y-3">
        <div>
          <h3 class="text-sm font-semibold text-[var(--text-color)] mb-1">Image</h3>
          <p class="text-sm text-[var(--faded-text-color)]">We support png, gif, jpg, jpeg and svg</p>
        </div>
        <div class="border-2 border-dashed border-[var(--faded-bg-color-dark)] rounded-lg p-8 text-center hover:border-[var(--faded-bg-color)] hover:bg-[var(--faded-bg-color-light)] transition-colors cursor-pointer">
          <svg class="w-12 h-12 text-[var(--faded-text-color)] mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4.5-4.5 3 3 4.5-4.5L16 15z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-[var(--faded-text-color)]">
            Drag and drop or
            <button class="text-[var(--primary)] hover:text-[var(--primary-shade)] font-medium">Click to add image</button>
          </p>
        </div>
      </div>

      <!-- Background Section -->
      <div class="space-y-4">
  <h3 class="text-sm font-semibold text-[var(--text-color)]">Background</h3>
        
        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)] font-medium">Background color</label>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Custom
            </span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)] font-medium">Background image</label>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Custom
            </span>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        <button class="w-full flex items-center justify-center gap-2 py-2.5 text-[var(--faded-text-color)] text-sm font-medium hover:text-[var(--text-color)] transition-colors">
          <span class="text-lg">+</span>
          Add
        </button>

        <button class="w-full text-center text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors py-2">
          Reset to theme defaults
        </button>
      </div>

      <!-- Joining Instructions Section -->
      <div class="space-y-4">
  <h3 class="text-sm font-semibold text-[var(--text-color)]">Joining instructions</h3>

        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)]">Show instructions bar</label>
          <button 
            @click="toggleInstructions"
            :class="showInstructions ? 'bg-[var(--primary)]' : 'bg-[var(--faded-bg-color)]'"
            class="relative w-12 h-6 rounded-full transition-colors"
          >
            <span 
              :class="showInstructions ? 'translate-x-6' : 'translate-x-1'"
              class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <label class="text-sm text-[var(--faded-text-color)]">Show QR code</label>
            <svg class="w-4 h-4 text-[var(--faded-text-color)] cursor-help" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <button 
            @click="toggleQRCode"
            :class="showQRCode ? 'bg-[var(--primary)]' : 'bg-[var(--faded-bg-color)]'"
            class="relative w-12 h-6 rounded-full transition-colors"
          >
            <span 
              :class="showQRCode ? 'translate-x-6' : 'translate-x-1'"
              class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
const showInstructions = ref(true)
const showQRCode = ref(false)

const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value
}

const toggleQRCode = () => {
  showQRCode.value = !showQRCode.value
}
</script>

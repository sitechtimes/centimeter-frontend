<template>
  <div class="flex flex-col gap-4 p-4">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="w-32 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center rounded-lg shadow"
    >
      <p class="text-sm font-bold text-gray-800">{{ slide.type }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = ref<{ type: string }[]>([])

function addSlide(slideType: string) {
  slides.value.push({ type: slideType })
}

defineExpose({
  addSlide,
})
</script>

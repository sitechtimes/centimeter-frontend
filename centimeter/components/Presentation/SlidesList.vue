<template>
  <!-- allow this list to size naturally for centering; keep internal scrolling when needed -->
  <div class="flex flex-col items-center gap-3 p-4 overflow-y-auto h-auto max-h-[90vh] min-h-0">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="w-40 h-24 bg-white border border-gray-300 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative slide-item"
      :class="{ 'border-blue-500': selectedSlide === index }"
      @click="selectSlide(index)"
    >
      <div class="text-center p-2">
        <p class="text-xs font-semibold text-gray-700 truncate w-full">{{ slide.type }}</p>
        <span class="text-xs text-gray-500 absolute bottom-1 right-2">{{ index + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'

interface Slide {
  type: string
}

const slides = ref<Slide[]>([])
const selectedSlide = ref<number | null>(null)

const emit = defineEmits<{
  'select-slide': [slideIndex: number, slide: Slide]
}>()

function addSlide(slideType: string) {
  slides.value.push({ type: slideType })
  selectedSlide.value = slides.value.length - 1
}

function selectSlide(index: number) {
  selectedSlide.value = index
  // notify parent about selected slide
  emit('select-slide', index, slides.value[index])
}

defineExpose({
  addSlide
})
</script>

<style scoped>
.slide-item {
  aspect-ratio: 4/3;
}

.slide-item:hover {
  transform: translateY(-1px);
}
</style>
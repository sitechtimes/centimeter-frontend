<template>
  <div class="flex flex-col">
    <NewSlides @add-slide="handleAddSlide" />
    <SlidesList ref="slidesListRef" @select-slide="forwardSelect" @slide-count-changed="forwardSlideCount" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Slide } from '@/utils/types'
import NewSlides from './NewSlides.vue'
import SlidesList from './SlidesList.vue'

const slidesListRef = ref<InstanceType<typeof SlidesList> | null>(null)

const emit = defineEmits<{
  'select-slide': [slideIndex: number, slide: Slide | undefined]
  'slide-count-changed': [count: number]
}>()

function handleAddSlide(slideType: string) {
  if (slidesListRef.value) {
    slidesListRef.value.addSlide(slideType)
  }
}

function forwardSelect(index: number, slide: Slide | undefined) {
  emit('select-slide', index, slide)
}

function forwardSlideCount(count: number) {
  emit('slide-count-changed', count)
}
</script>
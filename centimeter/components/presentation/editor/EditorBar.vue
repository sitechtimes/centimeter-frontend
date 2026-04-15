<template>
  <div class="flex flex-col">
    <NewSlides @add-slide="handleAddSlide" />
    <SlidesList
      ref="slidesListRef"
      :slides="slides"
      @update:slides="forwardSlidesUpdate"
      @select-slide="forwardSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Slide } from '@/utils/types/presentationTypes'
import NewSlides from './NewSlides.vue'
import SlidesList from './SlidesList.vue'

defineProps<{
  slides?: Slide[]
}>()

const slidesListRef = ref<InstanceType<typeof SlidesList> | null>(null)

const emit = defineEmits<{
  'select-slide': [slideIndex: number, slide: any]
  'update:slides': [slides: Slide[]]
}>()

function handleAddSlide(slideType: string) {
  if (slidesListRef.value) {
    slidesListRef.value.addSlide(slideType)
  }
}

function forwardSelect(index: number, slide: any) {
  emit('select-slide', index, slide)
}

function forwardSlidesUpdate(updatedSlides: Slide[]) {
  emit('update:slides', updatedSlides)
}

function getSlides() {
  return slidesListRef.value?.getSlides?.() || []
}

function setSlides(nextSlides: Slide[]) {
  slidesListRef.value?.setSlides?.(nextSlides)
}

defineExpose({ getSlides, setSlides })
</script>
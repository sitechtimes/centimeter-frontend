<template>
  <div class="flex flex-col">
    <NewSlides @add-slide="handleAddSlide" />
    <SlidesList ref="slidesListRef" @select-slide="forwardSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NewSlides from './NewSlides.vue'
import SlidesList from './SlidesList.vue'

const slidesListRef = ref<InstanceType<typeof SlidesList> | null>(null)

const emit = defineEmits<{
  'select-slide': [slideIndex: number, slide: any]
}>()

function handleAddSlide(slideType: string) {
  if (slidesListRef.value) {
    slidesListRef.value.addSlide(slideType)
  }
}

function forwardSelect(index: number, slide: any) {
  emit('select-slide', index, slide)
}

function getSlides() {
  return slidesListRef.value?.slides || []
}

defineExpose({ getSlides })
</script>
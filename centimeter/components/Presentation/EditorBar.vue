<template>
  <div class="flex flex-col">
    <NewSlides @add-slide="handleAddSlide" />
    <SlidesList ref="slidesListRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NewSlides from './NewSlides.vue'
import SlidesList from './SlidesList.vue'

const slidesListRef = ref<InstanceType<typeof SlidesList> | null>(null)

function handleAddSlide(slideType: string) {
  if (slidesListRef.value) {
    slidesListRef.value.addSlide(slideType)
  }
}
</script>
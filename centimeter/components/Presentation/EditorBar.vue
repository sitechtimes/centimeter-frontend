<template>
  <div class="flex flex-col">
    <NewSlides @open-modal="" />
    <SlidesList />
  </div>
</template>

<script setup lang="ts">
import NewSlides from './NewSlides.vue'
import SlidesList from './SlidesList.vue'
</script>

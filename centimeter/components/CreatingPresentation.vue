<template>
  <div class="flex flex-col gap-8">
    <div class="bg-[color:var(--bg-color)]">
      <NewSlides />
      <div class="fixed right-0 overflow-y-auto">
        <SideBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SlidesDropdown, MakePresentationSideBar } from '../src/utils/types.ts'
import NewSlides from './Presentation/NewSlides.vue'
import SideBar from './Presentation/SideBar.vue'
import PresentationModal from './Presentation/PresentationModal.vue'
const clickedSidebar = ref<string[]>([])
const showModal = ref(true)
const toggleModal = () => {
  showModal.value = !showModal.value
}
</script>

<style scoped></style>

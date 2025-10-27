<template>
  <div>
    <main class="bg-[color:var(--bg-color)]">
      <div class="fixed right-0 overflow-y-auto">
        <SideBar />
        <!-- <div v-for="component in RightSBComponent" :key="component.name" class="">
          <button
            @click="toggleOwnComponent(component.name)"
            class="no-underline color-[color:var(--text-color)] font-bold px-4 py-2 text-[color:var(--text-color)] rounded hover:bg-[color:var(--primary-light)] transition border-2 border-[color:var(--bg-color-contrast)] w-30 m-2 p-6"
          >
            {{ component.name }}
          </button>
        </div> -->
      </div>

      <NewSlides />

      <!-- Almost there read the tailwind layout position -->
      <div
        class="aspect-video border-2 border-[color:var(--text-color)] flex justify-center h-fit w-screen ml-40 mr-40"
      >
        <div class="relative text-[color:var(--bg-color-contrast)]">Presentation</div>
        <PresentationModal v-if="showModal" />
        <div class="fixed right-20 w-35 overflow-y-auto" v-if="clickedSidebar.length > 0">
          <div
            v-if="clickedSidebar.length > 0"
            class="border-2 border-[color:var(--bg-color-contrast)] m-2 p-6 text-[color:var(--text-color)]"
          >
            {{ clickedSidebar[0] }}
          </div>
        </div>
      </div>
    </main>
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

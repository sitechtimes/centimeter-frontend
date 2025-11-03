<template>
  <main class="h-screen overflow-hidden">
    <NavBar/>
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <NewSlides @open-modal="openModal" />
        <div class="fixed right-0 p-4">
          <SideBar />
        </div>


        <div class="flex-1 ml-32 flex flex-col items-center justify-center">
        </div>
      </div>


      <PresentationModal
        v-if="showModal"
        :isVisible="showModal"
        :selectedOption="selectedOption"
        @close="closeModal"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../../components/Presentation/CreatePresentationNavBar.vue'
import NewSlides from '../../components/Presentation/NewSlides.vue'
import SideBar from '../../components/Presentation/SideBar.vue'
import PresentationModal from '../../components/Presentation/PresentationModal.vue'

const showModal = ref(false)
const selectedOption = ref('')

function openModal(option: string) {
  selectedOption.value = option
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}
</script>

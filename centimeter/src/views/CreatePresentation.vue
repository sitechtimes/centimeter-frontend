<template>
  <main class="h-screen overflow-hidden">
    <NavBar/>
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <!-- give EditorBar a fixed width and prevent it from growing -->
        <EditorBar class="w-56 flex-none" />
        <!-- let the canvas fill the remaining space -->
        <PresentationCanvas class="flex-1"/>
        <EditPanel v-if="ToggleEdit"/>
        <SideBar class="w-72 flex-shrink-0" />
      </div>

      <!-- <PresentationModal
      v-if="showModal"
      :isVisible="showModal"
      :selectedOption="selectedOption"
      @close="closeModal"
      /> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../../components/Presentation/CreatePresentationNavBar.vue'
import NewSlides from '../../components/Presentation/NewSlides.vue'
import SideBar from '../../components/Presentation/SideBar.vue'
import PresentationModal from '../../components/Presentation/PresentationModal.vue'
import EditorBar from '../../components/Presentation/EditorBar.vue'
import PresentationCanvas from '../../components/Presentation/PresentationCanvas.vue'
import EditPanel from '../../components/Presentation/EditPanel.vue'
const showModal = ref(false)
const selectedOption = ref('')
const ToggleEdit = ref(false)

function openModal(option: string) {
  selectedOption.value = option
  showModal.value = true
}

function openEdit(){

}

function closeModal() {
  showModal.value = false
}
</script>

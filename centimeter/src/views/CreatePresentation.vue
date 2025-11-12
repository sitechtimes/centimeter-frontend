<template>
  <main class="h-screen overflow-hidden">
    <NavBar />
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <EditorBar class="w-48 flex-none" />
        <PresentationCanvas class="flex-1 min-w-0" />
        <EditPanel v-if="showEditPanel" class="w-80 flex-none" @close="showEditPanel = false" />
        <CommentsPanel
          v-if="showCommentsPanel"
          class="w-80 flex-none"
          @close="showCommentsPanel = false"
        />
        <InteractivityPanel
          v-if="showInteractivityPanel"
          class="w-80 flex-none"
          @close="showInteractivityPanel = false"
        />
        <ThemesPanel
          v-if="showThemesPanel"
          class="w-80 flex-none"
          @close="showThemesPanel = false"
        />
        <TemplatesPanel
          v-if="showTemplatesPanel"
          class="w-80 flex-none"
          @close="showTemplatesPanel = false"
        />
        <SideBar class="w-72 flex-shrink-0" @open-edit-panel="toggleEditPanel" />
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
const showEditPanel = ref(false)
const showCommentsPanel = ref(false)
const showInteractivityPanel = ref(false)
const showThemesPanel = ref(false)
const showTemplatesPanel = ref(false)

function toggleEditPanel() {
  showEditPanel.value = !showEditPanel.value
}

function openModal(option: string) {
  selectedOption.value = option
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}
</script>

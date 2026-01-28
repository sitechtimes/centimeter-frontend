<template>
  <main class="h-screen w-screen overflow-hidden">
    <NavBar />
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <EditorBar class="w-48 flex-none" @select-slide="handleSlideSelect" />
        <PresentationCanvas class="flex-1 min-w-0" />
        <EditPanel 
          v-if="showEditPanel" 
          class="w-80 flex-none" 
          :selectedSlide="currentSelectedSlide"
          @close="showEditPanel = false" 
        />
        <!-- Remember to turn these back -->
        <EditPanel
          v-if="showCommentsPanel"
          class="w-80 flex-none"
          @close="showCommentsPanel = false"
        />
        <EditPanel
          v-if="showInteractivityPanel"
          class="w-80 flex-none"
          @close="showInteractivityPanel = false"
        />
        <EditPanel
          v-if="showThemesPanel"
          class="w-80 flex-none"
          @close="showThemesPanel = false"
        />
        <EditPanel
          v-if="showTemplatesPanel"
          class="w-80 flex-none"
          @close="showTemplatesPanel = false"
        />
        <SideBar class="w-72 flex-shrink-0" @open-edit-panel="toggleEditPanel" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/Presentation/CreatePresentationNavBar.vue'
import SideBar from '../components/Presentation/SideBar.vue'
import EditorBar from '../components/Presentation/EditorBar.vue'
import PresentationCanvas from '../components/Presentation/PresentationCanvas.vue'
import EditPanel from '../components/Presentation/EditorPanels/EditPanel.vue'
import type { Slide } from '../utils/types'

const showEditPanel = ref(false)
const showCommentsPanel = ref(false)
const showInteractivityPanel = ref(false)
const showThemesPanel = ref(false)
const showTemplatesPanel = ref(false)


const currentSelectedSlide = ref<Slide | undefined>(undefined)

function toggleEditPanel() {
  showEditPanel.value = !showEditPanel.value
}

function handleSlideSelect(slideIndex: number, slide: Slide) {
  currentSelectedSlide.value = slide
  showEditPanel.value = true
}
</script>

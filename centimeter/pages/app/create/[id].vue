<template>
  <main class="h-screen w-screen overflow-hidden">
    <NavBar :slides="allSlides" />
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <EditorBar class="w-48 flex-none" @select-slide="handleSlideSelect" />
        <PresentationCanvas ref="canvasRef" class="flex-1 min-w-0" :currentSlide="currentSelectedSlide" />
        <EditPanel v-if="showEditPanel" class="w-80 flex-none" :selectedSlide="currentSelectedSlide" @close="showEditPanel = false" @add-component="handleAddComponent" />
        <CommentsPanel v-if="showCommentsPanel" class="w-80 flex-none" @close="showCommentsPanel = false" />
        <InteractivityPanel v-if="showInteractivityPanel" class="w-80 flex-none" @close="showInteractivityPanel = false" />
        <ThemesPanel v-if="showThemesPanel" class="w-80 flex-none" @close="showThemesPanel = false" />
        <TemplatesPanel v-if="showTemplatesPanel" class="w-80 flex-none" @close="showTemplatesPanel = false" />
        <SideBar class="w-72 flex-shrink-0" @open-edit-panel="toggleEditPanel" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import NavBar from "@/components/presentation/editor/CreatePresentationNavBar.vue";
import SideBar from "@/components/presentation/editor/SideBar.vue";
import EditorBar from "@/components/presentation/editor/EditorBar.vue";
import PresentationCanvas from "@/components/presentation/editor/PresentationCanvas.vue";
import EditPanel from "@/components/presentation/panels/EditPanel.vue";

const canvasRef = ref<InstanceType<typeof PresentationCanvas>>();
const showEditPanel = ref(false);
const showCommentsPanel = ref(false);
const showInteractivityPanel = ref(false);
const showThemesPanel = ref(false);
const showTemplatesPanel = ref(false);

const currentSelectedSlide = ref<Slide | undefined>(undefined);

function toggleEditPanel() {
  showEditPanel.value = !showEditPanel.value;
}

function handleSlideSelect(slideIndex: number, slide: Slide) {
  currentSelectedSlide.value = slide;
  showEditPanel.value = true;
}

function handleAddComponent(type: string) {
  canvasRef.value?.addComponent(type);
}
</script>

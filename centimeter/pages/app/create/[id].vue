<template>
  <main class="h-screen w-screen overflow-hidden">
    <NavBar :slides="allSlides" :initialTitle="presentationTitle" />
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <EditorBar ref="editorBarRef" class="w-48 flex-none" @select-slide="handleSlideSelect" />
        <PresentationCanvas ref="canvasRef" class="flex-1 min-w-0" :currentSlide="currentSelectedSlide" />
        <EditPanel v-if="showEditPanel" class="w-80 flex-none" :selectedSlide="currentSelectedSlide" @close="showEditPanel = false" @add-component="handleAddComponent" />
        <SideBar class="w-72 flex-shrink-0" @open-edit-panel="toggleEditPanel" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Slide } from "~/utils/types/presentationTypes";
import NavBar from "@/components/Presentation/editor/CreatePresentationNavBar.vue";
import SideBar from "@/components/Presentation/editor/SideBar.vue";
import EditorBar from "@/components/Presentation/editor/EditorBar.vue";
import PresentationCanvas from "@/components/Presentation/editor/PresentationCanvas.vue";
import EditPanel from "@/components/Presentation/panels/EditPanel.vue";

const canvasRef = ref<InstanceType<typeof PresentationCanvas>>();
const editorBarRef = ref<InstanceType<typeof EditorBar>>();
const showEditPanel = ref(false);
const currentSelectedSlide = ref<Slide | undefined>(undefined);
const presentationTitle = ref<string | undefined>(undefined);

const userStore = useUserStore();
const route = useRoute();

const allSlides = computed(() => {
  return editorBarRef.value?.getSlides() || [];
});

onMounted(async () => {
  const code = route.params.id as string;
  if (!code) return;
  try {
    const presentation = await userStore.getPresentation(code);
    if (presentation) {
      presentationTitle.value = presentation.title;
      editorBarRef.value?.setSlides(presentation.slides ?? []);
    }
  } catch (err) {
    console.error("Failed to load presentation:", err);
  }
});

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

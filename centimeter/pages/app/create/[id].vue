<template>
  <main class="h-screen w-screen overflow-hidden">
    <NavBar :slides="allSlides" :title="presentationTitle" @update:title="handleTitleUpdate" />
    <div class="flex flex-col gap-8 bg-[var(--bg-color)] h-full overflow-hidden">
      <div class="flex flex-1">
        <EditorBar
          ref="editorBarRef"
          class="w-48 flex-none"
          :slides="slides"
          @update:slides="handleSlidesUpdate"
          @select-slide="handleSlideSelect"
        />
        <PresentationCanvas ref="canvasRef" class="flex-1 min-w-0" :currentSlide="currentSelectedSlide" />
        <EditPanel v-if="showEditPanel" class="w-80 flex-none" :selectedSlide="currentSelectedSlide" :isOpen="showEditPanel" @close="showEditPanel = false" @add-component="handleAddComponent" />
        <SideBar class="w-72 flex-shrink-0" @open-edit-panel="toggleEditPanel" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import NavBar from "@/components/Presentation/editor/CreatePresentationNavBar.vue";
import SideBar from "@/components/Presentation/editor/SideBar.vue";
import EditorBar from "@/components/Presentation/editor/EditorBar.vue";
import PresentationCanvas from "@/components/Presentation/editor/PresentationCanvas.vue";
import EditPanel from "@/components/Presentation/panels/EditPanel.vue";

const route = useRoute()
const userStore = useUserStore()
const presentationStore = usePresentationStore()

const presentationCode = computed(() => route.params.id as string)
const canvasRef = ref<InstanceType<typeof PresentationCanvas>>();
const editorBarRef = ref<InstanceType<typeof EditorBar>>();
const showEditPanel = ref(false);
const slides = ref<Slide[]>([])
const presentationTitle = ref('Untitled Presentation')
const currentSelectedSlide = ref<Slide | undefined>(undefined);
const isHydrating = ref(true)
let saveTimer: ReturnType<typeof setTimeout> | null = null

const allSlides = computed(() => {
  return slides.value || [];
});

onMounted(async () => {
  await hydratePresentation()
})

onBeforeUnmount(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
})

function toggleEditPanel() {
  showEditPanel.value = !showEditPanel.value;
}

function handleSlideSelect(slideIndex: number, slide: Slide) {
  currentSelectedSlide.value = slide;
  showEditPanel.value = true;
}

function handleSlidesUpdate(updatedSlides: Slide[]) {
  slides.value = updatedSlides
  syncCurrentSelectedSlide()
}

function handleTitleUpdate(nextTitle: string) {
  presentationTitle.value = nextTitle
}

function handleAddComponent(type: string) {
  canvasRef.value?.addComponent(type);
}

function syncCurrentSelectedSlide() {
  if (!currentSelectedSlide.value?.id) {
    currentSelectedSlide.value = slides.value[0]
    return
  }

  const currentId = currentSelectedSlide.value.id
  const matched = slides.value.find((slide) => slide.id === currentId)
  currentSelectedSlide.value = matched || slides.value[0]
}

async function hydratePresentation() {
  isHydrating.value = true
  try {
    const presentation = await presentationStore.getPresentation(presentationCode.value)
    const dataSlides = Array.isArray(presentation?.data?.slides) ? presentation.data.slides : []
    slides.value = dataSlides

    const resolvedTitle = presentation?.title || presentation?.data?.title || 'Untitled Presentation'
    presentationTitle.value = resolvedTitle

    currentSelectedSlide.value = slides.value[0]
  } catch (error) {
    console.error('Failed to hydrate presentation:', error)
  } finally {
    isHydrating.value = false
  }
}

watch(
  [slides, presentationTitle],
  () => {
    if (isHydrating.value) return

    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      persistPresentation()
    }, 700)
  },
  { deep: true }
)

async function persistPresentation() {
  try {
    await userStore.savePresentation({
      presentation_code: presentationCode.value,
      title: presentationTitle.value,
      slides: slides.value,
    })
  } catch (error) {
    console.error('Failed to persist presentation:', error)
  }
}
</script>

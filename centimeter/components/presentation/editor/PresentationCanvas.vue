<template>
  <div :class="rootClass">
    <div v-if="!currentSlide" class="flex flex-col items-center justify-center h-full gap-6">
      <div class="text-center space-y-4">
        <svg class="w-32 h-32 mx-auto text-[var(--faded-text-color)] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div>
          <h2 class="text-2xl font-semibold text-[var(--text-color)]">No Slide Selected</h2>
          <p class="text-[var(--faded-text-color)] mt-2">Select a slide from the left panel or create a new one</p>
        </div>
      </div>
    </div>
    
    <div v-if="props.currentSlide?.type === 'Multiple Choice'" :class="contentClass">
      <MultipleChoiceSlides
        :slide="props.currentSlide"
        :presentationMode="isPresentationMode"
        :isHost="props.isHost"
        :isParticipant="props.isParticipant"
        :sessionJoinCode="props.sessionJoinCode"
        :nickname="props.nickname"
        :activePollId="props.activePollId"/>
    </div>

    <div v-else :class="contentClass">
      <div
        ref="canvasRef"
        role="region"
        aria-label="Presentation canvas"
        :style="canvasStyle"
        class="relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[var(--faded-bg-color)]"
        tabindex="0"
        @click="!isPresentationMode && (selectedId = null)"
        @keydown.delete="!isPresentationMode && deleteSelected()"
        @keydown.escape="!isPresentationMode && (selectedId = null)"
      >
        <component
          v-for="comp in components"
          :key="comp.id"
          :is="COMPONENT_MAP[comp.type]"
          :component="comp"
          :isSelected="!isPresentationMode && selectedId === comp.id"
          :canvasWidth="CANVAS_WIDTH"
          :canvasHeight="CANVAS_HEIGHT"
          :readOnly="isPresentationMode"
          @select="selectedId = comp.id"
          @update="(content: string) => (comp.content = content)"
          @move="(dx: number, dy: number) => moveComponent(comp, dx, dy)"
          @resize="(w: number, h: number) => resizeComponent(comp, w, h)"
        />
      </div>
      <button
        v-if="!isPresentationMode"
        @click="console.log({ type: 'slide', components, canvasSize: { w: CANVAS_WIDTH, h: CANVAS_HEIGHT } })"
        class="px-4 py-2 bg-[var(--faded-bg-color)] text-[var(--text-color)] hover:bg-[var(--faded-bg-color-dark)] rounded-lg transition-colors text-sm font-medium"
      >
        Console slide properties
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextComponent from "../SlideComponents/TextComponent.vue";
import MultipleChoiceSlides from "../SlidesOptions/MultipleChoiceSlides.vue";

const props = defineProps<{
  currentSlide?: Slide
  presentationMode?: boolean
  isHost?: boolean
  isParticipant?: boolean
  sessionJoinCode?: string
  nickname?: string
  activePollId?: number 
}>();

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const COMPONENT_MAP: Record<string, typeof TextComponent> = { text: TextComponent };

const canvasRef = ref<HTMLDivElement>();
const selectedId = ref<string | null>(null);
const componentCounter = ref<Record<string, number>>({ text: 0, image: 0, shape: 0 });

const isPresentationMode = computed(() => props.presentationMode === true)

const rootClass = computed(() => {
  return isPresentationMode.value
    ? "h-full w-full flex items-center justify-center bg-[var(--faded-bg-color-light)] p-2 overflow-hidden"
    : "h-screen flex items-start justify-center bg-[var(--faded-bg-color-light)] p-6 pt-12 overflow-auto"
})

const contentClass = computed(() => {
  return isPresentationMode.value ? "w-full h-full flex items-center justify-center" : "flex flex-col items-center gap-4"
})

const canvasStyle = computed(() => {
  if (isPresentationMode.value) {
    return {
      width: "min(96vw, calc((100vh - 120px) * 1.5))",
      aspectRatio: "3 / 2",
      height: "auto",
    }
  }
  return { width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }
});

const components = computed(() => {
  return props.currentSlide?.components ?? [];
});

watch(
  () => props.currentSlide,
  (slide) => {
    if (slide && !slide.components) {
      slide.components = [];
    }
    selectedId.value = null;
  },
  { immediate: true }
);

const moveComponent = (comp: SlideComponent, dx: number, dy: number) => {
  comp.x = Math.max(0, Math.min(100 - comp.width, comp.x + dx));
  comp.y = Math.max(0, Math.min(100 - comp.height, comp.y + dy));
};

const resizeComponent = (comp: SlideComponent, w: number, h: number) => {
  comp.width = w;
  comp.height = h;
};

const deleteSelected = () => {
  if (!selectedId.value) return;
  if (!props.currentSlide?.components) return;
  props.currentSlide.components = props.currentSlide.components.filter((c: SlideComponent) => c.id !== selectedId.value);
  selectedId.value = null;
};

const addComponent = (type: string) => {
  if (!props.currentSlide?.components) {
    if (props.currentSlide) {
      props.currentSlide.components = [];
    } else {
      return;
    }
  }

  const offset = componentCounter.value[type] * 1;
  const newComponent: SlideComponent = {
    id: `${type}-${Date.now()}`,
    type,
    x: Math.min(10 + offset, 70),
    y: Math.min(10 + offset, 70),
    width: 30,
    height: 10,
    content: "Double click to edit",
    fontSize: 24,
    color: "#000",
    textAlign: "left",
    zIndex: props.currentSlide.components.length + 1
  };
  props.currentSlide.components.push(newComponent);
  selectedId.value = newComponent.id;
  componentCounter.value[type] = (componentCounter.value[type] + 1) % 21;
};

defineExpose({ addComponent });
onMounted(() => canvasRef.value?.focus());
</script>

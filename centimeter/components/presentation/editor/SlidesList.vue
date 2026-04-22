<template>
  <div class="relative">
    <div class="flex flex-col items-center gap-3 p-4 overflow-y-auto h-auto max-h-[90vh] min-h-0 slide-list-container">
      <div
        v-for="(slide, index) in slides"
        class="w-40 h-24 bg-[var(--bg-color)] border border-[var(--faded-bg-color)] flex items-center justify-center rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative slide-item"
        :class="{
          'border-blue-500 border-2': selectedSlide === index,
          'opacity-30 scale-105': dragIndex === index,
          'border-[var(--secondary)] translate-x-2': dragOverIndex === index && dragIndex !== null && dragIndex < index,
          'border-[var(--secondary)] -translate-x-2': dragOverIndex === index && dragIndex !== null && dragIndex > index
        }"
        @click="selectSlide(index)"
        @contextmenu.prevent="onContextMenu(index, $event)"
        draggable="true"
        @dragstart="onDragStart(index, $event)"
        @dragenter.prevent="onDragEnter(index)"
        @dragleave="onDragLeave(index)"
        @dragover.prevent="onDragOver(index, $event)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
      >
        <div class="text-center p-2">
          <p class="text-xs font-semibold text-[var(--text-color)] truncate w-full">{{ slide.type }}</p>
          <span class="text-xs text-[var(--faded-text-color)] absolute bottom-1 right-2">{{ index + 1 }}</span>
        </div>

        <div class="absolute top-1 left-1 opacity-30 hover:opacity-70 transition-opacity pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />
          </svg>
        </div>
      </div>

      <div v-if="slides.length === 0" class="w-40 h-24 flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--faded-bg-color)] text-[var(--faded-text-color)]">
        <p class="text-xs text-center">No slides<br />Add a slide to start</p>
      </div>
    </div>

    <RightClickDropDown v-if="contextVisible" :x="contextX" :y="contextY" :slideIndex="contextIndex" @delete="handleDelete" @close="closeContext" />
  </div>
</template>

<script setup lang="ts">
import type { Slide } from "@/utils/types/presentationTypes";
import RightClickDropDown from "./RightClickDropDown.vue";

const props = defineProps<{
  slides?: Slide[];
}>();

const slides = ref<Slide[]>([]);
const selectedSlide = ref<number | null>(null);

const contextVisible = ref(false);
const contextX = ref(0);
const contextY = ref(0);
const contextIndex = ref<number>();
const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);
const dragging = ref(false);

const emit = defineEmits<{
  "select-slide": [slideIndex: number, slide: Slide];
  "update:slides": [slides: Slide[]];
}>();

function cloneSlides(input: Slide[] = []): Slide[] {
  return input.map((slide) => ({ ...slide }));
}

function areSlidesEqual(a: Slide[], b: Slide[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

watch(
  () => props.slides,
  (incoming) => {
    const normalized = cloneSlides(incoming || []);
    if (!areSlidesEqual(normalized, slides.value)) {
      slides.value = normalized;
    }

    if (slides.value.length === 0) {
      selectedSlide.value = null;
      return;
    }

    if (selectedSlide.value === null || selectedSlide.value >= slides.value.length) {
      selectedSlide.value = 0;
      emit("select-slide", 0, slides.value[0]);
    }
  },
  { immediate: true, deep: true }
);

watch(
  slides,
  (value) => {
    emit("update:slides", cloneSlides(value));
  },
  { deep: true }
);

function onContextMenu(index: number, event: MouseEvent) {
  if (dragging.value) return;

  contextIndex.value = index;
  contextX.value = event.clientX;
  contextY.value = event.clientY;
  contextVisible.value = true;
  selectSlide(index);
}

function onDragStart(index: number, event: DragEvent) {
  dragIndex.value = index;
  dragging.value = true;
  dragOverIndex.value = null;
  closeContext();

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    try {
      event.dataTransfer.setData("text/plain", String(index));
    } catch (e) {}
  }
}

function onDragEnter(index: number) {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    dragOverIndex.value = index;
  }
}

function onDragLeave(index: number) {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null;
  }
}

function onDragOver(index: number, event: DragEvent) {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    dragOverIndex.value = index;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }
}

function onDrop(index: number) {
  const from = dragIndex.value;
  const to = index;

  if (from === null || from === to) {
    resetDragState();
    return;
  }

  const newSlides = [...slides.value];
  const [movedItem] = newSlides.splice(from, 1);
  newSlides.splice(to, 0, movedItem);
  slides.value = newSlides;

  updateSelectionAfterReorder(from, to);

  resetDragState();
}

function onDragEnd() {
  resetDragState();
}

function resetDragState() {
  dragIndex.value = null;
  dragOverIndex.value = null;
  dragging.value = false;
}

function updateSelectionAfterReorder(from: number, to: number) {
  if (selectedSlide.value === null) return;

  const prev = selectedSlide.value;
  if (prev === from) {
    selectedSlide.value = to;
  } else if (from < to && prev > from && prev <= to) {
    selectedSlide.value = prev - 1;
  } else if (from > to && prev >= to && prev < from) {
    selectedSlide.value = prev + 1;
  }

  emit("select-slide", selectedSlide.value, slides.value[selectedSlide.value]);
}

function closeContext() {
  contextVisible.value = false;
  contextIndex.value = undefined;
}

function handleDelete(index?: number | null) {
  if (index == null) return closeContext();

  slides.value.splice(index, 1);

  if (slides.value.length === 0) {
    selectedSlide.value = null;
    emit("select-slide", -1, undefined as any);
  } else {
    const newIndex = Math.max(0, Math.min(index, slides.value.length - 1));
    selectedSlide.value = newIndex;
    emit("select-slide", newIndex, slides.value[newIndex]);
  }

  closeContext();
}

const newTextSlide = (newSlide: Slide) => {
  newSlide.components = [];
};

const newMultipleChoiceSlide = (newSlide: Slide) => {
  newSlide.question = "Ask your question here...";

  const polls = (newSlide.pollsComponents ??= { options: [] } as any);

  polls.options = [
    { color: "#27F5EB", option_text: "Option 1", position: 1, amount_chosen: 0 },
    { color: "#F54927", option_text: "Option 2", position: 2, amount_chosen: 0 },
    { color: "#000000", option_text: "Option 3", position: 3, amount_chosen: 0 }
  ];

  newSlide.pollsComponents!.options = polls.options
};

function generateUUID(): string {
  // Prefer native randomUUID when available.
  const c = (globalThis as any).crypto as Crypto | undefined;
  if (c && typeof (c as any).randomUUID === "function") {
    return (c as any).randomUUID();
  }

  // Fallback to getRandomValues-based UUID v4.
  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);

    // Per RFC 4122 §4.4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Last-resort fallback (not cryptographically strong, but prevents crashes).
  return `uuid-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

function addSlide(slideType: string) {
  const newSlide: Slide = { type: slideType };
  if (slideType === "Text") {
    newTextSlide(newSlide);
  } else if (slideType === "Multiple Choice") {
    newMultipleChoiceSlide(newSlide);
  }
  if (!newSlide.id) {
    newSlide.id = generateUUID();
  }
  slides.value.push(newSlide);
  selectedSlide.value = slides.value.length - 1;
  emit("select-slide", selectedSlide.value, slides.value[selectedSlide.value]);
}

function setSlides(nextSlides: Slide[]) {
  slides.value = [...nextSlides];
  if (slides.value.length > 0) {
    selectedSlide.value = 0;
    emit("select-slide", 0, slides.value[0]);
  } else {
    selectedSlide.value = null;
    emit("select-slide", -1, undefined as any);
  }
}

function selectSlide(index: number) {
  selectedSlide.value = index;
  slides.value.forEach((slide) => {
    slide.on_slide = false;
  });
  slides.value[index].on_slide = true;
  emit("select-slide", index, slides.value[index]);
}

function getSlides() {
  return slides.value;
}

onMounted(() => {
  window.addEventListener("click", closeContext);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeContext();
  });
});

onUnmounted(() => {
  window.removeEventListener("click", closeContext);
});

defineExpose({
  addSlide,
  setSlides,
  getSlides,
  slides
});
</script>

<style scoped>
.slide-list-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.slide-list-container::-webkit-scrollbar {
  width: 6px;
}

.slide-list-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.slide-list-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.slide-list-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.slide-item {
  aspect-ratio: 4/3;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
</style>

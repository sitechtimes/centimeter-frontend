<template>
  <div :class="rootClass">
    <div
      ref="canvasRef"
      role="region"
      aria-label="Multiple choice slide canvas"
      :style="canvasStyle"
      class="relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[var(--faded-bg-color)] overflow-hidden"
      :class="{ 'hover:border-[var(--bg-color-contrast)] transition-colors': !isPresentationMode }"
    >
      <div class="h-full w-full flex flex-col px-8 py-6 gap-6">
        <input
          v-if="!isPresentationMode"
          id="MultipleChoiceQuestion"
          type="text"
          @click="clearQuestion"
          @blur="restoreQuestionDefault"
          v-model="props.slide!.question"
          class="w-full bg-transparent text-3xl font-semibold text-[var(--text-color)] border-b border-[var(--faded-bg-color)] pb-3 outline-none"
          :class="isPresentationMode ? 'cursor-pointer pointer-events-none select-none' : ''"
        >

        <div class="flex-1 min-h-0" :class="chartLayoutClass">
          <div v-if="!isPresentationMode" :class="chartShellClass">
            <GraphComponent :options="props.slide?.options" />
          </div>

          <div :class="optionsLayoutClass">
            <div
              v-for="choice in props.slide?.options"
              :key="choice.position"
              class="flex items-center gap-2 bg-[var(--bg-color)] rounded border border-[var(--faded-bg-color)] min-w-0"
              :class="[choiceClass, isPresentationMode ? 'cursor-pointer' : '']"
              @click="isPresentationMode ? chooseChoice(choice) : undefined"
            >
              <input
                type="text"
                @click="clearOptionText(choice)"
                @blur="restoreOptionDefault(choice)"
                v-model="choice.option_text"
                :readonly="isPresentationMode"
                :class="[
                  'w-full min-w-0 truncate bg-transparent outline-none',
                  fontSize,
                  isPresentationMode ? 'cursor-pointer select-none' : ''
                ]"
              >
              <button
                v-if="!isPresentationMode"
                @click="removeOption(choice)"
                class="text-[var(--danger)] flex-shrink-0"
              >
                X
              </button>
            </div>

            <button
              v-if="!isPresentationMode"
              @click="addOption"
              class="bg-[var(--primary)] text-[var(--text-color-contrast)] rounded flex-shrink-0 flex items-center justify-center hover:bg-[var(--primary-shade)] transition-colors"
              :class="addButtonClass"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GraphComponent from '../SlideComponents/GraphComponent.vue'

const props = defineProps<{
  slide?: Slide
  presentationMode?: boolean
  limitChoices?: LimitPollsChoices
}>();

const defaultQuestion = "Ask your question here..."
const canvasRef = ref<HTMLDivElement>();
const defaultChoiceAmount = 1  

function clearQuestion() {
  if (isPresentationMode.value) return
  if (props.slide!.question === defaultQuestion) {
    props.slide!.question = '';
  }
}

function restoreQuestionDefault() {
  if (!props.slide?.question) props.slide!.question = defaultQuestion
}

function clearOptionText(choice: PollsOption) {
  if (isPresentationMode.value) return
  if (choice.option_text === `Option ${choice.position}`) {
    choice.option_text = '';
  }
}

function restoreOptionDefault(choice: PollsOption) {
  if (!choice.option_text) choice.option_text = `Option ${choice.position}`
}

const generateHex = (): string => {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
};

function addOption() {
  if (isPresentationMode.value) return
  if (!props.slide!.options) props.slide!.options = [];
  const position = props.slide!.options.length + 1;
  props.slide!.options.push({
    color: generateHex(),
    option_text: `Option ${position}`,
    position,
    amount_chosen: 0
  });
}

function removeOption(choice: PollsOption) {
  if (isPresentationMode.value) return
  if (props.slide!.options) {
    const index = props.slide!.options.indexOf(choice);
    if (index > -1) {
      props.slide!.options.splice(index, 1);
      props.slide!.options.forEach((opt, i) => opt.position = i + 1);
    }
  }
}

function chooseChoice(choice: PollsOption) { choice.amount_chosen += 1; console.log("bang")}

const CANVAS_WIDTH = 1200,
  CANVAS_HEIGHT = 800;
const isPresentationMode = computed(() => props.presentationMode === true)

const rootClass = computed(() => {
  return isPresentationMode.value
    ? 'w-full h-full flex items-center justify-center'
    : 'flex-1 flex items-center justify-center p-4 bg-[var(--bg-color)]'
})

const canvasStyle = computed(() => {
  if (isPresentationMode.value) {
    return {
      width: 'min(96vw, calc((100vh - 120px) * 1.5))',
      aspectRatio: '3 / 2',
      height: 'auto',
    }
  }

  return { width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }
});

const chartLayoutClass = computed(() => {
  return chartType.value === 'bar'
    ? 'grid h-full grid-rows-[1.4fr_1fr] gap-4'
    : 'grid h-full grid-cols-[1.1fr_1fr] gap-4 items-center'
})

const chartShellClass = computed(() => {
  return chartType.value === 'bar'
    ? 'min-h-0 rounded-lg border border-[var(--faded-bg-color)] p-2'
    : 'min-h-0 h-full rounded-lg border border-[var(--faded-bg-color)] p-2'
})

const optionsLayoutClass = computed(() => {
  return chartType.value === 'bar'
    ? 'min-h-0 flex flex-wrap items-stretch gap-3 overflow-y-auto pr-1'
    : 'min-h-0 flex flex-col gap-2 overflow-y-auto pr-1'
})

const choiceClass = computed(() => {
  return chartType.value === 'bar' ? 'px-3 py-2 h-12 flex-1' : 'px-3 py-2'
})

const addButtonClass = computed(() => {
  return chartType.value === 'bar' ? 'px-4 py-2 h-12' : 'px-3 py-2'
})

const fontSize = computed(() => {
  const count = props.slide?.options?.length ?? 1;
  if (count <= 4) return 'text-base';
  if (count <= 6) return 'text-sm';
  return 'text-xs';
});
</script>

<style scoped>

</style>
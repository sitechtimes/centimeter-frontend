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
        >
        <p v-else class="w-full text-3xl font-semibold text-[var(--text-color)] border-b border-[var(--faded-bg-color)] pb-3">
          {{ props.slide?.question }}
        </p>

        <div class="flex-1 min-h-0" :class="chartLayoutClass">
          <div v-if="isPresentationMode && (isHost || hasVoted)" :class="chartShellClass">
            <GraphComponent :options="slideOptions" />
          </div>

          <div :class="optionsLayoutClass">
            <div
              v-for="choice in slideOptions"
              :key="choice.position"
              class="flex items-center gap-2 bg-[var(--bg-color)] rounded border border-[var(--faded-bg-color)] min-w-0"
              :class="[choiceClass, choice.chosen && isPresentationMode ? 'bg-[var(--primary-shade-translucent)] border-[var(--primary)] cursor-pointer' : '',
              isPresentationMode && hasVoted && !choice.chosen? 'opacity-50': '',]"
              @click="isPresentationMode && !hasVoted ? chooseChoice(choice) : null"
            >

              <span
                v-if="isPresentationMode"
                class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                :style="{ backgroundColor: choice.color, color: '#fff' }"
              >
                {{ choice.position }}
              </span>

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

              <span
                v-if="isPresentationMode && isHost"
                class="flex-shrink-0 text-xs text-[var(--text-color)] opacity-60 font-mono"
              >
                {{ choice.amount_chosen ?? 0 }}
              </span>

              <button
                v-if="!isPresentationMode"
                @click="removeOption(choice)"
                class="text-[var(--danger)] flex-shrink-0"
              >
                X
              </button>
            </div>

            <div
              v-if="isPresentationMode && hasVoted"
              class="mt-2 text-sm text-[var(--primary)] font-semibold"
            >
              ✓ Vote submitted
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
import { User } from 'lucide-vue-next';
import GraphComponent from '../SlideComponents/GraphComponent.vue'
import { useResponsesStore } from '~/stores/responesStore';
import { sessionJoinCode } from '~/utils/slides';
import { chartType } from '~/utils/slides'

const props = defineProps<{
  slide?: Slide
  presentationMode?: boolean
  isHost?: boolean
  isParticipant?: boolean
  sessionJoinCode?: string
  nickname?: string
  activePollId?: number
}>();

const defaultQuestion = "Ask your question here..."
const canvasRef = ref<HTMLDivElement>();
const slideOptions = computed(() => props.slide?.pollsComponents?.options ?? [])
const isHost = computed(() => props.isHost === true)
const responseStore = useResponsesStore()
const pollsStore = usePollsStore()
const hasVoted = ref(false)
const isSubmitting = ref(false)

watch(() => props.slide?.id, () => {
  hasVoted.value = false
  isSubmitting.value = false
  slideOptions.value.forEach(opt => opt.chosen = false)
})

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
  if (isPresentationMode.value || !props.slide) return
  if (!props.slide.pollsComponents) (props.slide as any).pollsComponents = { options: [] }
  if (!props.slide.pollsComponents!.options) (props.slide.pollsComponents as any).options = []
 
  const opts = props.slide!.pollsComponents!.options
  const position = opts.length + 1
  opts.push({ color: generateHex(), option_text: `Option ${position}`, position, amount_chosen: 0, chosen: false })
}

function removeOption(choice: PollsOption) {
  if (isPresentationMode.value) return
  const opts = props.slide!.pollsComponents?.options
  if (!opts) return
  const index = opts.indexOf(choice)
  if (index > -1) {
    opts.splice(index, 1)
    opts.forEach((opt, i) => (opt.position = i + 1))
  }
}

async function chooseChoice(choice: PollsOption) {
  if (!isPresentationMode.value) return
  if (hasVoted.value || isSubmitting.value) return
  if (!props.slide?.id || !props.sessionJoinCode || !props.nickname) {
    console.warn('[MultipleChoiceSlide] Missing slide id, join code, or nickname — cannot vote.')
    return
  }
 
  const responseLimit = props.slide.responseLimit ?? 1
 
  if (responseLimit === 1) {
    isSubmitting.value = true
 
    choice.chosen = true
    choice.amount_chosen = (choice.amount_chosen ?? 0) + 1
 
    try {
      await responseStore.votePolls(
        props.activePollId!,
        props.sessionJoinCode,
        props.nickname,
        choice.backendId!,
      )
      hasVoted.value = true
    } catch (err) {
      choice.chosen = false
      choice.amount_chosen = Math.max(0, (choice.amount_chosen ?? 1) - 1)
      console.error('[MultipleChoiceSlide] Vote failed:', err)
    } finally {
      isSubmitting.value = false
    }
 
  } else {
    const currentlyChosen = slideOptions.value.filter(o => o.chosen)
 
    if (choice.chosen) {
      choice.chosen = false
      choice.amount_chosen = Math.max(0, (choice.amount_chosen ?? 1) - 1)
    } else if (currentlyChosen.length < responseLimit) {
      choice.chosen = true
      choice.amount_chosen = (choice.amount_chosen ?? 0) + 1
 
      if (currentlyChosen.length + 1 === responseLimit) {
        isSubmitting.value = true
        const chosenIds = slideOptions.value.filter(o => o.chosen).map(o => o.position!)
        try {
          await responseStore.voteMultiSelect(
            props.activePollId!,
            props.sessionJoinCode,
            props.nickname,
            chosenIds
          )
          hasVoted.value = true
        } catch (err) {
          slideOptions.value.forEach(o => {
            if (o.chosen) {
              o.chosen = false
              o.amount_chosen = Math.max(0, (o.amount_chosen ?? 1) - 1)
            }
          })
          console.error('[MultipleChoiceSlide] Multi-select vote failed:', err)
        } finally {
          isSubmitting.value = false
        }
      }
    }
  }
  console.log(await pollsStore.fetchPollsData(String(props.activePollId!)))
}

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
  const count = props.slide?.pollsComponents?.options.length ?? 1;
  if (count <= 4) return 'text-base';
  if (count <= 6) return 'text-sm';
  return 'text-xs';
});
</script>

<style scoped>

</style>
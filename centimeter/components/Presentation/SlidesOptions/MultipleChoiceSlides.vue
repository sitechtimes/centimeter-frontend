<template>
    <div class="flex-1 flex items-center justify-center p-4 bg-[var(--bg-color)] ">
        <div
            ref="canvasRef"
            role="region"
            aria-label="Presentation canvas"
            :style="canvasStyle"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden p-10 hover:border-slate-800 transition-shadow cursor-pointer"
        >
            <input 
                id="MultipleChoiceQuestion" 
                type="text" 
                @click="clearQuestion" 
                @blur="() => { if (!props.slide!.question) props.slide!.question = defaultQuestion }"
                v-model="props.slide!.question" 
                class="flex-shrink-0 p-4 text-lg border-b border-gray-200"
                >
        <div :class="['flex gap-4 h-[60%] p-10 border-2 border-transparent items-center justify-center mt-12', chartType === 'bar' ? 'flex-col' : 'flex-row']"> 
            <div :class="['flex items-center gap-4', chartType === 'bar' ? 'flex-col' : 'flex-row']">
                <GraphComponent :options="props.slide?.options" />
                <div :class="['flex', chartType === 'bar' ? 'gap-4 flex-row' : 'gap-1 flex-col']">
                    <div v-for="choice in props.slide?.options"
                        :class="['flex items-center gap-2 bg-white rounded border border-gray-200 hover:border-slate-800 transition-colors min-w-0', chartType === 'bar' ? 'p-3 flex-1 h-[50px]': 'p-1 px-2 h-auto']"
                        >
                        <input 
                            type="text" 
                            @click="clearOptionText(choice)" 
                            @blur="() => { if (!choice.option_text) choice.option_text = 'Option ' + choice.position }"
                            v-model="choice.option_text" 
                            :class="['w-full min-w-0 truncate border-transparent', fontSize]">
                        <button @click="removeOption(choice)" class="text-red-500 flex-shrink-0">X</button>
                    </div>
                    <button 
                        @click="addOption" 
                        :class="['bg-blue-500 text-white rounded flex-shrink-0 flex items-center justify-center', chartType === 'bar' ? 'p-3 h-[50px]' : 'p-1 px-2 h-auto']"
                    >+</button>
                </div>
                
            </div>
        </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import GraphComponent from '../SlideComponents/GraphComponent.vue'

const props = defineProps<{ slide?: Slide }>();

const defaultQuestion = "Ask your question here..."

const canvasRef = ref<HTMLDivElement>();

function clearQuestion() {
  if (props.slide!.question === defaultQuestion) {
    props.slide!.question = '';
  }
}

function clearOptionText(choice: PollsOption) {
  if (choice.option_text === `Option ${choice.position}`) {
    choice.option_text = '';
  }
}

const generateHex = (): string => {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
};

function addOption() {
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
  if (props.slide!.options) {
    const index = props.slide!.options.indexOf(choice);
    if (index > -1) {
      props.slide!.options.splice(index, 1);
      props.slide!.options.forEach((opt, i) => opt.position = i + 1);
    }
  }
}

const CANVAS_WIDTH = 1200,
  CANVAS_HEIGHT = 800;
const canvasStyle = computed(() => ({ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }));

const fontSize = computed(() => {
  const count = props.slide?.options?.length ?? 1;
  if (count <= 4) return 'text-base';
  if (count <= 6) return 'text-sm';
  return 'text-xs';
});
</script>

<style scoped>

</style>
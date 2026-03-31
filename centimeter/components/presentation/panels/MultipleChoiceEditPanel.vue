<template>
    <div class="w-full max-w-xs bg-[var(--bg-color)] rounded-lg shadow-sm h-full flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-[var(--text-color)]">Question</h2>
      <button
        class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]"
        @click="$emit('close')"
      >
        <X class="w-6 h-6"/>
      </button>
    </div>

    <button @click="addOption">Add Option</button>
    <div v-for="chart in chartButtons">
      <button @click="setChartType(chart)">{{ chart }}</button>
    </div>
    </div>

</template>

<script setup lang="ts">
import { BookPlus, X, ArrowDown, Plus } from 'lucide-vue-next'
import { useMultipleChoiceStore } from '~/stores/slidesStore'
defineProps<{ selectedSlide?: Slide }>()
defineEmits<{ 
  close: []
}>()

const defaultOptionName = computed(()=> <PollsOption>{
    color: "black",
    option_text: "option " + (useMultipleChoiceStore().options.length + 1),
    position: useMultipleChoiceStore().options.length + 1,
    amount_chosen: 0
}
)

const chartButtons = ['bar', 'doughnut', 'pie'] as const

const setChartType = (type: 'bar' | 'doughnut' | 'pie') => {
    useMultipleChoiceStore().chartType = type
}

const addOption = () =>{
    useMultipleChoiceStore().options.push(defaultOptionName.value)
}
</script>


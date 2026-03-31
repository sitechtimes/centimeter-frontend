<template>
    <div class="flex-1 flex items-center justify-center p-4 bg-[var(--bg-color)] ">
        <div
            role="region"
            aria-label="Presentation canvas"
            class="w-[96vw] max-w-[1400px] aspect-video bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden p-10 hover:border-slate-800 transition-shadow cursor-pointer"
        >
            <input id="MultipleChoiceQuestion" type="text" @click="changeText()" v-model="changedQuestion" class="flex-shrink-0 p-4 text-lg border-b border-gray-200 focus:outline-none focus:border-blue-500">
        <div class="flex flex-wrap gap-4 h-[60%] p-10 border-2 border-transparent"> 
            <div v-if="multipleChoiceStore.chartType === 'bar'">
                <Bar :data="multipleChoiceStore.chartData" />
            </div>
            <div v-if="multipleChoiceStore.chartType === 'doughnut'">
                <Doughnut :data="multipleChoiceStore.chartData" />
            </div>
            <div v-if="multipleChoiceStore.chartType === 'pie'">
                <Pie :data="multipleChoiceStore.chartData" />
            </div>
            <div v-for="choice in options" class="flex items-center gap-2 p-3 bg-white rounded border border-gray-200 hover:border-slate-800 transition-colors">
                <ol>{{ choice.position }}  {{ choice.option_text }}</ol>
            </div>

        </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { useMultipleChoiceStore } from '~/stores/slidesStore'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar, Doughnut, Pie } from 'vue-chartjs'
const multipleChoiceStore = useMultipleChoiceStore()

const options = computed(() => multipleChoiceStore.options)

const changedQuestion = ref("Ask your question here...")
const textEditPanel = computed(() => multipleChoiceStore.textEditPanel)
const optionEditPanel = computed(() => multipleChoiceStore.optionEditPanel)


const changeText = () => {
    if (changedQuestion.value === "Ask your question here...") {
        changedQuestion.value = ""
    } else if (changedQuestion.value === "") {
        changedQuestion.value = "Ask your question here..."
    }
    textEditPanel.value.open = true
}



</script>

<style scoped>

</style>
<template>
    <div class="w-full max-w-xs bg-[var(--bg-color)] rounded-lg shadow-sm h-full flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-[var(--faded-bg-color)]">
      <h2 class="text-lg font-semibold text-[var(--text-color)]">Edit</h2>
      <button
        class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]"
        @click="closeEditPanel"
      >
        <X class="w-6 h-6"/>
      </button>
    </div>

      <h2 class="flex items-center justify-center mt-6 text-[var(--text-color)]">Chart Types</h2>

    <div class="flex flex-wrap gap-3 mt-3 px-4 justify-center">
      <div
        v-for="chart in chartButtons"
        :key="chart"
        class="flex items-center justify-center w-[30px] min-w-[72px] rounded-2xl border px-3 py-3 transition-colors duration-200 cursor-pointer"
        :class="chartType === chart ? 'border-[var(--primary)] bg-[var(--primary-shade-translucent)]' : 'border-[var(--faded-bg-color)] hover:border-[var(--bg-color-contrast)] bg-[var(--bg-color)]'"
        @click="setChartType(chart)"
      >
        <ChartColumn v-if="chart === 'bar'" class="text-[var(--text-color)]" :size="18" />
        <ChartPie v-else-if="chart === 'pie'" class="text-[var(--text-color)]" :size="18" />
        <CircleDot v-else-if="chart === 'doughnut'" class="text-[var(--text-color)]" :size="18" />
      </div>
    </div>

    </div>

</template>

<script setup lang="ts">
import { X, ChartColumn, ChartPie, CircleDot } from 'lucide-vue-next'
import { chartType } from '~/utils/slides'

const emit = defineEmits<{ close: [] }>()

const closeEditPanel = () => {
  emit('close')
}

const chartButtons = ['bar', 'doughnut', 'pie'] as const

const setChartType = (type: 'bar' | 'doughnut' | 'pie') => {
    chartType.value = type
}

</script>


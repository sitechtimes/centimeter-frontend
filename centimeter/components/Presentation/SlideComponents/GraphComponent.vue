<template>
  <div :class="wrapperClass" :style="wrapperStyle">
    <Bar v-if="chartType === 'bar'" :data="chartData" :options="chartOptions" class="w-full h-full" />
    <Doughnut v-else-if="chartType === 'doughnut'" :data="chartData" :options="chartOptions" class="w-full h-full" />
    <Pie v-else-if="chartType === 'pie'" :data="chartData" :options="chartOptions" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { Bar, Doughnut, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)
import { chartType } from '~/utils/slides'

const props = defineProps<{ options?: PollsOption[]}>()

const wrapperStyle = computed(() => {
  if (chartType.value === 'pie' || chartType.value === 'doughnut') {
    return {
      width: '100%',
      height: '100%'
    }
  }
  if (chartType.value === 'bar') {
    return {
      width: '100%',
      height: '100%'
    }
  }

  return {
    width: '100%',
    height: '100%'
  }
})

const wrapperClass = computed(() => 'flex items-center justify-center')

const chartData = computed(() => ({
  labels: props.options?.map((option: PollsOption) => option.option_text) ?? [],
  datasets: [
    {
      label: 'Votes',
      data: props.options?.map((option: PollsOption) => option.amount_chosen) ?? [],
      backgroundColor: props.options?.map((option: PollsOption) => option.color) ?? [],
      borderWidth: 1,
    }
  ]
}))

const chartOptions = {
  scales: {
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'var(--bg-color-contrast)',
      titleColor: 'var(--text-color-contrast)',
      bodyColor: 'var(--text-color-contrast)',
      borderColor: 'var(--faded-bg-color)',
      borderWidth: 1
    }
  },
  responsive: true,
  maintainAspectRatio: false,
}
</script>


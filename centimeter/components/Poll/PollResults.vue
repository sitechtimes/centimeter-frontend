<template>
  <div class="max-w-4xl mx-auto p-6 bg-[var(--faded-bg-color-light)] rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-[var(--text-color)] mb-2">{{ poll.question }}</h2>
    <p class="text-lg text-[var(--faded-text-color)] mb-6">
      Total Votes: {{ totalVotes }}
    </p>
    
    <div class="space-y-4">
      <div
        v-for="option in poll.options"
        :key="option.id"
        class="relative"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-lg font-medium text-[var(--text-color)]">{{ option.text }}</span>
          <span class="text-lg font-semibold text-[var(--text-color)]">
            {{ getVotes(option.id) }} ({{ getPercentage(option.id) }}%)
          </span>
        </div>
        
        <div class="w-full bg-[var(--bg-color)] rounded-full h-8 overflow-hidden">
          <div
            class="bg-[var(--primary)] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
            :style="{ width: `${getPercentage(option.id)}%` }"
          >
            <span v-if="getPercentage(option.id) > 10" class="text-sm font-medium text-[var(--text-color-contrast)]">
              {{ getPercentage(option.id) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-center gap-4">
      <button
        @click="refreshResults"
        :disabled="refreshing"
        class="px-6 py-2 bg-[var(--faded-bg-color)] text-[var(--text-color)] font-medium rounded-lg hover:bg-[var(--faded-bg-color-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <RefreshCw :class="{ 'animate-spin': refreshing }" class="w-4 h-4" />
        {{ refreshing ? 'Refreshing...' : 'Refresh Results' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import type { Poll } from '~/utils/types'

const props = defineProps<{
  poll: Poll
  responses: Record<string, number>
}>()

const emit = defineEmits<{
  'refresh-results': []
}>()

const refreshing = ref(false)

const totalVotes = computed(() => {
  return Object.values(props.responses).reduce((sum, count) => sum + count, 0)
})

function getVotes(optionId: string): number {
  return props.responses[optionId] || 0
}

function getPercentage(optionId: string): number {
  if (totalVotes.value === 0) return 0
  return Math.round((getVotes(optionId) / totalVotes.value) * 100)
}

async function refreshResults() {
  if (refreshing.value) return
  
  refreshing.value = true
  try {
    emit('refresh-results')
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    refreshing.value = false
  }
}
</script>

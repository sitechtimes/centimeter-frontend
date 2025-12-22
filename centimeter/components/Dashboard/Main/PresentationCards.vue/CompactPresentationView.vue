<template>
  <div class="w-full max-w-5xl mx-auto p-6 space-y-1">
    <div
      v-for="presentation in presentations"
      :key="presentation.presentation_name"
      class="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
    >

      <button class="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
        <Play class="w-5 h-5 text-gray-700" />
      </button>

  
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2">
          <h3 class="text-sm font-normal text-gray-900 truncate">
            {{ presentation.presentation_name }}
          </h3>
          <span class="text-xs text-gray-500 flex-shrink-0">1 slide</span>
        </div>
      </div>


      <div class="text-sm text-gray-600 w-32 flex-shrink-0">
        {{ presentation.host }}
      </div>


      <div class="text-sm text-gray-600 w-40 flex-shrink-0">
        {{ formatDate(presentation.last_interacted) }}
      </div>


      <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
        <BarChart3 class="w-4 h-4" />
        View results
      </button>


      <button class="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
        <MoreHorizontal class="w-5 h-5 text-gray-700" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, MoreHorizontal, BarChart3 } from 'lucide-vue-next'

interface Presentation {
  presentation_name: string
  host: string
  last_interacted: string
}

defineProps<{ presentations: Presentation[] }>()

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

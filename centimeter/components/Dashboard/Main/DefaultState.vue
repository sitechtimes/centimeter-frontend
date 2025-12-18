<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-6 py-8">
      <h1 class="text-3xl font-normal mb-8">My presentations</h1>
      
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
            <span class="text-lg leading-none">+</span>
            <span>New Menti</span>
          </button>
          <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors">
            <span class="text-lg leading-none">+</span>
            <span>New folder</span>
          </button>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search my presentations"
              class="w-96 pl-9 pr-9 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div class="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-1.5 rounded transition-colors',
                viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
              ]"
            >
              <LayoutGrid />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-1.5 rounded transition-colors',
                viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
              ]"
            >
              <Menu/>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-sm font-medium">Presentations ({{ filteredPresentations.length }})</h2>
        <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <span>Last modified</span>
          <ChevronDown/>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="presentation in filteredPresentations"
          :key="presentation.presentation_name"
          class="group cursor-pointer"
        >

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative aspect-[4/3] bg-gray-100">
              <div class="absolute top-3 right-3 bg-white rounded p-1.5 shadow-sm">
                <LayoutGrid />
              </div>
            </div>
          </div>

          <div class="mt-3 flex items-start gap-3">
            <div class="flex items-center justify-center w-9 h-9 bg-gray-200 rounded-full text-xs font-semibold shrink-0">
              {{ getInitials(presentation.host) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                {{ presentation.presentation_name }}
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">
                Edited {{ formatDate(presentation.last_interacted) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {Search, LayoutGrid, Menu, ChevronDown} from 'lucide-vue-next'
interface Presentation {
  presentation_name: string
  host: string
  last_interacted: string
}

const presentations: Presentation[] = [
  {
    presentation_name: "AI in Modern Healthcare",
    host: "Dr. Sarah Thompson",
    last_interacted: "2025-02-14T10:32:00Z"
  },
  {
    presentation_name: "Sustainable Architecture Trends",
    host: "Michael Reyes",
    last_interacted: "2025-01-29T16:45:12Z"
  },
  {
    presentation_name: "Quantum Computing 101",
    host: "Prof. Emily Zhang",
    last_interacted: "2024-12-08T09:15:47Z"
  },
  {
    presentation_name: "Building Scalable Web Apps",
    host: "Carlos Méndez",
    last_interacted: "2025-02-01T21:03:00Z"
  },
  {
    presentation_name: "Marketing Psychology Deep Dive",
    host: "Aisha Karim",
    last_interacted: "2025-02-10T14:20:30Z"
  }
]

const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

const filteredPresentations = computed(() => {
  if (!searchQuery.value) return presentations
  
  const query = searchQuery.value.toLowerCase()
  return presentations.filter(p => 
    p.presentation_name.toLowerCase().includes(query) ||
    p.host.toLowerCase().includes(query)
  )
})

const getInitials = (name: string): string => {
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'today'
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays < 30) return `${diffInDays} days ago`
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
</script>
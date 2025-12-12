<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />
    
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[var(--text-color)] mb-2">My Centis</h1>
          <p class="text-[var(--faded-text-color)]">Create and manage your interactive presentations</p>
        </div>
        <button
          @click="createNewCenti"
          class="flex items-center gap-2 bg-[var(--primary)] hover:brightness-90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Centi
        </button>
      </div>

      <!-- Recent Centis Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-[var(--text-color)] mb-6">Recent Centis</h2>
        
        <div v-if="presentations.length === 0" class="text-center py-16">
          <div class="flex flex-col items-center gap-4">
            <div class="w-20 h-20 rounded-full bg-[var(--faded-bg-color)] flex items-center justify-center">
              <svg class="w-10 h-10 text-[var(--faded-text-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-[var(--text-color)] mb-2">No centis yet</h3>
              <p class="text-[var(--faded-text-color)] mb-4">Get started by creating your first interactive presentation</p>
              <button
                @click="createNewCenti"
                class="bg-[var(--primary)] hover:brightness-90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200"
              >
                Create Your First Centi
              </button>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="presentation in presentations"
            :key="presentation.id"
            @click="openPresentation(presentation.id)"
            class="group bg-[var(--bg-color)] border-2 border-[var(--faded-bg-color)] rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[var(--primary)] hover:-translate-y-1"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-[var(--text-color)] mb-1 truncate group-hover:text-[var(--primary)] transition-colors">
                  {{ presentation.name }}
                </h3>
                <p class="text-sm text-[var(--faded-text-color)]">
                  {{ presentation.slides?.length || 0 }} slides
                </p>
              </div>
              <button
                @click.stop="deletePresentation(presentation.id)"
                class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[var(--faded-bg-color)] rounded-full"
                aria-label="Delete presentation"
              >
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div class="flex items-center justify-between text-xs text-[var(--faded-text-color)]">
              <span>Updated {{ formatDate(presentation.updatedAt) }}</span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(presentation.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Templates Section (Optional - can be added later) -->
      <section>
        <h2 class="text-2xl font-semibold text-[var(--text-color)] mb-6">Start from a Template</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="template in templates"
            :key="template.name"
            @click="createFromTemplate(template)"
            class="bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <h3 class="text-lg font-semibold text-white mb-2">{{ template.name }}</h3>
            <p class="text-sm text-white/80">{{ template.description }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Presentation } from '~/utils/types'
import NavBar from '~/components/NavBar.vue'

definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

// Sample data - in a real app, this would come from an API
const presentations = ref<Presentation[]>([
  // Uncomment to test with sample data:
  // {
  //   id: '1',
  //   name: 'Team Meeting Q1 2024',
  //   createdAt: new Date('2024-01-15').toISOString(),
  //   updatedAt: new Date('2024-01-20').toISOString(),
  //   slides: [{ type: 'Multiple Choice' }, { type: 'Word Cloud' }]
  // },
])

const templates = ref([
  {
    name: 'Quick Poll',
    description: 'Start with basic polling questions',
    type: 'poll'
  },
  {
    name: 'Team Meeting',
    description: 'Ice breakers and Q&A slides',
    type: 'meeting'
  },
  {
    name: 'Educational Quiz',
    description: 'Quiz template for learning',
    type: 'quiz'
  }
])

const PRESENTATION_EDITOR_PATH = '/CreatePresentation'

function createNewCenti() {
  navigateTo(PRESENTATION_EDITOR_PATH)
}

function openPresentation(id?: string) {
  if (id) {
    // In a real app, you would load the presentation data
    navigateTo(PRESENTATION_EDITOR_PATH)
  }
}

function createFromTemplate(template: any) {
  // In a real app, you would create a presentation from the template
  navigateTo(PRESENTATION_EDITOR_PATH)
}

function deletePresentation(id?: string) {
  if (!id) return
  
  if (confirm('Are you sure you want to delete this presentation?')) {
    presentations.value = presentations.value.filter(p => p.id !== id)
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Just now'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return date.toLocaleDateString()
}
</script>

<style scoped>
/* Any additional styles if needed */
</style>
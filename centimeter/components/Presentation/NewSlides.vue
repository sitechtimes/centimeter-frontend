<template>
  <div class="dropdown">
    <div @click="toggleIcon" tabindex="0" role="button" class="btn m-3 rounded-4xl">
      <Plus v-if="isPlus" key="'plus'" :size="20" />
      <X v-else key="'x'" :size="20" />

      New Slide
    </div>
    <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-104">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-gray-900">Interactive questions</h2>
            <button class="text-gray-400 hover:text-gray-600">
              <HelpCircle :size="18" />
            </button>
          </div>
          <button
            @click="isOpen = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Interactive Questions Section -->
          <div class="grid grid-cols-2 gap-1">
            <button
              v-for="option in interactiveOptions"
              :key="option.label"
              class="flex items-center gap-3 p-3 rounded-4xl hover:bg-gray-200 transition-all text-left relative group cursor-pointer font-bold"
              @click="handleClick(option)"
            >
              <component :is="option.icon" :size="20" :class="option.color" />
              <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
            </button>
          </div>

          <!-- Quiz Competitions Section -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-sm font-medium text-gray-700">Quiz competitions</h3>
              <button class="text-gray-400 hover:text-gray-600">
                <HelpCircle :size="16" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="option in quizOptions"
                :key="option.label"
                class="flex items-center gap-1 p-3 rounded-4xl hover:bg-gray-200 transition-all text-left"
                @click="handleClick(option)"
              >
                <component :is="option.icon" :size="20" :class="option.color" />
                <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
              </button>
            </div>
          </div>

          <!-- Content Slides Section -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-sm font-medium text-gray-700">Content slides</h3>
              <button class="text-gray-400 hover:text-gray-600">
                <HelpCircle :size="16" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="option in contentOptions"
                :key="option.label"
                class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
                @click="handleClick(option)"
              >
                <component :is="option.icon" :size="20" :class="option.color" />
                <span class="text-sm font-medium text-gray-900">{{ option.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'
const isOpen = ref(false)
const isPlus = ref(true)
import {
  BarChart3,
  Cloud,
  MessageSquare,
  Scale,
  List,
  Users,
  HelpCircle,
  Award,
  Grid2x2,
  Edit3,
  MapPin,
  Hourglass,
  Type,
  Image,
  Play,
  LayoutGrid,
  X,
  Plus,
} from 'lucide-vue-next'
const interactiveOptions = [
  { icon: BarChart3, label: 'Multiple Choice', color: 'text-blue-600' },
  { icon: Cloud, label: 'Word Cloud', color: 'text-red-400' },
  { icon: MessageSquare, label: 'Open Ended', color: 'text-pink-400' },
  { icon: Scale, label: 'Scales', color: 'text-indigo-600' },
  { icon: List, label: 'Ranking', color: 'text-green-600' },
  { icon: Users, label: 'Q&A', color: 'text-pink-400' },
  { icon: HelpCircle, label: 'Guess the Number', color: 'text-yellow-600' },
  { icon: Award, label: '100 points', color: 'text-blue-600' },
  { icon: Grid2x2, label: '2 x 2 Grid', color: 'text-red-500' },
  { icon: Edit3, label: 'Quick Form', color: 'text-yellow-600', featured: true },
  { icon: MapPin, label: 'Pin on Image', color: 'text-purple-600' },
]

const quizOptions = [
  { icon: BarChart3, label: 'Select Answer', color: 'text-blue-600' },
  { icon: Hourglass, label: 'Type Answer', color: 'text-green-600' },
]

const contentOptions = [
  { icon: Type, label: 'Text', color: 'text-blue-600' },
  { icon: Image, label: 'Image', color: 'text-blue-500' },
  { icon: Play, label: 'Video', color: 'text-purple-600' },
  { icon: LayoutGrid, label: 'Instructions', color: 'text-gray-600' },
]

function toggleIcon() {
  isPlus.value = !isPlus.value
  console.log('Icon toggled')
}
interface Option {
  icon: any
  label: string
  color?: string
  featured?: boolean
}

function handleClick(option: Option): void {
  console.log('Option clicked:', option.label)
}
const emits = defineEmits(['open-modal'])

const openModal = () => {
  emit('open-modal')
}
</script>

<style scoped></style>

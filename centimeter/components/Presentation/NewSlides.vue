<template>
  <div class="dropdown">
    <div @click="toggleIcon" tabindex="0" role="button" class="btn m-3 rounded-4xl">
      <Plus v-if="isPlus" key="'plus'" :size="20" />
      <X v-else key="'x'" :size="20" />
      New Slide
    </div>

    <ul tabindex="-1" class="dropdown-content menu rounded-box z-10 w-96">
      <div
        class="bg-[var(--bg-color)] rounded-xl shadow-2xl w-full relative border border-[var(--faded-bg-color)]"
      >
        <div class="flex items-center justify-between p-6 border-b border-[var(--faded-bg-color)]">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-[var(--text-color)]">Interactive questions</h2>

            <button class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
              <HelpCircle :size="18" />
            </button>
          </div>

          <button
            @click="isOpen = false"
            class="text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors cursor-pointer"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-1">
            <button
              v-for="option in interactiveOptions"
              :key="option.label"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--faded-bg-color)] transition-all text-left relative group cursor-pointer font-bold"
              @click="handleClick(option)"
            >
              <component :is="option.icon" :size="20" :class="option.color" />
              <span class="text-sm font-medium text-[var(--text-color)]">{{ option.label }}</span>
            </button>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-sm font-medium text-[var(--faded-text-color)]">Quiz competitions</h3>
              <button class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
                <HelpCircle :size="16" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="option in quizOptions"
                :key="option.label"
                class="flex items-center gap-1 p-3 rounded-lg hover:bg-[var(--faded-bg-color)] transition-all text-left"
                @click="handleClick(option)"
              >
                <component :is="option.icon" :size="20" :class="option.color" />
                <span class="text-sm font-medium text-[var(--text-color)]">{{ option.label }}</span>
              </button>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-sm font-medium text-[var(--faded-text-color)]">Content slides</h3>
              <button class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
                <HelpCircle :size="16" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="option in contentOptions"
                :key="option.label"
                class="flex items-center gap-3 p-3 rounded-lg border border-[var(--faded-bg-color)] hover:border-[var(--faded-bg-color-dark)] hover:bg-[var(--faded-bg-color)] transition-all text-left"
                @click="handleClick(option)"
              >
                <component :is="option.icon" :size="20" :class="option.color" />
                <span class="text-sm font-medium text-[var(--text-color)]">{{ option.label }}</span>
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
import type { Component } from 'vue'

interface Option {
  icon: Component
  label: string
  color?: string
  featured?: boolean
}

function handleClick(option: Option): void {
  console.log('Option clicked:', option.label)
  emits('add-slide', option.label)
}

const emits = defineEmits<{
  'add-slide': [slideType: string]
}>()
</script>

<style scoped></style>

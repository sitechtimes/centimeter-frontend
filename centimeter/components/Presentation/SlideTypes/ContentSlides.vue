<template>
    <div>
        <div class="flex items-center gap-2 mb-3">
            <h3 class="text-sm font-medium text-[var(--faded-text-color)]">Content slides</h3>
            <button class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
            <HelpCircle :size="16" @click.stop="onIconClick" />
            </button>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <button
            v-for="option in contentOptions"
            :key="option.label"
            class="flex items-center gap-3 p-3 rounded-lg border border-[var(--faded-bg-color)] hover:border-[var(--faded-bg-color-dark)] hover:bg-[var(--faded-bg-color)] transition-all text-left"
            @click="handleClick(option)"
            >
            <component :is="option.icon" :size="20" :class="option.color" @click.stop="onIconClick" />
            <span class="text-sm font-medium text-[var(--text-color)]">{{ option.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {Type, Image, Play, LayoutGrid, HelpCircle} from 'lucide-vue-next'
import type {Option} from "~/utils/types.ts"

function handleClick(option: Option): void {
  console.log('Option clicked:', option.label)
  emits('add-slide', option.label)
  emits('toggle-icon')
}

function onIconClick(): void {
  emits('toggle-icon')
}

const contentOptions = [
  { icon: Type, label: 'Text', color: 'text-blue-600' },
  { icon: Image, label: 'Image', color: 'text-blue-500' },
  { icon: Play, label: 'Video', color: 'text-purple-600' },
  { icon: LayoutGrid, label: 'Instructions', color: 'text-gray-600' },
]

const emits = defineEmits<{
  'add-slide': [slideType: string],
  'toggle-icon': []
}>()
</script>
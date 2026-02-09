<template>
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

</template>

<script setup lang="ts">
import type {Option} from "../../../utils/types.ts"
import {BarChart3, Hourglass, HelpCircle} from 'lucide-vue-next'
function handleClick(option: Option): void {
  console.log('Option clicked:', option.label)
  emits('add-slide', option.label)
}
const quizOptions = [
  { icon: BarChart3, label: 'Select Answer', color: 'text-blue-600' },
  { icon: Hourglass, label: 'Type Answer', color: 'text-green-600' },
]
const emits = defineEmits<{
  'add-slide': [slideType: string]
}>()
</script>
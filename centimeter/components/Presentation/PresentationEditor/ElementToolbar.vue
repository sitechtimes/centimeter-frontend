<template>
    <div 
        v-if="shouldShowToolbar"
        :style="toolbarStyle"
        class="absolute flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50"
        @mousedown.stop
        @click.stop>
        <!-- Font Size Control (for text components) -->
        <div v-if="component?.type === 'text'" class="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-2">
            <button 
                @click="changeFontSize(-2)"
                class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Decrease font size">
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
            </button>
            <input 
                type="number" 
                :value="component?.fontSize || 24" 
                @input="updateFontSize($event)"
                class="w-14 px-2 py-1 text-sm text-center bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="8"
                max="120"
                @mousedown.stop
                @click.stop />
            <button 
                @click="changeFontSize(2)"
                class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Increase font size">
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
        
        <!-- Text Alignment Control (for text components) -->
        <div v-if="component?.type === 'text'" class="flex items-center gap-1">
            <button 
                @click="setAlignment('left')"
                :class="['p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors', 
                         { 'bg-blue-100 dark:bg-blue-900': component?.textAlign === 'left' }]"
                title="Align left">
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14" />
                </svg>
            </button>
            <button 
                @click="setAlignment('center')"
                :class="['p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors',
                         { 'bg-blue-100 dark:bg-blue-900': component?.textAlign === 'center' }]"
                title="Align center">
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14" />
                </svg>
            </button>
            <button 
                @click="setAlignment('right')"
                :class="['p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors',
                         { 'bg-blue-100 dark:bg-blue-900': component?.textAlign === 'right' }]"
                title="Align right">
                <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14" />
                </svg>
            </button>
        </div>

        <!-- Add more controls here for other component types (images, shapes, etc.) -->
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SlideComponent } from '@/utils/types'

const props = defineProps<{
    component: SlideComponent | null
    canvasWidth: number
    canvasHeight: number
    isEditing?: boolean
}>()

const emit = defineEmits<{
    'update-property': [key: string, value: any]
}>()

const toolbarStyle = computed(() => {
    if (!props.component) return {}
    
    // Position the toolbar above the component
    const leftPx = (props.component.x / 100) * props.canvasWidth
    const topPx = (props.component.y / 100) * props.canvasHeight
    
    return {
        left: `${leftPx}px`,
        top: `${topPx - 48}px` // 48px above the element
    }
})

const shouldShowToolbar = computed(() => {
    return props.component && !props.isEditing
})

// Font size methods
const changeFontSize = (delta: number) => {
    if (!props.component) return
    const newSize = Math.max(8, Math.min(120, (props.component.fontSize || 24) + delta))
    emit('update-property', 'fontSize', newSize)
}

const updateFontSize = (event: Event) => {
    const target = event.target as HTMLInputElement
    const newSize = Math.max(8, Math.min(120, parseInt(target.value) || 24))
    emit('update-property', 'fontSize', newSize)
}

// Alignment methods
const setAlignment = (align: 'left' | 'center' | 'right') => {
    emit('update-property', 'textAlign', align)
}
</script>

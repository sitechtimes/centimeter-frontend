<template>
    <div class="h-screen flex items-start justify-center bg-[#efefef] p-6 pt-12 overflow-auto">
        <!-- Empty state when no slide is selected -->
        <div v-if="!currentSlide" class="flex flex-col items-center justify-center h-full gap-6">
            <div class="text-center space-y-4">
                <svg class="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                    <h2 class="text-2xl font-semibold text-gray-600">No Slide Selected</h2>
                    <p class="text-gray-500 mt-2">Select a slide from the left panel or create a new one</p>
                </div>
            </div>
        </div>

        <!-- Canvas when slide is selected -->
        <div v-else class="flex flex-col items-center gap-4">
            <div
                ref="canvasRef"
                role="region"
                aria-label="Presentation canvas"
                :style="{ width: CANVAS_WIDTH + 'px', height: CANVAS_HEIGHT + 'px' }"
                class="relative bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)]"
                tabindex="0"
                @click="handleCanvasClick"
                @keydown.delete="deleteSelected"
                @keydown.escape="selectedId = null"
            >
                <TextComponent
                    v-for="component in textComponents"
                    :key="component.id"
                    :component="component"
                    :isSelected="selectedId === component.id"
                    :canvasWidth="CANVAS_WIDTH"
                    :canvasHeight="CANVAS_HEIGHT"
                    @select="selectedId = component.id"
                    @update="component.content = $event"
                    @move="(dx, dy) => moveComponent(component, dx, dy)"
                    @resize="(width, height) => resizeComponent(component, width, height)"
                />
            </div>
            <button 
                @click="console.log({type: 'slide', components, canvasSize: {w: CANVAS_WIDTH, h: CANVAS_HEIGHT}})"
                class="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-shade)] transition-colors"
            >
                💾 Save Slide
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { SlideComponent, Slide } from '../../utils/types'
import TextComponent from './SlideComponents/TextComponent.vue'

const props = defineProps<{
    currentSlide?: Slide
}>()

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800

const canvasRef = ref<HTMLDivElement>()
const components = ref<SlideComponent[]>([])
const selectedId = ref<string | null>(null)
const componentCounter = ref<Record<string, number>>({ text: 0, image: 0, shape: 0 })

const textComponents = computed(() => components.value.filter(c => c.type === 'text'))

watch(() => props.currentSlide, (newSlide) => {
    if (newSlide?.components) {
        components.value = [...newSlide.components]
    } else {
        components.value = []
    }
    selectedId.value = null
}, { immediate: true })

const handleCanvasClick = (e: MouseEvent) => {
    selectedId.value = null
}

const moveComponent = (component: SlideComponent, dx: number, dy: number) => {
    component.x = Math.max(0, Math.min(100 - component.width, component.x + dx))
    component.y = Math.max(0, Math.min(100 - component.height, component.y + dy))
}

const resizeComponent = (component: SlideComponent, width: number, height: number) => {
    component.width = width
    component.height = height
}

const deleteSelected = () => {
    if (selectedId.value) {
        components.value = components.value.filter(c => c.id !== selectedId.value)
        selectedId.value = null
    }
}

const addComponent = (type: 'text' | 'image' | 'shape') => {
    const offset = componentCounter.value[type] * 1
    const baseX = 10 + offset
    const baseY = 10 + offset
    
    const newComponent: SlideComponent = {
        id: `${type}-${Date.now()}`,
        type,
        x: Math.min(baseX, 70),
        y: Math.min(baseY, 70),
        width: 30,
        height: 10,
        content: 'Double click to edit',
        fontSize: 24,
        color: '#000',
        textAlign: 'left',
        zIndex: components.value.length + 1
    }
    
    components.value.push(newComponent)
    selectedId.value = newComponent.id
    componentCounter.value[type]++
    
    if (componentCounter.value[type] > 20) {
        componentCounter.value[type] = 0
    }
}

defineExpose({ addComponent })

onMounted(() => canvasRef.value?.focus())
</script>
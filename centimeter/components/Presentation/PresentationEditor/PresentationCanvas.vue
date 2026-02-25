<template>
    <div class="h-screen flex items-start justify-center bg-[var(--faded-bg-color-light)] p-6 pt-12 overflow-auto">
        <div v-if="!currentSlide" class="flex flex-col items-center justify-center h-full gap-6">
            <div class="text-center space-y-4">
                <svg class="w-32 h-32 mx-auto text-[var(--faded-text-color)] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                    <h2 class="text-2xl font-semibold text-[var(--text-color)]">No Slide Selected</h2>
                    <p class="text-[var(--faded-text-color)] mt-2">Select a slide from the left panel or create a new one</p>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center gap-4">
            <div ref="canvasRef" role="region" aria-label="Presentation canvas" :style="canvasStyle"
                class="relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[var(--faded-bg-color)]"
                tabindex="0" @click="selectedId = null" @keydown.delete="deleteSelected" @keydown.escape="selectedId = null"
                @keydown.ctrl.c="copyComponent" @keydown.meta.c="copyComponent"
                @keydown.ctrl.v="pasteComponent" @keydown.meta.v="pasteComponent"
                @keydown.ctrl.d="duplicateComponent" @keydown.meta.d="duplicateComponent">
                
                <!-- Element Toolbar -->
                <ElementToolbar 
                    :component="selectedComponent"
                    :canvasWidth="CANVAS_WIDTH"
                    :canvasHeight="CANVAS_HEIGHT"
                    @update-property="(key: string, value: any) => selectedComponent && updateComponentProperty(selectedComponent, key, value)"
                />
                
                <svg class="absolute inset-0 pointer-events-none" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT">
                    <line
                        v-for="(guide, index) in alignmentGuides"
                        :key="`guide-${index}`"
                        :x1="guide.orientation === 'vertical' ? (guide.position / 100) * CANVAS_WIDTH : 0"
                        :y1="guide.orientation === 'vertical' ? 0 : (guide.position / 100) * CANVAS_HEIGHT"
                        :x2="guide.orientation === 'vertical' ? (guide.position / 100) * CANVAS_WIDTH : CANVAS_WIDTH"
                        :y2="guide.orientation === 'vertical' ? CANVAS_HEIGHT : (guide.position / 100) * CANVAS_HEIGHT"
                        :stroke="guide.type === 'center' ? '#f472b6' : '#3b82f6'"
                        stroke-width="1"
                        stroke-dasharray="4 4"
                        opacity="0.8"
                    />
                </svg>

                <component 
                    v-for="comp in components" :key="comp.id"
                    :is="COMPONENT_MAP[comp.type]"
                    :component="comp" :isSelected="selectedId === comp.id"
                    :isHighlighted="highlightedComponents.includes(comp.id)"
                    :canvasWidth="CANVAS_WIDTH" :canvasHeight="CANVAS_HEIGHT"
                    @select="selectedId = comp.id" @update="(content: string) => comp.content = content"
                    @move="(dx: number, dy: number) => moveComponent(comp, dx, dy)"
                    @resize="(w: number, h: number) => resizeComponent(comp, w, h)"
                    @update-property="(key: string, value: any) => updateComponentProperty(comp, key, value)" />
            </div>
            <button 
                @click="console.log({type: 'slide', components, canvasSize: {w: CANVAS_WIDTH, h: CANVAS_HEIGHT}})"
                class="px-4 py-2 bg-[var(--faded-bg-color)] text-[var(--text-color)] hover:bg-[var(--faded-bg-color-dark)] rounded-lg transition-colors text-sm font-medium"
            >
                Console slide properties
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextComponent from '../SlideComponents/TextComponent.vue'
import ElementToolbar from './ElementToolbar.vue'
import { findSnapPositions, type SnapGuide } from '@/utils/alignment.ts'

const props = defineProps<{ currentSlide?: Slide }>()

const CANVAS_WIDTH = 1200, CANVAS_HEIGHT = 800
const COMPONENT_MAP: Record<string, typeof TextComponent> = { text: TextComponent }

const canvasRef = ref<HTMLDivElement>()
const components = ref<SlideComponent[]>([])
const selectedId = ref<string | null>(null)
const componentCounter = ref<Record<string, number>>({ text: 0, image: 0, shape: 0 })
const clipboard = ref<SlideComponent | null>(null)
const alignmentGuides = ref<SnapGuide[]>([])
const highlightedComponents = ref<string[]>([])
const showGuides = ref(false)

const canvasStyle = computed(() => ({ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }))

const selectedComponent = computed(() => 
    components.value.find(c => c.id === selectedId.value) || null
)

watch(() => props.currentSlide, (slide) => {
    components.value = slide?.components ? [...slide.components] : []
    selectedId.value = null
    alignmentGuides.value = []
    highlightedComponents.value = []
}, { immediate: true })

const moveComponent = (comp: SlideComponent, dx: number, dy: number) => {
    const newX = Math.max(0, Math.min(100 - comp.width, comp.x + dx))
    const newY = Math.max(0, Math.min(100 - comp.height, comp.y + dy))
    
    const otherComponents = components.value.filter(c => c.id !== comp.id)
    const snapResult = findSnapPositions(
        { x: newX, y: newY, width: comp.width, height: comp.height },
        otherComponents
    )
    
    comp.x = snapResult.x
    comp.y = snapResult.y
    alignmentGuides.value = snapResult.guides
    highlightedComponents.value = snapResult.highlightedComponentIds
    
    setTimeout(() => {
        alignmentGuides.value = []
        highlightedComponents.value = []
    }, 300)
}

const resizeComponent = (comp: SlideComponent, w: number, h: number) => {
    comp.width = w
    comp.height = h
}

const updateComponentProperty = (comp: SlideComponent, key: string, value: any) => {
    (comp as any)[key] = value
}

const deleteSelected = () => {
    if (!selectedId.value) return
    components.value = components.value.filter(c => c.id !== selectedId.value)
    selectedId.value = null
}

const copyComponent = (e: KeyboardEvent) => {
    e.preventDefault()
    const selected = components.value.find(c => c.id === selectedId.value)
    if (selected) {
        clipboard.value = JSON.parse(JSON.stringify(selected))
        console.log('Copied component:', clipboard.value)
    }
}

const pasteComponent = (e: KeyboardEvent) => {
    e.preventDefault()
    if (!clipboard.value) return
    
    const offset = componentCounter.value[clipboard.value.type] * 1
    const newComponent: SlideComponent = {
        ...JSON.parse(JSON.stringify(clipboard.value)),
        id: `${clipboard.value.type}-${Date.now()}`,
        x: Math.min(clipboard.value.x + 5, 70),
        y: Math.min(clipboard.value.y + 5, 70),
        zIndex: components.value.length + 1
    }
    
    components.value.push(newComponent)
    selectedId.value = newComponent.id
    componentCounter.value[clipboard.value.type] = (componentCounter.value[clipboard.value.type] + 1) % 21
    
    console.log('Pasted component:', newComponent)
}

const duplicateComponent = (e: KeyboardEvent) => {
    e.preventDefault()
    const selected = components.value.find(c => c.id === selectedId.value)
    if (!selected) return
    
    const newComponent: SlideComponent = {
        ...JSON.parse(JSON.stringify(selected)),
        id: `${selected.type}-${Date.now()}`,
        x: Math.min(selected.x + 5, 70),
        y: Math.min(selected.y + 5, 70),
        zIndex: components.value.length + 1
    }
    
    components.value.push(newComponent)
    selectedId.value = newComponent.id
    
    console.log('Duplicated component:', newComponent)
}

const addComponent = (type: string) => {
    const offset = componentCounter.value[type] * 1
    const newComponent: SlideComponent = {
        id: `${type}-${Date.now()}`, type,
        x: Math.min(10 + offset, 70), y: Math.min(10 + offset, 70),
        width: 30, height: 10,
        content: 'Double click to edit',
        fontSize: 24, color: '#000', textAlign: 'left',
        zIndex: components.value.length + 1
    }
    components.value.push(newComponent)
    selectedId.value = newComponent.id
    componentCounter.value[type] = (componentCounter.value[type] + 1) % 21
}

defineExpose({ addComponent })
onMounted(() => canvasRef.value?.focus())
</script>
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
                :class="['relative bg-[var(--bg-color)] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border transition-colors',
                    isCanvasDragging ? 'border-[var(--primary)] border-2' : 'border-[var(--faded-bg-color)]']"
                tabindex="0" @click="selectedId = null" @keydown.delete="deleteSelected" @keydown.escape="selectedId = null"
                @dragover.prevent @dragenter.prevent="isCanvasDragging = true" @dragleave="isCanvasDragging = false" @drop="onCanvasDrop">
                <component 
                    v-for="comp in components" :key="comp.id"
                    :is="COMPONENT_MAP[comp.type]"
                    :component="comp" :isSelected="selectedId === comp.id"
                    :canvasWidth="CANVAS_WIDTH" :canvasHeight="CANVAS_HEIGHT"
                    @select="selectedId = comp.id" @update="(content: string) => comp.content = content"
                    @move="(dx: number, dy: number) => moveComponent(comp, dx, dy)"
                    @resize="(w: number, h: number) => resizeComponent(comp, w, h)" />
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
import ImageComponent from '../SlideComponents/ImageComponent.vue'

const props = defineProps<{ currentSlide?: Slide }>()

const CANVAS_WIDTH = 1200, CANVAS_HEIGHT = 800
const COMPONENT_MAP: Record<string, Component> = {
    text: TextComponent,
    image: ImageComponent
}

const canvasRef = ref<HTMLDivElement>()
const components = ref<SlideComponent[]>([])
const selectedId = ref<string | null>(null)
const componentCounter = ref<Record<string, number>>({ text: 0, image: 0, shape: 0 })
const isCanvasDragging = ref(false)

const canvasStyle = computed(() => ({ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }))

watch(() => props.currentSlide, (slide) => {
    components.value = slide?.components ? [...slide.components] : []
    selectedId.value = null
}, { immediate: true })

const moveComponent = (comp: SlideComponent, dx: number, dy: number) => {
    comp.x = Math.max(0, Math.min(100 - comp.width, comp.x + dx))
    comp.y = Math.max(0, Math.min(100 - comp.height, comp.y + dy))
}

const resizeComponent = (comp: SlideComponent, w: number, h: number) => {
    comp.width = w
    comp.height = h
}

const deleteSelected = () => {
    if (!selectedId.value) return
    components.value = components.value.filter(c => c.id !== selectedId.value)
    selectedId.value = null
}

const addComponent = (type: string, src?: string) => {
    const offset = componentCounter.value[type] * 1
    const base: SlideComponent = {
        id: `${type}-${Date.now()}`, type,
        x: Math.min(10 + offset, 70), y: Math.min(10 + offset, 70),
        width: 30, height: 10,
        zIndex: components.value.length + 1
    }

    if (type === 'text') {
        base.content = 'Double click to edit'
        base.fontSize = 24
        base.color = '#000'
        base.textAlign = 'left'
        pushComponent(base)
    } else if (type === 'image') {
        base.src = src || ''
        if (src) {
            const img = new window.Image()
            img.onload = () => {
                let widthPct = (img.naturalWidth / CANVAS_WIDTH) * 100
                let heightPct = (img.naturalHeight / CANVAS_HEIGHT) * 100
                const maxPct = 80
                if (widthPct > maxPct || heightPct > maxPct) {
                    const scale = Math.min(maxPct / widthPct, maxPct / heightPct)
                    widthPct *= scale
                    heightPct *= scale
                }
                base.width = Math.max(5, widthPct)
                base.height = Math.max(5, heightPct)
                pushComponent(base)
            }
            img.onerror = () => {
                base.width = 25
                base.height = 25
                pushComponent(base)
            }
            img.src = src
        } else {
            base.width = 25
            base.height = 25
            pushComponent(base)
        }
    } else if (type === 'shape') {
        base.width = 15
        base.height = 15
        base.content = src || 'rectangle'
        base.backgroundColor = '#4F46E5'
        pushComponent(base)
    }
}

const pushComponent = (base: SlideComponent) => {
    components.value.push(base)
    selectedId.value = base.id
    componentCounter.value[base.type] = (componentCounter.value[base.type] + 1) % 21
}

const isImageFile = (file: File) =>
    ['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(file.type)

const onCanvasDrop = (e: DragEvent) => {
    e.preventDefault()
    isCanvasDragging.value = false
    const file = e.dataTransfer?.files?.[0]
    if (!file || !isImageFile(file)) return
    const reader = new FileReader()
    reader.onload = () => addComponent('image', reader.result as string)
    reader.readAsDataURL(file)
}

defineExpose({ addComponent })
onMounted(() => canvasRef.value?.focus())
</script>
<template>
    <div class="h-screen flex items-start justify-center bg-[#efefef] p-6 pt-12 overflow-auto">
        <div class="flex flex-col items-center gap-4">
            <div
                ref="canvasRef"
                role="region"
                aria-label="Presentation canvas"
                class="relative w-[1120px] h-[630px] bg-[whitesmoke] rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] cursor-crosshair"
                tabindex="0"
                @click="handleCanvasClick"
                @keydown.t.prevent="isAddingText = true"
                @keydown.delete="components = components.filter(c => c.id !== selectedId)"
                @keydown.escape="selectedId = null; isAddingText = false"
            >
                <TextComponent
                    v-for="component in components"
                    :key="component.id"
                    :component="component"
                    :isSelected="selectedId === component.id"
                    @select="selectedId = component.id"
                    @update="component.content = $event"
                />
            </div>
            <button @click="console.log({type: 'slide', components, canvasSize: {w: 1120, h: 630}})" >
                 Save Slide
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SlideComponent } from '../../utils/types'
import TextComponent from './TextComponent.vue'

const canvasRef = ref<HTMLDivElement>()
const components = ref<SlideComponent[]>([])
const selectedId = ref<string | null>(null)
const isAddingText = ref(false)

const handleCanvasClick = (e: MouseEvent) => {
    if (!isAddingText.value) return selectedId.value = null
    const rect = canvasRef.value!.getBoundingClientRect()
    components.value.push({
        id: `text-${Date.now()}`,
        type: 'text',
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
        width: 30,
        height: 10,
        content: 'Click to edit',
        fontSize: 24,
        color: '#000',
        textAlign: 'left',
        zIndex: components.value.length + 1
    })
    selectedId.value = components.value[components.value.length - 1].id
    isAddingText.value = false
}

const triggerAddText = () => {
    isAddingText.value = true
    canvasRef.value?.focus()
}

defineExpose({ triggerAddText })

onMounted(() => canvasRef.value?.focus())
</script>
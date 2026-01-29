<template>
    <div
        ref="componentRef"
        :style="{
            position: 'absolute',
            left: `${component.x}%`,
            top: `${component.y}%`,
            width: `${component.width}%`,
            height: `${component.height}%`,
            zIndex: component.zIndex
        }"
        :class="isSelected ? 'ring-2 ring-blue-500' : ''"
        class="group select-none"
        @click.stop="$emit('select')"
    >
        <!-- Text content (base layer) -->
        <div
            ref="textRef"
            contenteditable
            :style="{
                fontSize: `${component.fontSize}px`,
                color: component.color,
                textAlign: component.textAlign
            }"
            class="absolute inset-0 p-2 outline-none cursor-text"
            @focus="isEditing = true"
            @blur="handleBlur"
            @keydown.delete.stop
            @keydown.backspace.stop
        >
            {{ component.content }}
        </div>
        
        <!-- Drag handle (covers component but invisible to mouse when editing) -->
        <div 
            v-if="!isEditing"
            class="absolute inset-0 cursor-move z-10"
            :class="isSelected ? 'bg-blue-50 bg-opacity-10' : ''"
            @mousedown="handleMouseDown"
            @dblclick="startEditing"
        />
        
        <!-- Resize handles (only show when selected) -->
        <div v-if="isSelected" class="absolute inset-0 pointer-events-none">
            <div 
                v-for="handle in resizeHandles" 
                :key="handle.position"
                :class="handle.class"
                :style="{ cursor: handle.cursor }"
                class="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full pointer-events-auto hover:scale-125 transition-transform z-20"
                @mousedown.stop="startResize($event, handle.position)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SlideComponent } from '../../../utils/types'

const props = defineProps<{
    component: SlideComponent
    isSelected: boolean
    canvasWidth: number
    canvasHeight: number
}>()

const emit = defineEmits<{
    select: []
    update: [content: string]
    move: [dx: number, dy: number]
    resize: [width: number, height: number]
}>()

const componentRef = ref<HTMLDivElement>()
const textRef = ref<HTMLDivElement>()
const isDragging = ref(false)
const isEditing = ref(false)
const startPos = ref({ x: 0, y: 0 })

// Track if user is actively editing text
watch(() => props.isSelected, (selected) => {
    if (!selected) isEditing.value = false
})

const resizeHandles = [
    { position: 'nw', class: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nw-resize' },
    { position: 'ne', class: 'top-0 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'ne-resize' },
    { position: 'sw', class: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', cursor: 'sw-resize' },
    { position: 'se', class: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', cursor: 'se-resize' },
]

const startEditing = () => {
    isEditing.value = true
    // Focus the contenteditable div on next tick
    setTimeout(() => {
        textRef.value?.focus()
        // Select all text for easier editing
        const selection = window.getSelection()
        const range = document.createRange()
        if (textRef.value) {
            range.selectNodeContents(textRef.value)
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }, 0)
}

const handleBlur = (e: Event) => {
    isEditing.value = false
    emit('update', (e.target as HTMLElement).textContent || '')
}

const handleMouseDown = (e: MouseEvent) => {
    isDragging.value = true
    startPos.value = { x: e.clientX, y: e.clientY }
    
    const onMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.value) return
        
        const dx = ((moveEvent.clientX - startPos.value.x) / props.canvasWidth) * 100
        const dy = ((moveEvent.clientY - startPos.value.y) / props.canvasHeight) * 100
        
        emit('move', dx, dy)
        startPos.value = { x: moveEvent.clientX, y: moveEvent.clientY }
    }
    
    const onMouseUp = () => {
        isDragging.value = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }
    
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

const startResize = (e: MouseEvent, position: string) => {
    startPos.value = { x: e.clientX, y: e.clientY }
    const startWidth = props.component.width
    const startHeight = props.component.height
    const startX = props.component.x
    const startY = props.component.y
    
    const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = ((moveEvent.clientX - startPos.value.x) / props.canvasWidth) * 100
        const dy = ((moveEvent.clientY - startPos.value.y) / props.canvasHeight) * 100
        
        let newWidth = startWidth
        let newHeight = startHeight
        let newX = startX
        let newY = startY
        
        if (position.includes('e')) newWidth = Math.max(5, startWidth + dx)
        if (position.includes('w')) {
            newWidth = Math.max(5, startWidth - dx)
            newX = startX + (startWidth - newWidth)
        }
        if (position.includes('s')) newHeight = Math.max(5, startHeight + dy)
        if (position.includes('n')) {
            newHeight = Math.max(5, startHeight - dy)
            newY = startY + (startHeight - newHeight)
        }
        
        // Update position if resizing from west or north
        if (position.includes('w') || position.includes('n')) {
            const deltaX = newX - props.component.x
            const deltaY = newY - props.component.y
            if (deltaX !== 0 || deltaY !== 0) {
                emit('move', deltaX, deltaY)
            }
        }
        
        emit('resize', newWidth, newHeight)
    }
    
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }
    
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}
</script>

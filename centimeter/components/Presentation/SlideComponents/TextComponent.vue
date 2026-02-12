<template>
    <div :style="componentStyle" :class="['group select-none absolute', { 'ring-2 ring-blue-500': isSelected, 'ring-2 ring-purple-400 ring-opacity-60': isHighlighted && !isSelected }]" @click.stop="emit('select')">
        <div 
            ref="textRef" 
            contenteditable 
            :style="textStyle" 
            class="absolute inset-0 p-2 outline-none cursor-text" 
            @focus="isEditing = true" 
            @blur="isEditing = false; emit('update', ($event.target as HTMLElement).textContent || '')"
            @keydown.delete.stop 
            @keydown.backspace.stop 
            v-text="component.content" 
        />
        
        <div v-show="!isEditing" :class="['absolute inset-0 cursor-move z-10', { 'bg-blue-50 bg-opacity-10': isSelected }]" 
            @mousedown="startDrag" @dblclick="startEdit" />
        
        <div v-if="isSelected" class="absolute inset-0 pointer-events-none">
            <div v-for="(classes, direction) in HANDLE_MAP" :class="classes" :style="{ cursor: `${direction}-resize` }"
                class="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full pointer-events-auto hover:scale-125 transition-transform z-20"
                @mousedown.stop="startResize($event, direction)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { SlideComponent } from '@/utils/types'

const props = defineProps<{
    component: SlideComponent
    isSelected: boolean
    isHighlighted?: boolean
    canvasWidth: number
    canvasHeight: number
}>()

const emit = defineEmits<{
    select: [], 
    update: [content: string], 
    move: [dx: number, dy: number], 
    resize: [width: number, height: number],
    'update-property': [key: string, value: any]
}>()

const HANDLE_MAP: Record<string, string> = {
    nw: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    n: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    ne: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    sw: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    se: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
}

const textRef = ref<HTMLDivElement>()
const isEditing = ref(false)

const componentStyle = computed(() => ({
    left: `${props.component.x}%`, 
    top: `${props.component.y}%`,
    width: `${props.component.width}%`, 
    height: `${props.component.height}%`,
    zIndex: props.component.zIndex
}))

const textStyle = computed(() => ({
    fontSize: `${props.component.fontSize}px`,
    color: props.component.color,
    backgroundColor: props.component.backgroundColor,
    textAlign: props.component.textAlign,
    fontWeight: props.component.fontWeight,
    fontStyle: props.component.fontStyle
}))

watch(() => props.isSelected, (sel) => {
    if (!sel) {
        isEditing.value = false
    }
})

const startEdit = () => {
    isEditing.value = true
    nextTick(() => {
        if (!textRef.value) return
        textRef.value.focus()
        const sel = window.getSelection(), range = document.createRange()
        range.selectNodeContents(textRef.value)
        sel?.removeAllRanges()
        sel?.addRange(range)
    })
}

const startDrag = (e: MouseEvent) => {
    e.preventDefault()
    let lastX = e.clientX, lastY = e.clientY
    
    const onMove = (me: MouseEvent) => {
        emit('move', ((me.clientX - lastX) / props.canvasWidth) * 100, ((me.clientY - lastY) / props.canvasHeight) * 100)
        lastX = me.clientX
        lastY = me.clientY
    }
    const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
}

const startResize = (e: MouseEvent, handle: string) => {
    e.preventDefault()
    const startX = e.clientX, startY = e.clientY, init = { ...props.component }
    
    const onMove = (me: MouseEvent) => {
        const dx = ((me.clientX - startX) / props.canvasWidth) * 100
        const dy = ((me.clientY - startY) / props.canvasHeight) * 100
        let w = init.width, ht = init.height, x = init.x, y = init.y
        
        if (handle.includes('e')) w = Math.max(5, init.width + dx)
        if (handle.includes('w')) { w = Math.max(5, init.width - dx); x = init.x + (init.width - w) }
        if (handle.includes('s')) ht = Math.max(5, init.height + dy)
        if (handle.includes('n')) { ht = Math.max(5, init.height - dy); y = init.y + (init.height - ht) }
        
        const dx2 = x - props.component.x, dy2 = y - props.component.y
        if (dx2 || dy2) emit('move', dx2, dy2)
        emit('resize', w, ht)
    }
    const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
}
</script>
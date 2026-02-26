<template>
    <div :style="componentStyle" :class="['group select-none absolute', { 'ring-2 ring-blue-500': isSelected }]" style="container-type: inline-size" @click.stop="emit('select')">
        <div ref="textRef" contenteditable :style="textStyle" class="w-full p-[1cqi] outline-none cursor-text min-h-[1.5em] break-words whitespace-pre-wrap text-[var(--text-color)]" 
            @focus="isEditing = true" 
            @blur="isEditing = false; emit('update', ($event.target as HTMLElement).textContent || '')"
            @keydown.delete.stop @keydown.backspace.stop v-text="component.content" />
        
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
const props = defineProps<{
    component: SlideComponent
    isSelected: boolean
    canvasWidth: number
    canvasHeight: number
}>()

const emit = defineEmits<{
    select: [], update: [content: string], move: [dx: number, dy: number], resize: [width: number, height: number]
}>()

const HANDLE_MAP: Record<string, string> = {
    e: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
    w: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2'
}

const textRef = ref<HTMLDivElement>()
const isEditing = ref(false)

const componentStyle = computed(() => ({
    left: `${props.component.x}%`, top: `${props.component.y}%`,
    width: `${props.component.width}%`,
    zIndex: props.component.zIndex
}))

const baseFontCqi = computed(() => ((props.component.fontSize ?? 16) / 16) * 5)

const textStyle = computed(() => ({
    fontSize: `clamp(0.5rem, ${baseFontCqi.value}cqi, ${props.component.fontSize}px)`,
    textAlign: props.component.textAlign
}))

watch(() => props.isSelected, (sel) => !sel && (isEditing.value = false))

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
    const startX = e.clientX, initWidth = props.component.width, initX = props.component.x

    const onMove = (me: MouseEvent) => {
        const dx = ((me.clientX - startX) / props.canvasWidth) * 100
        let w = initWidth, x = initX

        if (handle === 'e') w = Math.max(5, initWidth + dx)
        if (handle === 'w') { w = Math.max(5, initWidth - dx); x = initX + (initWidth - w) }

        const dxMove = x - props.component.x
        if (dxMove) emit('move', dxMove, 0)
        emit('resize', w, props.component.height)
    }
    const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
}
</script>

<template>
    <div :style="componentStyle" :class="['group select-none absolute', { 'ring-2 ring-blue-500': isSelected }]" @click.stop="emit('select')">
        <!-- Image display -->
        <div v-if="component.src" class="absolute inset-0 overflow-hidden rounded">
            <img :src="component.src" alt="" class="w-full h-full object-cover pointer-events-none" draggable="false" />
        </div>

        <!-- Placeholder when no image -->
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-[var(--faded-bg-color-light)] border-2 border-dashed border-[var(--faded-bg-color-dark)] rounded cursor-pointer"
            @dblclick.stop="openFilePicker">
            <svg class="w-10 h-10 text-[var(--faded-text-color)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-xs text-[var(--faded-text-color)]">Double-click to add image</span>
        </div>

        <!-- Drag overlay -->
        <div :class="['absolute inset-0 cursor-move z-10', { 'bg-blue-50 bg-opacity-10': isSelected }]"
            @mousedown="startDrag" @dblclick.stop="openFilePicker" />

        <!-- Resize handles -->
        <div v-if="isSelected" class="absolute inset-0 pointer-events-none">
            <div v-for="(classes, direction) in HANDLE_MAP" :class="classes" :style="{ cursor: `${direction}-resize` }"
                class="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full pointer-events-auto hover:scale-125 transition-transform z-20"
                @mousedown.stop="startResize($event, direction)" />
        </div>

        <!-- Hidden file input -->
        <input ref="fileInput" type="file" accept="image/png,image/gif,image/jpeg,image/jpg,image/svg+xml" class="hidden" @change="onFileSelected" />
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
    nw: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    ne: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    sw: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    se: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
}

const fileInput = ref<HTMLInputElement>()

const componentStyle = computed(() => ({
    left: `${props.component.x}%`, top: `${props.component.y}%`,
    width: `${props.component.width}%`, height: `${props.component.height}%`,
    zIndex: props.component.zIndex
}))

const openFilePicker = () => fileInput.value?.click()

const onFileSelected = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        props.component.src = reader.result as string
        emit('update', reader.result as string)
    }
    reader.readAsDataURL(file)
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

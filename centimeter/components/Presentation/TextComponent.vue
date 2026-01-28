<template>
    <div
        :style="{
            position: 'absolute',
            left: `${component.x}%`,
            top: `${component.y}%`,
            width: `${component.width}%`,
            height: `${component.height}%`,
            fontSize: `${component.fontSize}px`,
            color: component.color,
            textAlign: component.textAlign,
            zIndex: component.zIndex
        }"
        :class="isSelected ? 'border-2 border-blue-500' : ''"
        class="p-2 outline-none cursor-move"
        contenteditable
        @click.stop="$emit('select')"
        @blur="$emit('update', ($event.target as HTMLElement).textContent || '')"
    >
        {{ component.content }}
    </div>
</template>

<script setup lang="ts">
import type { SlideComponent } from '../../utils/types'

defineProps<{
    component: SlideComponent
    isSelected: boolean
}>()

defineEmits<{
    select: []
    update: [content: string]
}>()
</script>

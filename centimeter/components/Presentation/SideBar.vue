<template>
  <ul class="bg-[var(--bg-color)] rounded-box">
    <li v-for="item in menuItems" :key="item.id" class="rounded-4xl">
      <button
        type="button"
        class="flex flex-col items-center p-2 w-full rounded-4xl transition-colors focus:outline-none text-black"
        @click="handleClick(item)"
      >
        <component :is="item.icon" />
        {{ item.description }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FilePenLine,
  MessageSquare,
  Heart,
  PaintbrushVertical,
  LayoutTemplate,
} from 'lucide-vue-next'

const menuItems = [
  { id: 1, icon: FilePenLine, description: 'Edit' },
  { id: 2, icon: MessageSquare, description: 'Comments' },
  { id: 3, icon: Heart, description: 'Interactivity' },
  { id: 4, icon: PaintbrushVertical, description: 'Themes' },
  { id: 5, icon: LayoutTemplate, description: 'Templates' },
]

const activeId = ref<number | null>(null)

function handleClick(item: { id: number; description: string }) {
  activeId.value = item.id
  console.log('Clicked:', item.description)
}
</script>

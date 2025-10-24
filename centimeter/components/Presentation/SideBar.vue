<template>
  <div class="">
    <ul class="menu bg-[var(--background-color)] gap-3">
      <li v-for="item in menuItems" :key="item.id">
        <i class="text-xl text-black"><component :is="item.icon" /></i>
        <span class="ml-2 text-black">{{ item.description }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
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
</script>

<template>
  <div class="flex flex-col gap-3 p-4 w-fit">
    <button
      v-for="item in menuItems"
      :key="item.id"
      @click="
        () => {
          handleClick(item.id)
          $emit(`open-${item.id}-panel`)
        }
      "
      :class="[
        'flex flex-col items-center justify-center gap-2 p-4 bg-[var(--bg-color)]  rounded-2xl shadow-sm transition-all duration-200',
        'hover:bg-[var(--faded-bg-color-dark)] cursor-pointer border-[var(--gray)]',
        activeItem === item.id ? 'ring-2 ring-purple-300 shadow-md' : '',
      ]"
    >
      <component :is="item.icon" :size="24" class="text-[color:var(--text-color)]" />
      <span class="text-sm font-bold text-[color:var(--text-color)]">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, MessageSquare, Heart, Paintbrush, LayoutTemplate } from 'lucide-vue-next'

const menuItems = [
  { id: 'edit', label: 'Edit', icon: Edit },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'interactivity', label: 'Interactivity', icon: Heart },
  { id: 'themes', label: 'Themes', icon: Paintbrush },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
]

const activeItem = ref<string | null>(null)

function handleClick(id: string) {
  activeItem.value = id
  console.log(`Clicked: ${id}`)
}
</script>

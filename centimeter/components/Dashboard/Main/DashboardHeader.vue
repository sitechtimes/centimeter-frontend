<template>
  <header class="flex items-center justify-between px-6 py-4 border-b border-gray-200 w-full">
    <h1 class="text-lg font-medium text-gray-900">My presentations</h1>
    <div class="flex items-center gap-4">
      <button class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
        <Bell :size="20" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div class="flex items-center justify-center w-9 h-9 bg-purple-400 rounded-full">
        <span class="text-sm font-semibold text-white">GG</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
</script>
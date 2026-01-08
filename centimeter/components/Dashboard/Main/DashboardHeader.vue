<template>
  <header class="flex items-center justify-end px-6 py-4 border-b border-[var(--faded-bg-color)] w-full bg-[var(--bg-color)] text-[var(--text-color)]">

    <div class="flex items-center gap-4">
      <button class="relative p-2 text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors">
        <Bell :size="20" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-[var(--danger)] rounded-full"></span>
      </button>
      <div class="flex items-center justify-center w-9 h-9 bg-[var(--primary)] rounded-full">
        <span class="text-sm font-semibold text-[var(--text-color-contrast)]">GG</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
</script>
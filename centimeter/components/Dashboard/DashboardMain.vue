<template>
  <div class="min-h-screen bg-white flex-1">
    <dashboard-main-dashboard-header/>
    <main class="flex-1">
      <dashboard-main-empty-state v-if="empty" />
      <dashboard-main-default-state v-if="!empty"/>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const empty = ref(true)
</script>

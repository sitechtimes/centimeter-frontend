<template>
  <div class="min-h-screen bg-white flex-1">
    <DashboardHeader />
    <main class="flex-1">
      <EmptyState v-if="empty" />
      <DefaultState v-if="!empty" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DashboardHeader from "~/components/features/dashboard/DashboardHeader.vue";
import EmptyState from "~/components/features/dashboard/PresentationCards/EmptyState.vue";
import DefaultState from "~/components/features/dashboard/PresentationCards/DefaultState.vue";

const empty = ref(false);
</script>

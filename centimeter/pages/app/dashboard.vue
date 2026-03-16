<template>
  <div class="flex w-screen min-h-screen">
    <DashboardSideBar class="w-64 flex-shrink-0 sticky top-0 self-start h-screen" />
    <DashboardMain class="flex-1 min-w-0 w-full" />
  </div>
</template>

<script setup lang="ts">
import DashboardSideBar from "~/components/features/dashboard/SideBar.vue";
import DashboardMain from "~/components/features/dashboard/DashboardMain.vue";
</script>

<style scoped></style>

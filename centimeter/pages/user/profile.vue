<template>
  <main class="h-screen w-screen overflow-hidden flex">
    <UserProfileSideBar />
    <UserAccountSettingContainer />
  </main>
</template>

<script setup lang="ts">
import UserProfileSideBar from "~/components/UserAccountSetting/UserProfileSideBar.vue";
import UserAccountSettingContainer from "~/components/UserAccountSetting/AccountSettingContainer.vue";
definePageMeta({
  middleware: "auth",
  requiresAuth: true
});
</script>

<style scoped></style>

<template>
  <main class="h-screen w-screen overflow-hidden flex flex-row">
   <UserProfileSideBar/>
    <UserAccountSettingContainer/>
    <div>

    </div>
  </main>
</template>

<script setup lang="ts">
import UserProfileSideBar from '~/components/UserAccountSetting/UserProfileSideBar.vue';
/* definePageMeta({
  middleware: 'auth',
  requiresAuth: true
}); */
</script>

<style scoped>

</style>
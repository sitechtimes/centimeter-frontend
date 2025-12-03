<template>
<UserProfilePic/>
<ThemeToggle/>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
});
</script>

<style scoped>

</style>
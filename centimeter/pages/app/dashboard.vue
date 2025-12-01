<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
});
</script>
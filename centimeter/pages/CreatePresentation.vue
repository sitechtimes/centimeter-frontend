<template>
    <main>
        <NavBar/>
        <CreatingPresentation/>
    </main>
    
</template>

<script setup lang="ts">
import NavBar from '~/components/CreatePresentationNavBar.vue'
import CreatingPresentation from '~/components/CreatingPresentation.vue'

definePageMeta({
  middleware: 'auth',
  requiresAuth: true
});
</script>

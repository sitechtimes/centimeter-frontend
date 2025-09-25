<template>
    <div>
        <NavBar />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
// This view now serves as a container for auth-related routes
</script>

<style lang="scss" scoped>

</style>
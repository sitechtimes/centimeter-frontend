<template>
    <div>
        <img src="" alt="ProfilePicture">
        <h1>{{  }}</h1>
    </div>
    <div>
        <button>Edit Profile</button>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { ref } from 'vue';

const userstore = useUserStore()
const email = ref("")
const firstname = ref("")
const lastname = ref("")
const username = ref("")

</script>

<style scoped>

</style>
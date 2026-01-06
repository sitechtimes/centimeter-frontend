<template>
    <div class="relative flex justify-center bg-[var(--bg-color)] dark:bg-[var(--bg-color)] h-screen w-5/6">
        <header class="absolute top-0 left-0 right-0">
            <BellAndProfileIcon/>
        </header>
        <UserProfilePic/>
    </div>
</template>

<script setup lang="ts">
import BellAndProfileIcon from './BellAndProfileIcon.vue';
import UserProfilePic from './UserProfilePic.vue';
</script>

<template>
  <div class="relative overflow-y-scroll flex flex-col items-center bg-[var(--bg-color)] dark:bg-[var(--bg-color)] h-screen w-full">
    <header class="w-full h-fit p-8">
      <BellAndProfileIcon />
    </header>
    <div class="flex flex-col w-1/3 mt-6">
      <h1 class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] text-3xl">Account Settings</h1>
      <UserProfilePic />
    </div>
  </div>
</template>

<script setup lang="ts">
import BellAndProfileIcon from "./BellAndProfileIcon.vue";
import UserProfilePic from "./UserProfilePic.vue";
</script>

<template>
  <div class="relative overflow-y-scroll flex flex-col items-center bg-[var(--bg-color)] dark:bg-[var(--bg-color)] h-screen w-full">
    <header class="w-full h-fit p-8">
      <BellAndProfileIcon />
    </header>
    <div class="flex flex-col w-2/5 mt-6">
      <h1 class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] text-3xl">Account Settings</h1>
      <UserProfilePic />
    </div>
    <footer class="flex flex-col w-2/5 ">
      <br>
      <h3 class="text-xl text-[color:var(--text-color)] dark:text-[color:var(--text-color)">Log out everywhere else</h3>
      <span class="text-sm">This will log you out from all devices except the current one.</span>
      <button class="text-red-500 bg-red-100 p-3 rounded-full">Log out everywhere else</button>
      <h3 class="text-xl text-[color:var(--text-color)] dark:text-[color:var(--text-color)">Delete account</h3>
      <span class="">Your account will be permanently deleted. Are you sure?</span>
      <button class="bg-red-500 text-red-100 p-3 rounded-full">Delete Account</button>

    </footer>
  </div>
</template>

<script setup lang="ts">
import BellAndProfileIcon from "./BellAndProfileIcon.vue";
import UserProfilePic from "./UserProfilePic.vue";
</script>

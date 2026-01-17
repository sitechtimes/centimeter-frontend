<template>
  <div class="relative overflow-y-scroll flex flex-col items-center bg-[var(--bg-color)] dark:bg-[var(--bg-color)] h-screen w-full">
    <header class="w-full h-fit p-8">
      <BellAndProfileIcon />
    </header>
    <div class="flex flex-col w-2/5 mt-6 gap-10">
      <h1 class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] text-3xl">Account Settings</h1>
      <UserProfilePic />
      <EmailAndPassword />
      <Appearance />
    </div>

    <footer class="w-2/5 mt-8 py-8 border-t border-gray-200 dark:border-gray-700">
      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100">Danger zone</h2>
      <div class="px-6 py-5 flex items-center justify-between">
        <div class="pr-6">
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">Log out everywhere else</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This will log you out from all devices except the current one.</p>
        </div>
        <button class="whitespace-nowrap rounded-full border border-red-500 px-5 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">Log out</button>
      </div>
      <div class="px-6 py-5 flex items-center justify-between">
        <div class="pr-6">
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">Delete account</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account will be permanently deleted. This action cannot be undone.</p>
        </div>
        <button class="whitespace-nowrap rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">Delete account</button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Appearance from "./Appearance.vue";
import BellAndProfileIcon from "./BellAndProfileIcon.vue";
import EmailAndPassword from "./EmailAndPassword.vue";
import UserProfilePic from "./UserProfilePic.vue";
</script>

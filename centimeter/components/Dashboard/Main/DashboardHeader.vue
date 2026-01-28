<template>
  <header class="flex items-center justify-end px-6 py-4 border-b border-[var(--faded-bg-color)] w-full bg-[var(--bg-color)] text-[var(--text-color)]">

    <div class="flex items-center gap-4">
      <ThemeToggle/> 
      <button class="relative p-2 text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors">
        <Bell :size="20" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-[var(--danger)] rounded-full"></span>
      </button>
      <div @click="toggleProfileDropdown" class="flex rounded-full max-h-9 max-w-9 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] bg-[var(--primary-light)] dark:bg-[var(--primary-light)] overflow-hidden">   
        <User v-if="!isImportedAvatar" class="rounded-full h-9 w-9 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
        <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="CustomAvatar" class="h-9 w-9 rounded-full object-contain">            
      </div>
      <div v-if="profileDropdown" class="absolute top-14 right-10 bg-[color:var(--bg-color)] dark:bg-[color:var(--bg-color-contrast)] rounded-lg shadow-md">
        <button class="border-[var(--bg-color-contrast)] text-[color:var(--text-color)] cursor-pointer transition-all hover:bg-[var(--gray)]">Log Out</button>
        <br>
        <button class="border-[var(--bg-color-contrast)] text-[color:var(--text-color)] cursor-pointer transition-all hover:bg-[var(--gray)]" @click="goToAccSetting">Account Setting</button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, User } from 'lucide-vue-next'
const userStore = useUserStore()
const isImportedAvatar = ref(userStore.profilePic !== "")
const profileDropdown = ref(false)

const toggleProfileDropdown = () => {
  profileDropdown.value = !profileDropdown.value
}

const goToAccSetting = () => {
  navigateTo("/UserProfile")
}
</script>
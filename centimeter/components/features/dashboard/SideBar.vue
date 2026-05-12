<template>
  <div class="flex h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
    <div class="w-72 border-r border-[var(--faded-bg-color)] flex flex-col bg-[var(--bg-color)]">
  
      <router-link to="/" class="p-6 cursor-pointer flex items-center gap-3 hover:bg-[var(--faded-bg-color-light)]">
        <img src="/logo/logo.png" class="w-8 h-8" alt="">
      </router-link>

      <nav class="flex-1 px-4 space-y-1">


        <router-link to="/" class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] hover:bg-[var(--faded-bg-color-light)]">
        <HouseIcon/>
        Home
        </router-link>


        
        <router-link to="" class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] hover:bg-[var(--faded-bg-color-light)]">
          <UserIcon/>
          My presentations
        </router-link>


        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] hover:bg-[var(--faded-bg-color-light)]">
          <InboxIcon/>
          Shared with me
        </a>


        <div class="pt-6 pb-3">
          <p class="text-xs font-medium text-[var(--gray)] px-4 uppercase">{{ userStore.nickname }}'s team</p> 
        </div>


        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] hover:bg-[var(--faded-bg-color-light)]">
          <UsersIcon/>
          Workspace presentations
        </a>


        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] hover:bg-[var(--faded-bg-color-light)]">
          <FilePlusCornerIcon/>
          Shared templates
        </a>
      </nav>


      <div class="border-t border-[var(--faded-bg-color)] p-4 space-y-2">
        <a href="#" class="block text-xs text-[var(--faded-text-color)] hover:text-[var(--text-color)]">Templates</a>
        <a href="#" class="block text-xs text-[var(--faded-text-color)] hover:text-[var(--text-color)]">Integrations</a>
        <a href="#" class="block text-xs text-[var(--faded-text-color)] hover:text-[var(--text-color)]">Merit Academy</a>
        <a href="#" class="block text-xs text-[var(--faded-text-color)] hover:text-[var(--text-color)]">Help</a>
        <a href="#" class="block text-xs text-[var(--faded-text-color)] hover:text-[var(--text-color)]">Trash</a>
      </div>
    </div>


    <div class="flex-1 bg-[var(--faded-bg-color-light)]"></div>
  </div>
</template>

<script setup>
import {HouseIcon, UserIcon, InboxIcon, UsersIcon, FilePlusCornerIcon} from 'lucide-vue-next'
const userStore = useUserStore()
</script>

<style scoped>
  body {
  font-family: 'Newsreader', serif;
} 
</style>
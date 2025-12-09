<template>
  <div class="flex h-screen bg-white">
    <div class="w-72 border-r border-gray-200 flex flex-col">
  
      <router-link to="/" class="p-6 hover:bg-slate-50 cursor-pointer flex items-center gap-3">
        <img src="/logo/logo.png" class="w-8 h-8" alt="">
      </router-link>

      <nav class="flex-1 px-4 space-y-1">


        <router-link to="/" class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900">
        <HouseIcon/>
        Home
        </router-link>


        
        <router-link to="" class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900">
          <UserIcon/>
          My presentations
        </router-link>


        <a href="#" class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900">
          <InboxIcon/>
          Shared with me
        </a>


        <div class="pt-6 pb-3">
          <p class="text-xs font-medium text-gray-500 px-4 uppercase">Eric's team</p> 
        </div>


        <a href="#" class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900">
          <UsersIcon/>
          Workspace presentations
        </a>


        <a href="#" class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900">
          <FilePlusCornerIcon/>
          Shared templates
        </a>
      </nav>


      <div class="border-t border-gray-200 p-4 space-y-2">
        <a href="#" class="block text-sm text-gray-700 hover:text-gray-900">Templates</a>
        <a href="#" class="block text-sm text-gray-700 hover:text-gray-900">Integrations</a>
        <a href="#" class="block text-sm text-gray-700 hover:text-gray-900">Merit Academy</a>
        <a href="#" class="block text-sm text-gray-700 hover:text-gray-900">Help</a>
        <a href="#" class="block text-sm text-gray-700 hover:text-gray-900">Trash</a>
      </div>
    </div>


    <div class="flex-1 bg-gray-50"></div>
  </div>
</template>

<script setup>
import {HouseIcon, UserIcon, InboxIcon, UsersIcon, FilePlusCornerIcon} from 'lucide-vue-next'
</script>

<style scoped>

</style>
<template>
    <div class="flex justify-end">
        <Bell class="h-10 w-10 cursor-pointer border-2 rounded-full text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
        <div class="flex rounded-full max-h-10 max-w-10 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] overflow-hidden cursor-pointer">   
                    <User v-if="!isImportedAvatar" class="rounded-full h-10 w-10 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
                    <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="CustomAvatar" class="h-10 w-10 rounded-full object-contain">            
            </div>
    </div>
</template>

<script setup lang="ts">
import { Bell, User } from 'lucide-vue-next'
const userStore = useUserStore()
const isImportedAvatar = computed(() => userStore.profilePic !== "")

</script>

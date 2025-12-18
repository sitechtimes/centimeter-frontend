<template>
    <div>
        <Bell class="cursor-pointer border-2 rounded-full text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
        <div class="flex rounded-full max-h-16 max-w-16 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] overflow-hidden">   
                    <User v-if="!isImportedAvatar" class="rounded-full h-16 w-16 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
                    <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="CustomAvatar" class="h-16 w-16 rounded-full object-contain">            
            </div>
    </div>
</template>

<script setup lang="ts">
import { Bell, User } from 'lucide-vue-next'
const userStore = useUserStore()
const isImportedAvatar = computed(() => userStore.profilePic !== "")

</script>

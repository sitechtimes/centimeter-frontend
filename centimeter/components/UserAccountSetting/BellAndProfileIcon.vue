<template>
    <div class="flex justify-end">
        <Bell @click="toggleMail" class="h-10 w-10 cursor-pointer border-2 rounded-full text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
        <div v-if="isMail && !profileDropdown" class="absolute top-14 right-10 bg-[color:var(--bg-color)] dark:bg-[color:var(--bg-color-contrast)] rounded-lg shadow-md">
            <div class="p-4">
                <!-- TODO: implement mail functionality later -->
                <p class="text-sm text-[color:var(--text-color)] dark:text-[color:var(--text-color)]">No new messages</p>
            </div>
        </div>
        <div @click="toggleProfileDropdown" class="flex rounded-full max-h-10 max-w-10 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] overflow-hidden cursor-pointer">   
                <User v-if="!isImportedAvatar" class="rounded-full h-10 w-10 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
                <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="CustomAvatar" class="h-10 w-10 rounded-full object-contain">            
            </div>
        <div v-if="profileDropdown && !isMail" class="absolute top-14 right-10 bg-[color:var(--bg-color)] dark:bg-[color:var(--bg-color-contrast)] rounded-lg shadow-md">
            <button>Log Out</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Bell, User } from 'lucide-vue-next'
const userStore = useUserStore()
const isImportedAvatar = computed(() => userStore.profilePic !== "")
const isMail = ref(false)
const profileDropdown = ref(false)

const toggleMail = () => {
    isMail.value = !isMail.value
    profileDropdown.value = false
}

const toggleProfileDropdown = () => {
    profileDropdown.value = !profileDropdown.value
    isMail.value = false
}

</script>

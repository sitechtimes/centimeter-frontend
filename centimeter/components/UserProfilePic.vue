<template>
    <div class="flex justify-center bg-[var(--bg-color)] dark:bg-[var(--bg-color)] h-screen w-4/5">
    <h1 class="text-xl text-[color:var(--text-color)] dark:text-[color:var(--text-color)]">Name & Image</h1>
    
    <ChevronDown @click="changeProfileDropdown" class="w-6 h-6 cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" />

    <!-- PFP -->
    <div class="flex rounded-full max-h-16 max-w-16 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] overflow-hidden">   
            <User v-if="!isImportedAvatar" class="rounded-full h-16 w-16 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
            <img v-if="isImportedAvatar" :src="imageURL" alt="CustomAvatar" class="h-16 w-16 rounded-full object-contain">            
    </div>
    <transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">    
        <div v-if="changeAvatar">
        <label class="border-2" for="uploadAvatar">Upload Picture</label>
        <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar">
        <h1>Username</h1>
            <input type="text" placeholder="Username" ref="UsernameInput">
            <br>
            <button @click="saveProfileChanges" class="flex w-20 h-6 border-[var(--bg-color-contrast)]cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md">Save</button>
        </div>
    </transition>
        <theme-toggle/>
    </div>
    
</template>

<script setup lang="ts">
import { ChevronDown, User } from 'lucide-vue-next'

const userStore = useUserStore()
const changeAvatar = ref(false)
const isImportedAvatar = ref(false)
const imageURL = ref<string|null>(null)

const UsernameInput = ref("")

const changeProfileDropdown = () => {
    changeAvatar.value = !changeAvatar.value
}
const saveProfileChanges = () => {
    userStore.user?.username == UsernameInput.value
}
const getAvatar = async (event) => {
    const picture = event.target.files[0]
    imageURL.value = URL.createObjectURL(picture)
    changeAvatar.value = false
    isImportedAvatar.value = true

    console.log(picture)
}

</script>

<style scoped>

</style>
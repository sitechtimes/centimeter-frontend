<template>
    <div class="mt-10 w-50">

        <div class="flex flex-row">
            <h1 class="text-xl text-[color:var(--text-color)] dark:text-[color:var(--text-color)]">Name & Image</h1>
            <ChevronDown @click="changeProfileDropdown" class="w-6 h-6 m-1 ml-4 cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" />
        </div>
            
        <!-- PFP -->
        <div class="flex flex-col gap-4 mt-4 w-40">

            <div class="flex rounded-full max-h-16 max-w-16 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] overflow-hidden">   
                    <User v-if="!isImportedAvatar" class="rounded-full h-16 w-16 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
                    <img v-if="isImportedAvatar" :src="imageURL" alt="CustomAvatar" class="h-16 w-16 rounded-full object-contain">            
            </div>

                <theme-toggle/>

            <transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">    
                <div v-if="changeAvatar">
                    <div class="h-10 w-60">
                        <label class=" cursor-pointer rounded-md hover:bg-[var(--gray)] border-2 border-[var(--primary-shade-translucent)] dark:border-[var(--primary-shade-translucent)] text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" for="uploadAvatar">Upload Picture</label>
                        <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar">
                    </div>
                <h1>Username</h1>
                    <input type="text" placeholder="Username" ref="UsernameInput" class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)]">
                    <br>
                    <button @click="saveProfileChanges" class="flex w-20 h-6 border-[var(--bg-color-contrast)]cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md">Save</button>
                </div>
            </transition>

        </div>            

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
    changeAvatar.value = !changeAvatar.value
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
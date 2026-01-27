<template>
  <div class="flex flex-col relative w-full">
    <div class="flex flex-col justify-center">
      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 flex gap-5 items-center">
        Name & image
        <ChevronDown @click="changeProfileDropdown" class="w-5 h-5 cursor-pointer transition-transform duration-300 text-gray-500 dark:text-gray-400" :class="{ 'rotate-180': changeAvatar }" />
      </h2>
      <div class="flex items-center gap-3">
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Logged in as {{ userStore.user?.email }}.</p>
        <div class="mt-4 flex items-center gap-3">
          <div class="h-10 w-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
            <User v-if="!isImportedAvatar" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="Avatar" class="h-full w-full object-cover" />
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-4 w-40">

            <div class="flex rounded-full max-h-16 max-w-16 border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)] overflow-hidden">   
                    <User v-if="!isImportedAvatar" class="rounded-full h-16 w-16 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
                    <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="CustomAvatar" class="h-16 w-16 rounded-full object-contain">            
            </div>

                <theme-toggle/>

            <transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">    
                <div v-if="changeAvatar">
                    <div class="h-10 w-60">
                        <label class=" cursor-pointer rounded-md hover:bg-[var(--gray)] border-2 border-[var(--primary-shade-translucent)] dark:border-[var(--primary-shade-translucent)] text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" for="uploadAvatar">Upload Picture</label>
                        <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar">
                    </div>
                <h1>Username</h1>
                <h2>Logged in as {{ userStore.user?.email }}</h2>
                    <input type="text" placeholder="Username" ref="UsernameInput" class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)]">
                    <br>
                    <button @click="saveProfileChanges" class="flex w-20 h-6 border-[var(--bg-color-contrast)] cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md">Save</button>
                </div>
            </transition>

        </div>            

    </div>
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="changeAvatar" class="mt-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Username </label>
          <input
            type="text"
            placeholder="Enter your username"
            ref="UsernameInput"
            class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
          />
        </div>
        <div>
          <label
            for="uploadAvatar"
            class="flex items-center gap-2 w-fit cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-8 py-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
          >
            Upload picture
            <Trash class="h-4 w-4 opacity-60" />
          </label>
          <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar" />
        </div>

        <button @click="saveProfileChanges" class="rounded-full bg-gray-900 dark:bg-gray-100 px-5 py-2 text-sm font-medium text-white dark:text-gray-900 hover:opacity-90 transition">
          Save changes
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, User, Trash } from "lucide-vue-next";

const userStore = useUserStore()
const changeAvatar = ref(false)
const isImportedAvatar = computed(() => userStore.profilePic !== "")

const UsernameInput = ref("");

const changeProfileDropdown = () => {
  changeAvatar.value = !changeAvatar.value;
};
const saveProfileChanges = () => {
  userStore.user?.username == UsernameInput.value;
  UsernameInput.value = UsernameInput.value;
  changeAvatar.value = !changeAvatar.value;
};
const getAvatar = async (event) => {
    const picture = event.target.files[0]
    userStore.profilePic = URL.createObjectURL(picture)
    changeAvatar.value = false
}

</script>

<style scoped></style>

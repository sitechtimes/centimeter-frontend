<template>
  <div class="mt-10 flex flex-col items-start relative w-full">
    <div class="flex flex-col gap-2 w-full">
      <div class="flex items-center">
        <h2 class="text-xl text-[color:var(--text-color)] dark:text-[color:var(--text-color)]">Name & Image</h2>
        <ChevronDown
          @click="changeProfileDropdown"
          class="w-6 h-6 m-1 ml-4 cursor-pointer transition-all duration-500 rounded-md text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"
          :class="{ 'rotate-180 ': changeAvatar }"
        />
      </div>
      <div class="flex items-center gap-3">
        <h2 class="text-gray-400">Logged in as {{ userStore.user?.email }}.</h2>
        <div
          class="flex rounded-full max-h-10 max-w-10 overflow-hidden"
          :class="[
            {
              'border-2 border-[var(--bg-color-contrast)] dark:border-[var(--bg-color-contrast)]': !isImportedAvatar
            }
          ]"
        >
          <User v-if="!isImportedAvatar" class="rounded-full h-10 w-10 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" />
          <img v-if="isImportedAvatar" :src="userStore.profilePic" alt="CustomAvatar" class="h-10 w-10 rounded-full object-cover" />
        </div>
      </div>
      <transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="changeAvatar" class="flex flex-col w-full">
          <h3 class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)]">Username</h3>

          <input
            type="text"
            placeholder="Enter your username"
            ref="UsernameInput"
            class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] bg-gray-200 p-2 rounded-xl text-sm w-full"
          />
          <br />
          <label class="cursor-pointer flex gap-3 text-center rounded-md py-5 px-10 border-2 w-fit text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" for="uploadAvatar"
            >Upload Picture <Trash class="hover:scale-110 transition-transform duration-300"></Trash
          ></label>
          <input type="file" accept="image/*" id="uploadAvatar" hidden @change="getAvatar" />

          <button @click="saveProfileChanges" class="flex w-20 h-6 border-[var(--bg-color-contrast)]cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md">Save</button>
        </div>
      </transition>
    </div>

    <theme-toggle />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, User, Trash } from "lucide-vue-next";

const userStore = useUserStore();
const changeAvatar = ref(false);
const isImportedAvatar = ref(false);

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
  const picture = event.target.files[0];
  userStore.profilePic = URL.createObjectURL(picture);
  changeAvatar.value = false;
  isImportedAvatar.value = true;
};
</script>

<style scoped></style>

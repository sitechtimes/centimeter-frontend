<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-6 py-5">
    <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">Appearance</h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select how Mentimeter looks for you.</p>

    <!-- Segmented control -->
    <div class="mt-4 inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800 p-1" role="radiogroup">
      <button @click="toggleTheme" role="radio" class="px-4 py-2 text-sm font-medium rounded-md transition" :class="!isdark ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
        Light
      </button>

      <button
        @click="toggleTheme"
        role="radio"
        class="px-4 py-2 text-sm font-medium rounded-md transition"
        :class="isdark ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
      >
        Dark
      </button>
    </div>
  </div>

  <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
    <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">Language</h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose the language used in the interface.</p>

    <select
      v-model="language"
      class="mt-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="en">English</option>
      <option value="sv">Swedish</option>
      <option value="de">German</option>
      <option value="fr">French</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const language = ref("en");
const userStore = useUserStore();
const isdark = computed(() => userStore.theme === "dark");

function toggleTheme() {
  if (isdark.value) {
    userStore.theme = "light";
  } else if (!isdark.value) {
    userStore.theme = "dark";
  }
  document.body.classList[isdark.value ? "add" : "remove"]("dark");
  localStorage.setItem("theme", isdark.value ? "dark" : "light");
  console.log(userStore.user?.username);
}
</script>

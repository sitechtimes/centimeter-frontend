<template>
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Language</h3>
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

  <!-- Appearance -->
  <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Appearance</h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select how Mentimeter looks for you.</p>
    <button
      @click="toggleTheme"
      class="bg-[color:var(--bg-color)] hover:bg-[color:var(--faded-bg-color)] w-14 h-8 px-8 border-solid border-2 border-[color:var(--text-color)] rounded-full relative transition-all duration-300"
    >
      <img class="absolute top-0.5 left-1 h-6 transition-all duration-500" :src="isdark ? '/ui/moon.svg' : '/ui/sun.svg'" aria-hidden="true" />
    </button>
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
}
</script>

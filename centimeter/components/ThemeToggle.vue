<template>
  <button
    @click="toggleTheme"
    class="bg-[color:var(--bg-color)] hover:bg-[color:var(--faded-bg-color)] w-14 h-8 px-8 border-solid border-2 border-[color:var(--text-color)] rounded-full relative transition-all duration-300"
    :class="{ 'h-11 px-10': big }"
    :id="big ? 'big' : ''"
  >
    <img
      class="absolute top-0.5 left-1 h-6 transition-all duration-500"
      :class="{ 
        'translate-x-8': dark && !big, 
        'translate-x-10': dark && big,
        'top-1.5 h-7.5 left-1.5': big
      }"
      :src="dark ? '/ui/moon.svg' : '/ui/sun.svg'"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
type Props = {
  big?: boolean;
};
import { ref } from "vue";
defineProps<Props>();

const dark = ref(false);

function toggleTheme() {
  const wasLight = userStore.theme === "light";
  userStore.theme = wasLight ? "dark" : "light";
  dark.value = wasLight;
  document.body.classList[wasLight ? "add" : "remove"]("dark");
  localStorage.setItem("theme", userStore.theme);
}

onMounted(() => {
  dark.value = userStore.theme == "dark";
}); 
</script>



<template>
  <div class="flex flex-col items-center justify-start gap-4 w-screen h-screen">
    <NavBar :show-join-banner="showBanner" />
    <div class="flex flex-col items-center justify-center gap-2">
      <h1 class="text-3xl">Enter the code to join</h1>
      <p class="text-lg text-[color:var(--faded-text-color)]">It's on the screen in front of you</p>
    </div>

    <div class="flex gap-3 relative">
      <input
        v-for="(digit, idx) in digits"
        :key="idx"
        ref="digitRefs"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-14 h-14 text-center text-2xl rounded-md border-2 bg-base-200 focus:ring-2 focus:ring-primary transition-all duration-200"
        :class="{ 'border-primary/30 bg-transparent': digit !== '' }"
        v-model="digits[idx]"
        @focus="focusedIndex = idx"
        @input="onInput(idx, $event)"
        @keydown.backspace="onBackspace(idx)"
        autocomplete="one-time-code"
        aria-label="Digit"
      />
    </div>

    <div class="flex items-center justify-center gap-4">
      <RouterLink to="/" class="btn btn-outline btn-lg rounded-full mt-6 px-8">Back</RouterLink>
      <button
        @click="join"
        :disabled="!isComplete"
        class="btn btn-primary btn-lg rounded-full mt-6 px-8"
      >
        Join
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, nextTick } from "vue";
import NavBar from "../../components/NavBar.vue";
import { useTemplateRefsList } from '@vueuse/core';

const showBanner = ref(false);
const digits = ref<string[]>(Array(6).fill(""));
const focusedIndex = ref<number>(0);
const digitRefs = useTemplateRefsList<HTMLInputElement>();

const isComplete = computed<boolean>(() => digits.value.every((d) => d !== ""));

onBeforeMount(() => {
  const prev = sessionStorage.getItem("previousIsHome");
  showBanner.value = prev ? JSON.parse(prev) : false;
});

onMounted(() => {
  digits.value = Array(6).fill("");
  showBanner.value = false;
  nextTick(() => focusInput(0));
});

function focusInput(idx: number) {
  const el = digitRefs.value[idx];
  if (el) el.focus();
}

function onInput(idx: number, e: Event) {
  const input = e.target as HTMLInputElement;
  digits.value[idx] = input.value.replace(/\D/g, "").slice(-1);
  nextTick(() => focusInput(idx + 1));
}

function onBackspace(idx: number) {
  if (digits.value[idx] === "") {
    if (idx > 0) {
      digits.value[idx - 1] = "";
      nextTick(() => focusInput(idx - 1));
    }
  } else {
    digits.value[idx] = "";
  }
}

function join(): void {
  const code = digits.value.join("");
  if (isComplete.value) {
    console.log(code);
  }
}
</script>

<style scoped>
</style>
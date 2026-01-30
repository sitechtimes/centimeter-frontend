<template>
  <div class="max-w-2xl mx-auto p-6 bg-[var(--faded-bg-color-light)] rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-[var(--text-color)] mb-6">{{ poll.question }}</h2>

    <div class="space-y-3">
      <button
        v-for="option in poll.options"
        :key="option.id"
        @click="selectOption(option.id)"
        :disabled="hasVoted"
        :class="[
          'w-full p-4 rounded-lg text-left transition-all font-medium text-lg',
          selectedOption === option.id
            ? 'bg-[var(--primary)] text-[var(--text-color-contrast)] ring-2 ring-[var(--primary)]'
            : 'bg-[var(--bg-color)] text-[var(--text-color)] hover:bg-[var(--faded-bg-color)] hover:ring-2 hover:ring-[var(--primary)] hover:ring-opacity-50',
          hasVoted ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        {{ option.text }}
      </button>
    </div>

    <button
      v-if="!hasVoted"
      @click="submitVote"
      :disabled="!selectedOption || submitting"
      class="w-full mt-6 px-6 py-3 bg-[var(--primary)] text-[var(--text-color-contrast)] font-semibold rounded-lg hover:bg-[var(--primary-shade)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ submitting ? "Submitting..." : "Submit Vote" }}
    </button>

    <div v-if="hasVoted" class="mt-6 text-center">
      <div class="inline-block rounded-full bg-green-100 dark:bg-green-900/30 p-3">
        <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <p class="text-lg text-[var(--text-color)] opacity-70 mt-2">Vote submitted!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Poll } from "~/utils/types";

const props = defineProps<{
  poll: Poll;
  sessionCode: string;
}>();

const emit = defineEmits<{
  "vote-submitted": [optionId: string];
}>();

const selectedOption = ref<string | null>(null);
const hasVoted = ref(false);
const submitting = ref(false);

function selectOption(optionId: string) {
  if (!hasVoted.value) {
    selectedOption.value = optionId;
  }
}

async function submitVote() {
  if (!selectedOption.value || hasVoted.value || submitting.value) return;

  submitting.value = true;

  try {
    emit("vote-submitted", selectedOption.value);
    hasVoted.value = true;
  } catch (error) {
    console.error("Failed to submit vote:", error);
  } finally {
    submitting.value = false;
  }
}
</script>

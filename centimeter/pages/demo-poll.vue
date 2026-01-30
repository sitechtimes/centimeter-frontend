<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center space-y-4">
          <h1 class="text-5xl font-bold text-[var(--text-color)]">Poll Feature Demo</h1>
          <p class="text-xl text-[var(--faded-text-color)]">Interactive polling components showcase</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Participant View -->
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-[var(--text-color)]">Participant View</h2>
            <p class="text-[var(--faded-text-color)]">What participants see when voting on a poll</p>
            <PollViewer :poll="demoPoll" session-code="DEMO123" @vote-submitted="handleVoteSubmitted" />
          </div>

          <!-- Host View -->
          <div class="space-y-4">
            <h2 class="text-2xl font-bold text-[var(--text-color)]">Host View (Results)</h2>
            <p class="text-[var(--faded-text-color)]">Real-time results that hosts see</p>
            <PollResults :poll="demoPoll" :responses="demoResponses" @refresh-results="handleRefresh" />
          </div>
        </div>

        <div class="bg-[var(--faded-bg-color-light)] rounded-xl p-8 space-y-4">
          <h3 class="text-xl font-bold text-[var(--text-color)]">Features Implemented:</h3>
          <ul class="space-y-2 text-[var(--text-color)]">
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>Poll data types and state management</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>Interactive poll viewer for participants</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>Real-time results visualization with bar charts</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span> Integration with session management (join code, participants) </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 font-bold">✓</span>
              <span>API integration for poll submission and results</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PollViewer from "~/components/Poll/PollViewer.vue";
import PollResults from "~/components/Poll/PollResults.vue";
import type { Poll } from "~/utils/types";

const demoPoll = ref<Poll>({
  id: "demo-poll-1",
  question: "What is your favorite programming language?",
  type: "Multiple Choice",
  options: [
    { id: "opt-1", text: "JavaScript", votes: 0 },
    { id: "opt-2", text: "Python", votes: 0 },
    { id: "opt-3", text: "Java", votes: 0 },
    { id: "opt-4", text: "C++", votes: 0 }
  ]
});

const demoResponses = ref<Record<string, number>>({
  "opt-1": 15,
  "opt-2": 23,
  "opt-3": 8,
  "opt-4": 12
});

function handleVoteSubmitted(optionId: string) {
  // Simulate adding a vote
  demoResponses.value[optionId] = (demoResponses.value[optionId] || 0) + 1;
  console.log("Vote submitted for option:", optionId);
}

function handleRefresh() {
  console.log("Refreshing results...");
  // In a real app, this would fetch updated results from the API
}
</script>

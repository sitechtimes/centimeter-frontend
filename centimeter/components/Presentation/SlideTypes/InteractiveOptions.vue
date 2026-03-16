<template>
  <div class="grid grid-cols-2 gap-1">
    <button
      v-for="option in interactiveOptions"
      :key="option.label"
      class="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--faded-bg-color)] transition-all text-left relative group cursor-pointer font-bold"
      @click="handleClick(option)"
    >
      <component :is="option.icon" :size="20" :class="option.color" />
      <span class="text-sm font-medium text-[var(--text-color)]">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Option } from "~/utils/types";
import { BarChart3, Cloud, MessageSquare, Scale, List, Users, HelpCircle, Award, Grid2x2, Edit3, MapPin } from "lucide-vue-next";
const interactiveOptions = [
  { icon: BarChart3, label: "Multiple Choice", color: "text-blue-600" },
  { icon: Cloud, label: "Word Cloud", color: "text-red-400" },
  { icon: MessageSquare, label: "Open Ended", color: "text-pink-400" },
  { icon: Scale, label: "Scales", color: "text-indigo-600" },
  { icon: List, label: "Ranking", color: "text-green-600" },
  { icon: Users, label: "Q&A", color: "text-pink-400" },
  { icon: HelpCircle, label: "Guess the Number", color: "text-yellow-600" },
  { icon: Award, label: "100 points", color: "text-blue-600" },
  { icon: Grid2x2, label: "2 x 2 Grid", color: "text-red-500" },
  { icon: Edit3, label: "Quick Form", color: "text-yellow-600", featured: true },
  { icon: MapPin, label: "Pin on Image", color: "text-purple-600" }
];

function handleClick(option: Option): void {
  console.log("Option clicked:", option.label);
  emit("add-slide", option.label);
}

const emit = defineEmits<{
  "add-slide": [slideType: string];
}>();
</script>

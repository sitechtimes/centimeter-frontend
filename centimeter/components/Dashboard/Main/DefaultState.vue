<template>
  <div class="flex flex-col flex-1 p-4">
    <div class="flex items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-3">
        <button class="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
          <span class="text-lg">+</span>
          <span>New Menti</span>
        </button>
        <button class="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
          <span class="text-lg">+</span>
          <span>New Folder</span>
        </button>
      </div>

      <div class="flex-1 max-w-md ml-6">
        <input
          type="search"
          placeholder="Search presentations"
          class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>


    <div class="grid">
      <div class="flex flex-col items-center justify-center">
        <div class="mb-4">
            <img src="https://placehold.co/300x200" alt="" class="max-w-full h-auto rounded-md shadow-sm">
        </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center w-9 h-9 bg-purple-400 rounded-full shrink-0">
        <span class="text-sm font-semibold text-white">GG</span>
      </div>
      <div class="text-left text-lg font-semibold">My first presentation</div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { Search } from 'lucide-vue-next';
    const presentations = [
  {
    "presentation_name": "AI in Modern Healthcare",
    "host": "Dr. Sarah Thompson",
    "last_interacted": "2025-02-14T10:32:00Z"
  },
  {
    "presentation_name": "Sustainable Architecture Trends",
    "host": "Michael Reyes",
    "last_interacted": "2025-01-29T16:45:12Z"
  },
  {
    "presentation_name": "Quantum Computing 101",
    "host": "Prof. Emily Zhang",
    "last_interacted": "2024-12-08T09:15:47Z"
  },
  {
    "presentation_name": "Building Scalable Web Apps",
    "host": "Carlos Méndez",
    "last_interacted": "2025-02-01T21:03:00Z"
  },
  {
    "presentation_name": "Marketing Psychology Deep Dive",
    "host": "Aisha Karim",
    "last_interacted": "2025-02-10T14:20:30Z"
  }
]

</script>
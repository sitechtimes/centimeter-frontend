<template>
    <div class="flex flex-col flex-1">
        <div>
            <button class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
                <span>+</span>
                <span>New Menti</span>
            </button>
            <button class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
                <span>+</span>
                <span>New Folder</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
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
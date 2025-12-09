<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
      <h1 class="text-2xl font-medium text-gray-900">My presentations</h1>
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
        <div class="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          EC
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <!-- Illustration -->
        <div class="mb-12">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" 
            alt="Presentations illustration"
            class="w-64 h-48 object-cover mx-auto rounded-lg"
          />
        </div>

        <!-- Text Content -->
        <h2 class="text-2xl font-medium text-gray-900 mb-4">No presentations here yet!</h2>
        <p class="text-gray-500 text-base mb-8 leading-relaxed">
          Start creating interactive and engaging presentations to include your audience.
        </p>

        <!-- Call to Action Button -->
        <button class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
          <span>+</span>
          <span>New Menti</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Component logic here if needed
</script>

<style scoped>
/* Add any component-specific styles if needed */
</style>
<template>
  <header class="flex items-center justify-between px-4 py-2 bg-[#f9fafb] border-b border-gray-200">
    <!-- Left Section -->
    <div class="flex items-center gap-3">
      <ChevronLeft class="w-5 h-5 text-gray-700 cursor-pointer" />

      <div class="flex flex-col">
        <input
          v-model="presentationName"
          class="rounded-lg border border-gray-200 pl-2 py-0.5 mb-1 text-sm text-[color:var(--text-color)] transition-colors duration-150 hover:border-gray-300 focus:border-[color:var(--border-color)] focus:ring-1 focus:ring-[color:var(--border-color)] focus:ring-opacity-40 focus:shadow-sm outline-none"
        />
        <div class="flex items-center gap-1 text-xs text-gray-600">
          <component :is="WorkspaceIcon ?? UserRound" class="w-3 h-3 text-gray-700" />
          <span>{{ CurrentWorkspaceName || 'Workspace Name' }}</span>
        </div>
      </div>

      <button class="p-2 hover:bg-gray-200 rounded-full transition-colors ml-1">
        <Settings class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex items-center border-b-2 border-transparent">
        <button
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'create'
              ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
              : 'text-gray-700 hover:bg-gray-100 rounded-t',
          ]"
          @click="activeTab = 'create'"
        >
          Create
        </button>
        <button
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2',
            activeTab === 'results'
              ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
              : 'text-gray-700 hover:bg-gray-100 rounded-t',
          ]"
          @click="activeTab = 'results'"
        >
          Results
          <span class="text-xs text-gray-500">0</span>
        </button>
      </div>

      <div class="flex items-center gap-1 ml-4">
        <!-- <Users /> -->
        <!-- <Users /> // No users yet -->

        <button class="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <button class="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>

        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 transition-colors"
        >
          <Share2 class="w-5 h-5" />
          Share
        </button>

        <button
          class="px-5 py-2.5 text-sm font-medium text-white bg-[#5f6368] hover:bg-[#5f6368]/90 rounded-full flex items-center gap-2 transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          Present
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Share2, Plus, Eye, Settings, ChevronLeft, UserRound } from 'lucide-vue-next'
const presentationName = ref('Untitled Presentation')
const activeTab = ref('create')
</script>

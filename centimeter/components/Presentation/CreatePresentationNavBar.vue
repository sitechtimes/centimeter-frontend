<template>
  <header class="flex items-center justify-between px-4 py-2 bg-[var(--bg-color)] border-b border-[var(--faded-bg-color-dark)]">
    <div class="flex items-center gap-3">
      
      <router-link to="/app/dashboard" class="inline-flex">
        <ChevronLeft class="w-5 h-5 text-[var(--text-color)] cursor-pointer" />
      </router-link>


      <div class="flex flex-col">
        <input
          v-model="presentationName"
          class="rounded-lg border border-[var(--faded-bg-color-dark)] pl-2 py-0.5 mb-1 text-sm text-[var(--text-color)] transition-colors duration-150 hover:border-[var(--gray)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:ring-opacity-40 focus:shadow-sm outline-none bg-[var(--bg-color)]"
        />
        <div class="flex items-center gap-1 text-xs text-[var(--faded-text-color)]">
          <component :is="WorkspaceIcon ?? UserRound" class="w-3 h-3 text-[var(--text-color)]" />
          <span>{{ currentWorkspaceName }}</span>
        </div>
      </div>

      <button class="p-2 hover:bg-[var(--faded-bg-color)] rounded-full transition-colors ml-1">
        <Settings class="w-5 h-5 text-[var(--text-color)]" />
      </button>
    </div>


    <div class="flex items-center gap-2">
      <ThemeToggle/>
      <div class="flex items-center border-b-2 border-transparent">
        <button
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'create'
            ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
            : 'text-[var(--faded-text-color)] hover:bg-[var(--faded-bg-color-light)] rounded-t'"
          @click="activeTab = 'create'"
        >
          Create
        </button>

        <button
          class="px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
          :class="activeTab === 'results'
            ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
            : 'text-[var(--faded-text-color)] hover:bg-[var(--faded-bg-color-light)] rounded-t'"
          @click="activeTab = 'results'"
        >
          Results
          <span class="text-xs text-[var(--gray)]">{{ results }}</span>
        </button>
      </div>


      <div class="flex items-center gap-1 ml-4">
        <button class="p-2 hover:bg-[var(--faded-bg-color)] rounded-full transition-colors ml-1">
          <Plus class="w-5 h-5 text-[var(--text-color)]" />
        </button>

        <button class="p-2 hover:bg-[var(--faded-bg-color)] rounded-full transition-colors ml-1">
          <Eye class="w-5 h-5 text-[var(--text-color)]" />
        </button>

        <button
          class="px-4 py-2 text-sm font-medium text-[var(--text-color)] hover:bg-[var(--faded-bg-color-light)] rounded flex items-center gap-2 transition-colors"
        >
          <Share2 class="w-5 h-5" />
          Share
        </button>

     
        <button
          @click="handlePresent"
          class="px-5 py-2.5 text-sm font-medium text-[color:var(--text-color-contrast)] bg-[var(--primary)] hover:bg-[var(--primary-shade)] rounded-full flex items-center gap-2 transition-colors shadow-sm"
        >
          <Play class="w-5 h-5" />
          Present
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import { Share2, Plus, Eye, Settings, ChevronLeft, UserRound, Play } from 'lucide-vue-next'
import { useSessionStore } from '~/stores/sessionStore'
import { useRouter } from 'vue-router'

const sessionStore = useSessionStore()
const router = useRouter()

const WorkspaceIcon: Component | null = null

const presentationName = ref('Untitled Presentation')
const activeTab = ref<"create" | "results">("create");
const currentWorkspaceName = ref("Workspace Name")
const results = ref(0)

const handlePresent = async () => {
  try {
    const userStore = useUserStore();
    
    if (!userStore.isAuth) {
      console.error('User is not authenticated');
      return;
    }
    
    const session = await sessionStore.openSession(presentationName.value)
    if (session?.join_code) {
      router.push(`/session/${session.join_code}`)
    }
  } catch (error) {
    console.error('Failed to open session:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />
    <ToastContainer ref="toastContainer" />
    
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto space-y-8">
        <div class="text-center space-y-4">
          <h1 class="text-5xl font-bold text-[var(--text-color)]">{{ sessionData?.title || 'Presentation Session' }}</h1>
          <div class="flex items-center justify-center gap-4">
            <p class="text-2xl text-[var(--text-color)] opacity-80">
              Join Code: <span class="font-mono font-bold bg-[var(--primary)] text-[var(--text-color-contrast)] px-4 py-2 rounded-lg">{{ joinCode }}</span>
            </p>
            <button 
              @click="copyJoinCode"
              class="p-2 hover:bg-[var(--faded-bg-color)] rounded-lg transition-colors"
              title="Copy join code"
            >
              <Copy class="w-5 h-5 text-[var(--text-color)]" />
            </button>
          </div>
        </div>

        <div class="bg-[var(--faded-bg-color-light)] rounded-xl p-8 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-[var(--text-color)]">Participants</h2>
            <span class="text-lg text-[var(--faded-text-color)]">{{ participants.length }} joined</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" v-if="participants.length > 0">
            <div 
              v-for="participant in participants" 
              :key="participant.id"
              class="bg-[var(--bg-color)] rounded-lg p-4 text-center"
            >
              <div class="w-12 h-12 rounded-full bg-[var(--primary)] text-[var(--text-color-contrast)] flex items-center justify-center mx-auto mb-2 text-xl font-semibold">
                {{ participant.nickname.charAt(0).toUpperCase() }}
              </div>
              <p class="text-sm text-[var(--text-color)] truncate">{{ participant.nickname }}</p>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <Users class="w-16 h-16 text-[var(--faded-text-color)] mx-auto mb-4 opacity-50" />
            <p class="text-lg text-[var(--faded-text-color)]">Waiting for participants to join...</p>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button 
            @click="startPresentation"
            :disabled="participants.length === 0"
            class="px-8 py-4 text-lg font-semibold text-[var(--text-color-contrast)] bg-[var(--primary)] hover:bg-[var(--primary-shade)] rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Play class="w-6 h-6" />
            Start Presentation
          </button>
          
          <button 
            @click="endSession"
            class="px-8 py-4 text-lg font-semibold text-[var(--text-color)] bg-[var(--faded-bg-color)] hover:bg-[var(--faded-bg-color-dark)] rounded-full transition-colors"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '~/stores/sessionStore'
import { Copy, Users, Play } from 'lucide-vue-next'
import ToastContainer from '~/components/ToastContainer.vue'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const toastContainer = ref<InstanceType<typeof ToastContainer>>()

const joinCode = ref(route.params.code as string)
const sessionData = ref(sessionStore.currentSession)
const participants = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!joinCode.value) {
    router.push('/app/dashboard')
    return
  }
  
  try {
    participants.value = await sessionStore.listParticipants(joinCode.value)
  } catch (error) {
    console.error('Failed to load participants:', error)
    toastContainer.value?.add({
      title: 'Error',
      message: 'Failed to load participants'
    })
  } finally {
    loading.value = false
  }
})

const copyJoinCode = () => {
  navigator.clipboard.writeText(joinCode.value)
  toastContainer.value?.add({
    title: 'Copied!',
    message: 'Join code copied to clipboard'
  })
}

const startPresentation = () => {
  toastContainer.value?.add({
    title: 'Starting...',
    message: 'Presentation is starting'
  })
}

const endSession = () => {
  router.push('/app/dashboard')
}
</script>

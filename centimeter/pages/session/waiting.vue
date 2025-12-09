<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--bg-color)] px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-[var(--text-color)]">Waiting Room</h2>
        <p class="mt-2 text-[var(--text-color)] opacity-70">Session: {{ sessionCode }}</p>
      </div>
      
      <div v-if="!hasJoined" class="mt-8 space-y-6">
        <div>
          <label for="nickname" class="block text-sm font-medium text-[var(--text-color)] mb-2">
            Enter your nickname
          </label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            required
            maxlength="50"
            class="block w-full px-4 py-3 bg-[var(--faded-bg-color)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Your nickname"
            @keyup.enter="handleJoin"
          />
        </div>
        
        <button
          @click="handleJoin"
          :disabled="!nickname.trim() || joining"
          class="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-shade)] px-6 py-3 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ joining ? 'Joining...' : 'Join Session' }}
        </button>
        
        <div v-if="error" class="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {{ error }}
        </div>
      </div>
      
      <div v-else class="text-center space-y-4">
        <div class="inline-block rounded-full bg-green-100 dark:bg-green-900/30 p-3">
          <svg class="h-12 w-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-[var(--text-color)]">Welcome, {{ nickname }}!</h3>
        <p class="text-[var(--text-color)] opacity-70">Waiting for the session to start...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '~/stores/sessionStore'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()

const sessionCode = ref(route.query.code as string || '')
const nickname = ref('')
const joining = ref(false)
const hasJoined = ref(false)
const error = ref('')

// Redirect if no session code
onMounted(() => {
  if (!sessionCode.value) {
    router.push('/')
  }
})

const handleJoin = async () => {
  const trimmedNickname = nickname.value.trim()
  
  if (!trimmedNickname) {
    return
  }
  
  // Only join if we haven't already joined
  if (hasJoined.value || joining.value) {
    return
  }
  
  await joinSession(trimmedNickname)
}

const joinSession = async (nicknameValue: string) => {
  joining.value = true
  error.value = ''
  
  try {
    await sessionStore.joinSession(sessionCode.value, nicknameValue)
    hasJoined.value = true
  } catch (err: any) {
    error.value = err?.message || 'Failed to join session. Please try again.'
    joining.value = false
    nickname.value = '' // Clear nickname on error
  } finally {
    if (hasJoined.value) {
      joining.value = false
    }
  }
}
</script>

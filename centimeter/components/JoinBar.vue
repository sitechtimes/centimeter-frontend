<template>
  <div v-if="showBar" class="bg-[var(--primary-light)]">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between gap-4">
        <div class="w-8 flex-shrink-0"></div>
        <div class="flex items-center gap-4 flex-1 justify-center">
          <span class="text-[var(--text-color)] font-semibold whitespace-nowrap">
            Enter code to join a live Menti
          </span>
          <div class="flex items-center gap-2">
            <input
              v-model="sessionCode"
              placeholder="123456"
              type="text"
              class="bg-[var(--bg-color)] text-[var(--text-color)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent w-30"
              inputmode="numeric"
              maxlength="6"
              @keyup.enter="handleJoin"
              />
            <button
              @click="handleJoin"
              :disabled="!sessionCode.trim() || checking"
              class="bg-[var(--faded-bg-color)] text-[var(--faded-text-color)] hover:bg-[var(--primary-shade-translucent)] px-6 py-2 font-semibold rounded-3xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ checking ? 'Checking...' : 'Join' }}
            </button>
          </div>
        </div>
        <button>
          <i class="pi pi-times cursor-pointer text-[var(--text-color)]" @click="closeBar"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToastContainer from './ToastContainer.vue';
import { ref } from 'vue'
import { useSessionStore } from '~/stores/sessionStore'

const router = useRouter()
const sessionStore = useSessionStore()
const showBar = ref(true)
const sessionCode = ref('')
const checking = ref(false)
const error = ref('')
const toastContainer = ref<InstanceType<typeof ToastContainer>>();

function closeBar() {
  showBar.value = false
}

async function handleJoin() {
  if (!sessionCode.value.trim()) {
    return
  }
  
  checking.value = true
  error.value = ''
  
  try {
    await sessionStore.checkSessionStatus(sessionCode.value.trim())
    
    router.push({
      path: '/session/waiting',
      query: { code: sessionCode.value.trim() }
    })
  } catch (err: any) {
    error.value = err?.message || 'Session not found'
  } finally {
    checking.value = false
  }
}
</script>

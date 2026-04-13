<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-[var(--faded-bg-color-light)] text-[var(--text-color)]">
    <div class="text-center max-w-md">
      <h2 class="text-2xl font-semibold text-[var(--text-color)] mb-2">
        No presentations here yet!
      </h2>
      <p class="text-base text-[var(--faded-text-color)] mb-8">
        Start creating interactive and engaging presentations to include your audience.
      </p>


      <button
        @click="goToCreatePresentation"
        :disabled="isCreating"
        class="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--text-color-contrast)] font-medium rounded-full hover:bg-[var(--primary-shade)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>+</span>
        <span>{{ isCreating ? 'Creating...' : 'New Menti' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang = "ts">
import { useRouter } from 'vue-router'
import { usePresentationStore } from '~/stores/presentationStore'

const router = useRouter()
const presentationStore = usePresentationStore()
const userStore = useUserStore()
const isCreating = ref(false)

async function goToCreatePresentation() {
  if (isCreating.value) return

  if (!userStore.isAuth) {
    alert('Please log in before creating a presentation.')
    router.push('/auth/login')
    return
  }

  isCreating.value = true
  try {
    const presentation = await presentationStore.createPresentation('Untitled Presentation')
    const routeId = presentation?.presentation_code || presentation?.id

    if (routeId) {
      router.push(`/app/create/${routeId}`)
    } else {
      alert('Presentation created but no identifier was returned by the API.')
    }
  } catch (err) {
    console.error('Failed to create presentation:', err)
    const message = err instanceof Error ? err.message : 'Failed to create presentation.'
    alert(message)

    if (message.toLowerCase().includes('authenticated') || message.toLowerCase().includes('log in')) {
      router.push('/auth/login')
    }
  } finally {
    isCreating.value = false
  }
}
</script>

<style scoped>
  body {
    font-family: 'Newsreader', serif;
  } 
</style>
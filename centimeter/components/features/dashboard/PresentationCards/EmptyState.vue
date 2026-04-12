<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-[var(--faded-bg-color-light)] text-[var(--text-color)]">
    <div class="text-center max-w-md">
      <h2 class="text-2xl font-semibold text-[var(--text-color)] mb-2">
        No presentations here yet!
      </h2>
      <p class="text-base text-[var(--faded-text-color)] mb-8">
        Start creating interactive and engaging presentations to include your audience.
      </p>


      <button @click="goToCreatePresentation" class="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--text-color-contrast)] font-medium rounded-full hover:bg-[var(--primary-shade)] transition-colors">
        <span>+</span>
        <span>New Menti</span>
      </button>
    </div>
  </div>
</template>

<script setup lang = "ts">
import { useRouter } from 'vue-router'
import { usePresentationStore } from '~/stores/presentationStore'

const router = useRouter()
const presentationStore = usePresentationStore()

async function goToCreatePresentation() {
  try {
    const presentation = await presentationStore.createPresentation('Untitled Presentation')
    const code = presentation?.presentation_code ?? presentation?.id
    if (code) {
      router.push(`/app/create/${code}`)
    }
  } catch (err) {
    console.error('Failed to create presentation:', err)
  }
}
</script>

<style scoped>
  body {
    font-family: 'Newsreader', serif;
  } 
</style>
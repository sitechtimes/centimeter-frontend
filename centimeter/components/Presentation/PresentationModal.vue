<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-[var(--bg-color-contrast-translucent)] z-50"
    @click="closeModal"
  >
    <div
      @click.stop
      class="relative bg-[var(--bg-color)] rounded-3xl shadow-2xl w-[900px] h-[600px] flex items-center justify-center border border-[var(--faded-bg-color-dark)]"
    >

      <button
        class="absolute top-4 right-4 text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition"
        @click="closeModal"
      >
        ✕
      </button>


      <div class="text-center px-10">
        <h1 class="text-3xl font-bold text-[var(--primary)] mb-4">
          {{ selectedOption }}
        </h1>
        <p class="text-[var(--faded-text-color)] text-lg">
          This is your preview area for <b>{{ selectedOption }}</b>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  isVisible: boolean
  selectedOption: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function closeModal() {
  emit('close')
}
</script>

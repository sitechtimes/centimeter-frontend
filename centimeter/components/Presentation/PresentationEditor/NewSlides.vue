<template>
  <div class="relative inline-block">
    <div @click="toggleIcon" tabindex="0" role="button" class="btn m-3 rounded-4xl bg-gray-700">
      <Plus v-if="isPlus" key="'plus'" :size="20" />
      <X v-else key="'x'" :size="20" />
      <h2>New Slide</h2>
    </div>

    <ul v-if="isPlus" tabindex="-1" class="absolute left-0 mt-2 dropdown-content menu rounded-box z-50 w-96">
      <div
        class="bg-[var(--bg-color)] rounded-xl shadow-2xl w-full relative border border-[var(--faded-bg-color)]"
      >
        <div class="flex items-center justify-between p-6 border-b border-[var(--faded-bg-color)]">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-[var(--text-color)]">Interactive questions</h2>

            <button class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
              <HelpCircle :size="18" />
            </button>
          </div>

          <button
            @click="toggleIcon"
            class="text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors cursor-pointer"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="p-6 space-y-6">
          <InteractiveOptions @add-slide="forwardAddSlide"/>
          <ContentSlides @add-slide="forwardAddSlide"/>
          <QuizCompletions @add-slide ="forwardAddSlide"/>
        </div>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ContentSlides from '../SlideTypes/ContentSlides.vue'
import QuizCompletions from '../SlideTypes/QuizCompletions.vue'
import InteractiveOptions from '../SlideTypes/InteractiveOptions.vue'
import {
  HelpCircle,
  X,
  Plus,
} from 'lucide-vue-next'

const isPlus = ref(false)

function toggleIcon() { 
  isPlus.value = !isPlus.value
  console.log('Icon toggled')
}

const emits = defineEmits<{
  'add-slide': [slideType: string]
  'toggle-icon': [boolean]
}>()

function forwardAddSlide(slideType: string): void {
  emits('add-slide', slideType)
  isPlus.value = !isPlus.value
}
</script>

<style scoped></style>

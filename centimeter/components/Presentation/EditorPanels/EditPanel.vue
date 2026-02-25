<template>
  <div class="w-full max-w-xs bg-[var(--bg-color)] rounded-lg shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-[var(--text-color)]">Slide</h2>
      <button
        class="text-[var(--faded-text-color)] hover:text-[var(--text-color)]"
        @click="$emit('close')"
      >
        <X class="w-6 h-6" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-8">
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-[var(--text-color)]">Add Elements</h3>
        <button v-for="element in elements" :key="element.type"
          @click="$emit('add-component', '' + element.type)"
          class="w-full flex items-center gap-3 px-4 py-3 bg-[var(--primary)] hover:bg-[var(--primary-shade)] text-white rounded-lg transition-colors"
        >
          <component :is="element.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">Add {{element.label}}</span>
        </button>
      </div>

      <div class="space-y-3"
      @click="$emit('slide-type-dropdown')">
        <h3 class="text-sm font-semibold text-[var(--text-color)]">Question type</h3>
        <div class="relative">
          <button
            class="w-full flex items-center gap-3 px-4 py-3 bg-[var(--faded-bg-color-light)] hover:bg-[var(--faded-bg-color)] rounded-lg border border-[var(--faded-bg-color-dark)] transition-colors"
          >
            <BookPlus class="w-6 h-6 text-[var(--faded-text-color)]" />
            <span class="text-sm font-medium text-[var(--faded-text-color)]"> 
              {{ selectedSlide?.type}}
            </span> 
            <span class="ml-auto">
              <ArrowDown class="w-6 h-6 text-[var(--faded-text-color)]" />
            </span>
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <h3 class="text-sm font-semibold text-[var(--text-color)] mb-1">Image</h3>
          <p class="text-sm text-[var(--faded-text-color)]">
            We support png, gif, jpg, jpeg and svg
          </p>
        </div>
        <div
          :class="['border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--faded-bg-color-dark)] hover:border-[var(--faded-bg-color)] hover:bg-[var(--faded-bg-color-light)]']"
          @click="openFilePicker" @dragover.prevent @dragenter.prevent="isDragging = true" @dragleave="isDragging = false" @drop="dropHandler">
          <p class="text-sm text-[var(--faded-text-color)]">
            Drag and drop or
            <button class="text-[var(--primary)] hover:text-[var(--primary-shade)] font-medium"
            @click="openFilePicker">
              Click to add image
            </button>
          </p>
          <input ref="fileInput" type="file" accept="image/png,image/gif,image/jpeg,image/jpg,image/svg+xml" class="hidden" @change="onFileSelected" />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-semibold text-[var(--text-color)]">Background</h3>

        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)] font-medium">Background color</label>
          <div class="flex items-center gap-2">
            <ArrowDown class="text-black" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm text-[var(--faded-text-color)] font-medium">Background image</label>
          <div class="flex items-center gap-2">
            <ArrowDown class="text-black" />
          </div>
        </div>

        <button
          class="w-full flex items-center justify-center gap-2 py-2.5 text-[var(--faded-text-color)] text-sm font-medium hover:text-[var(--text-color)] transition-colors"
        >
          <Plus class="w-4 h-4" />
          Add
        </button>

        <button
          class="w-full text-center text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors py-2"
        >
          Reset to theme defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookPlus, X, ArrowDown, Plus, Type, Images, Shapes } from 'lucide-vue-next'
  
const elements = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'shape', label: 'Shape', icon: Shapes },
]
defineProps<{ selectedSlide?: Slide }>()
const emit = defineEmits<{ 
  close: []
  'add-component': [type: string, src?: string]
  'slide-type-dropdown': []
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

const openFilePicker = () => fileInput.value?.click()

const onFileSelected = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('add-component', 'image', reader.result as string)
  reader.readAsDataURL(file)
  ;(e.target as HTMLInputElement).value = ''
}

const isImageFile = (file: File) =>
  ['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(file.type)

const dropHandler = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file || !isImageFile(file)) return
  const reader = new FileReader()
  reader.onload = () => emit('add-component', 'image', reader.result as string)
  reader.readAsDataURL(file)
}
</script>
<template>
  <div class="w-full max-w-xs bg-[var(--faded-bg-color-light)] rounded-lg shadow-sm h-full flex flex-col">
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
        <button
          @click="$emit('add-component', 'text')"
          class="w-full flex items-center gap-3 px-4 py-3 bg-[var(--primary)] hover:bg-[var(--primary-shade)] text-white rounded-lg transition-colors"
        >
          <Type class="w-5 h-5" />
          <span class="text-sm font-medium">Add Text</span>
        </button>

      </div>

      <div class="space-y-3 relative">
        <h3 class="text-sm font-semibold text-[var(--text-color)]">Question type</h3>
        <div class="relative">
          <button
            @click.stop="showTypeDropdown = !showTypeDropdown"
            class="w-full flex items-center gap-3 px-4 py-3 bg-[var(--faded-bg-color-light)] hover:bg-[var(--faded-bg-color)] rounded-lg border border-[var(--faded-bg-color-dark)] transition-colors"
          >
            <component :is="currentTypeIcon" class="w-5 h-5" :class="currentTypeColor" />
            <span class="text-sm font-medium text-[var(--text-color)]"> 
              {{ selectedSlide?.type || 'Select type' }}
            </span> 
            <span class="ml-auto">
              <ChevronDown :class="['w-5 h-5 text-[var(--faded-text-color)] transition-transform', showTypeDropdown ? 'rotate-180' : '']" />
            </span>
          </button>

          <div v-if="showTypeDropdown" class="absolute z-50 mt-1 w-full bg-[var(--bg-color)] border border-[var(--faded-bg-color-dark)] rounded-lg shadow-lg max-h-72 overflow-y-auto">
            <div class="px-3 py-2 text-xs font-semibold text-[var(--faded-text-color)] uppercase tracking-wider">Interactive</div>
            <button v-for="opt in interactiveTypes" :key="opt.label"
              @click="selectSlideType(opt.label)"
              :class="['w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--faded-bg-color-light)] transition-colors',
                selectedSlide?.type === opt.label ? 'bg-[var(--faded-bg-color-light)]' : '']"
            >
              <component :is="opt.icon" class="w-4 h-4" :class="opt.color" />
              <span class="text-sm text-[var(--text-color)]">{{ opt.label }}</span>
              <CheckIcon v-if="selectedSlide?.type === opt.label" class="w-4 h-4 ml-auto text-[var(--primary)]" />
            </button>

            <div class="border-t border-[var(--faded-bg-color)] mx-2 my-1" />

            <div class="px-3 py-2 text-xs font-semibold text-[var(--faded-text-color)] uppercase tracking-wider">Content</div>
            <button v-for="opt in contentTypes" :key="opt.label"
              @click="selectSlideType(opt.label)"
              :class="['w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--faded-bg-color-light)] transition-colors',
                selectedSlide?.type === opt.label ? 'bg-[var(--faded-bg-color-light)]' : '']"
            >
              <component :is="opt.icon" class="w-4 h-4" :class="opt.color" />
              <span class="text-sm text-[var(--text-color)]">{{ opt.label }}</span>
              <CheckIcon v-if="selectedSlide?.type === opt.label" class="w-4 h-4 ml-auto text-[var(--primary)]" />
            </button>

            <div class="border-t border-[var(--faded-bg-color)] mx-2 my-1" />

            <div class="px-3 py-2 text-xs font-semibold text-[var(--faded-text-color)] uppercase tracking-wider">Quiz</div>
            <button v-for="opt in quizTypes" :key="opt.label"
              @click="selectSlideType(opt.label)"
              :class="['w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--faded-bg-color-light)] transition-colors',
                selectedSlide?.type === opt.label ? 'bg-[var(--faded-bg-color-light)]' : '']"
            >
              <component :is="opt.icon" class="w-4 h-4" :class="opt.color" />
              <span class="text-sm text-[var(--text-color)]">{{ opt.label }}</span>
              <CheckIcon v-if="selectedSlide?.type === opt.label" class="w-4 h-4 ml-auto text-[var(--primary)]" />
            </button>
          </div>
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
import { BookPlus, X, ArrowDown, Plus, Type, Shapes, ChevronDown, Check as CheckIcon, BarChart3, Cloud, MessageSquare, Scale, List, Users, HelpCircle, Award, Grid2x2, Edit3, MapPin, Image, Play, LayoutGrid } from 'lucide-vue-next'

const interactiveTypes = [
  { icon: BarChart3, label: 'Multiple Choice', color: 'text-blue-600' },
  { icon: Cloud, label: 'Word Cloud', color: 'text-red-400' },
  { icon: MessageSquare, label: 'Open Ended', color: 'text-pink-400' },
  { icon: Scale, label: 'Scales', color: 'text-indigo-600' },
  { icon: List, label: 'Ranking', color: 'text-green-600' },
  { icon: Users, label: 'Q&A', color: 'text-pink-400' },
  { icon: HelpCircle, label: 'Guess the Number', color: 'text-yellow-600' },
  { icon: Award, label: '100 points', color: 'text-blue-600' },
  { icon: Grid2x2, label: '2 x 2 Grid', color: 'text-red-500' },
  { icon: Edit3, label: 'Quick Form', color: 'text-yellow-600' },
  { icon: MapPin, label: 'Pin on Image', color: 'text-purple-600' },
]

const contentTypes = [
  { icon: Type, label: 'Text', color: 'text-blue-600' },
  { icon: Image, label: 'Image', color: 'text-blue-500' },
  { icon: Play, label: 'Video', color: 'text-purple-600' },
  { icon: LayoutGrid, label: 'Instructions', color: 'text-gray-600' },
]

const quizTypes = [
  { icon: Award, label: 'Select Answer', color: 'text-blue-600' },
  { icon: Type, label: 'Type Answer', color: 'text-purple-600' },
]

const allTypes = [...interactiveTypes, ...contentTypes, ...quizTypes]

const props = defineProps<{ selectedSlide?: Slide }>()
const emit = defineEmits<{ 
  close: []
  'add-component': [type: string, src?: string]
  'change-slide-type': [type: string]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const showTypeDropdown = ref(false)





const currentTypeIcon = computed(() => {
  const match = allTypes.find(t => t.label === props.selectedSlide?.type)
  return match?.icon || BookPlus
})

const currentTypeColor = computed(() => {
  const match = allTypes.find(t => t.label === props.selectedSlide?.type)
  return match?.color || 'text-[var(--faded-text-color)]'
})

const selectSlideType = (type: string) => {
  if (props.selectedSlide) {
    props.selectedSlide.type = type
  }
  showTypeDropdown.value = false
}

const onClickOutside = (e: MouseEvent) => {
  if (showTypeDropdown.value) showTypeDropdown.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

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
<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-color-contrast-translucent)] backdrop-blur-sm"
      @mousemove="onMouseMove"
      @mouseup="stopInteraction"
    >
      <div class="bg-[var(--bg-color)] rounded-2xl shadow-2xl max-w-3xl w-full mx-4 flex flex-col max-h-[90vh]">


        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200 flex-shrink-0">
          <h3 class="text-lg font-semibold text-[var(--text-color)]">Crop image</h3>
          <button @click="emit('cancel')" class="text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>


  <div class="flex-1 overflow-auto p-6 flex items-center justify-center bg-[var(--faded-bg-color-light)]">
          <div
            v-if="imageLoaded"
            ref="containerRef"
            class="relative select-none"
            :style="{ width: displayWidth + 'px', height: displayHeight + 'px' }"
          >
            <img :src="imageSrc" class="block w-full h-full rounded" draggable="false" alt="" />

   
            <div class="absolute inset-0 pointer-events-none">
              <div class="absolute bg-black/50" :style="overlayTop" />
              <div class="absolute bg-black/50" :style="overlayBottom" />
              <div class="absolute bg-black/50" :style="overlayLeft" />
              <div class="absolute bg-black/50" :style="overlayRight" />
            </div>

      
            <div
              class="absolute border-2 border-white/90 z-10"
              :style="cropBoxStyle"
              @mousedown="startDrag"
            >
        
              <div class="absolute inset-0 pointer-events-none">
                <div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                <div class="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                <div class="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                <div class="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
              </div>

       
              <div
                v-for="h in handles"
                :key="h.pos"
                class="absolute w-3.5 h-3.5 bg-white rounded-sm border border-neutral-300 shadow-sm pointer-events-auto z-20"
                :style="{ ...h.style, cursor: h.cursor }"
                @mousedown.stop="startResize($event, h.pos)"
              />
            </div>
          </div>

          <div v-else class="flex items-center justify-center h-64">
            <div class="animate-pulse text-[var(--faded-text-color)] text-sm">Loading image...</div>
          </div>
        </div>

  
        <div class="flex items-center justify-center px-6 pt-4 pb-2">
          <div class="inline-flex gap-0">
            <button
              v-for="mode in aspectModes"
              :key="mode.value"
              class="px-4 py-1.5 text-sm font-medium border transition-colors"
              :class="[
                aspectMode === mode.value
                  ? 'border-[var(--bg-color-contrast)] text-[var(--text-color)] bg-[var(--bg-color)] z-10 relative'
                  : 'border-[var(--faded-bg-color-dark)] text-[var(--faded-text-color)] hover:text-[var(--text-color)] hover:border-[var(--bg-color-contrast)] bg-[var(--bg-color)]',
                mode.value === 'perfect' ? 'rounded-l-md' : '',
                mode.value === 'square' ? 'rounded-r-md' : '',
                mode.value !== 'perfect' ? '-ml-px' : '',
              ]"
              @click="setAspectMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <div class="px-6 pt-3 pb-4">
          <div class="flex items-center gap-1.5 mb-2">
            <label class="text-sm font-medium text-[var(--text-color)]">Alt text</label>
            <button
              class="text-[var(--faded-text-color)] hover:text-[var(--text-color)] transition-colors"
              title="Alt text describes the image for audience members who are unable to see it"
            >
              <CircleHelp class="w-4 h-4" />
            </button>
          </div>
          <input
            v-model="altText"
            type="text"
            placeholder="Describe the image to audience members unable to see it"
            class="w-full px-4 py-2.5 text-sm bg-[var(--faded-bg-color-light)] rounded-lg border-0 outline-none focus:ring-2 focus:ring-[var(--faded-bg-color-dark)] placeholder-[var(--faded-text-color)] text-[var(--text-color)] transition-shadow"
          />
        </div>

   
        <div class="flex items-center justify-between px-6 py-4 border-t border-neutral-200 flex-shrink-0">
          <button
            @click="emit('back')"
            class="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[var(--text-color)] bg-[var(--bg-color)] border border-[var(--faded-bg-color-dark)] hover:bg-[var(--faded-bg-color-light)] rounded-full transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to upload
          </button>
          <button
            @click="confirmCrop"
            class="px-6 py-2.5 text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-shade)] rounded-full transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CircleHelp, ArrowLeft } from 'lucide-vue-next'

const props = defineProps<{ imageSrc: string }>()
const emit = defineEmits<{
  crop: [payload: { dataUrl: string; altText: string }]
  cancel: []
  back: []
}>()


const containerRef = ref<HTMLDivElement>()
const imageLoaded = ref(false)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const altText = ref('')

type AspectModeValue = 'perfect' | 'free-form' | 'square'

const aspectMode = ref<AspectModeValue>('free-form')
const aspectModes = [
  { label: 'Perfect', value: 'perfect' as const },
  { label: 'Free-form', value: 'free-form' as const },
  { label: 'Square', value: 'square' as const },
]


const MAX_DISPLAY = 560

const displayWidth = computed(() => {
  if (!naturalWidth.value) return 0
  const ratio = naturalWidth.value / naturalHeight.value
  return ratio >= 1 ? MAX_DISPLAY : Math.round(MAX_DISPLAY * ratio)
})

const displayHeight = computed(() => {
  if (!naturalHeight.value) return 0
  const ratio = naturalWidth.value / naturalHeight.value
  return ratio >= 1 ? Math.round(MAX_DISPLAY / ratio) : MAX_DISPLAY
})

const scale = computed(() =>
  naturalWidth.value ? displayWidth.value / naturalWidth.value : 1,
)

const cropX = ref(0)
const cropY = ref(0)
const cropW = ref(0)
const cropH = ref(0)
const MIN_CROP = 20


interface Interaction {
  type: 'drag' | 'resize'
  startMouseX: number
  startMouseY: number
  startCropX: number
  startCropY: number
  startCropW: number
  startCropH: number
  handle: string
}
const interaction = ref<Interaction | null>(null)


const cropBoxStyle = computed(() => ({
  left: `${cropX.value}px`,
  top: `${cropY.value}px`,
  width: `${cropW.value}px`,
  height: `${cropH.value}px`,
  cursor: 'move',
}))

const overlayTop = computed(() => ({
  left: '0', top: '0', right: '0',
  height: `${cropY.value}px`,
}))
const overlayBottom = computed(() => ({
  left: '0', bottom: '0', right: '0',
  height: `${displayHeight.value - cropY.value - cropH.value}px`,
}))
const overlayLeft = computed(() => ({
  left: '0',
  top: `${cropY.value}px`,
  width: `${cropX.value}px`,
  height: `${cropH.value}px`,
}))
const overlayRight = computed(() => ({
  right: '0',
  top: `${cropY.value}px`,
  width: `${displayWidth.value - cropX.value - cropW.value}px`,
  height: `${cropH.value}px`,
}))

const handles = computed(() => [
  { pos: 'nw', cursor: 'nw-resize', style: { top: '-6px', left: '-6px' } },
  { pos: 'n',  cursor: 'n-resize',  style: { top: '-6px', left: '50%', transform: 'translateX(-50%)' } },
  { pos: 'ne', cursor: 'ne-resize', style: { top: '-6px', right: '-6px' } },
  { pos: 'e',  cursor: 'e-resize',  style: { top: '50%', right: '-6px', transform: 'translateY(-50%)' } },
  { pos: 'se', cursor: 'se-resize', style: { bottom: '-6px', right: '-6px' } },
  { pos: 's',  cursor: 's-resize',  style: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' } },
  { pos: 'sw', cursor: 'sw-resize', style: { bottom: '-6px', left: '-6px' } },
  { pos: 'w',  cursor: 'w-resize',  style: { top: '50%', left: '-6px', transform: 'translateY(-50%)' } },
])


const getTargetRatio = (): number | null => {
  if (aspectMode.value === 'square') return 1
  if (aspectMode.value === 'perfect') {
    return naturalWidth.value && naturalHeight.value
      ? naturalWidth.value / naturalHeight.value
      : null
  }
  return null // free-form
}

const enforceAspectRatio = (
  x: number, y: number, w: number, h: number, anchorX: 'left' | 'right', anchorY: 'top' | 'bottom',
) => {
  const ratio = getTargetRatio()
  if (!ratio) return { x, y, w, h }


  let newW = w
  let newH = Math.round(w / ratio)

  if (newH > displayHeight.value) {
    newH = displayHeight.value
    newW = Math.round(newH * ratio)
  }
  if (newW > displayWidth.value) {
    newW = displayWidth.value
    newH = Math.round(newW / ratio)
  }

  newW = Math.max(MIN_CROP, newW)
  newH = Math.max(MIN_CROP, Math.round(newW / ratio))

  let newX = anchorX === 'left' ? x : x + w - newW
  let newY = anchorY === 'top' ? y : y + h - newH


  if (newX < 0) newX = 0
  if (newY < 0) newY = 0
  if (newX + newW > displayWidth.value) newX = displayWidth.value - newW
  if (newY + newH > displayHeight.value) newY = displayHeight.value - newH

  return { x: newX, y: newY, w: newW, h: newH }
}


onMounted(() => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    naturalWidth.value = img.naturalWidth
    naturalHeight.value = img.naturalHeight
    imageLoaded.value = true
    nextTick(resetCrop)
  }
  img.src = props.imageSrc
})


const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max)

const resetCrop = () => {
  const ratio = getTargetRatio()
  if (ratio) {

    let w = displayWidth.value
    let h = Math.round(w / ratio)
    if (h > displayHeight.value) {
      h = displayHeight.value
      w = Math.round(h * ratio)
    }
    cropW.value = w
    cropH.value = h
    cropX.value = Math.round((displayWidth.value - w) / 2)
    cropY.value = Math.round((displayHeight.value - h) / 2)
  } else {
    cropX.value = 0
    cropY.value = 0
    cropW.value = displayWidth.value
    cropH.value = displayHeight.value
  }
}

const setAspectMode = (mode: AspectModeValue) => {
  aspectMode.value = mode
  resetCrop()
}


const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  interaction.value = {
    type: 'drag',
    startMouseX: e.clientX,
    startMouseY: e.clientY,
    startCropX: cropX.value,
    startCropY: cropY.value,
    startCropW: cropW.value,
    startCropH: cropH.value,
    handle: '',
  }
}

const startResize = (e: MouseEvent, handle: string) => {
  e.preventDefault()
  interaction.value = {
    type: 'resize',
    startMouseX: e.clientX,
    startMouseY: e.clientY,
    startCropX: cropX.value,
    startCropY: cropY.value,
    startCropW: cropW.value,
    startCropH: cropH.value,
    handle,
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (!interaction.value) return
  const {
    type, startMouseX, startMouseY,
    startCropX, startCropY, startCropW, startCropH, handle,
  } = interaction.value
  const dx = e.clientX - startMouseX
  const dy = e.clientY - startMouseY

  if (type === 'drag') {
    cropX.value = clamp(startCropX + dx, 0, displayWidth.value - cropW.value)
    cropY.value = clamp(startCropY + dy, 0, displayHeight.value - cropH.value)
    return
  }

 
  let newX = startCropX
  let newY = startCropY
  let newW = startCropW
  let newH = startCropH

  if (handle.includes('e')) newW = Math.max(MIN_CROP, startCropW + dx)
  if (handle.includes('w')) { newW = Math.max(MIN_CROP, startCropW - dx); newX = startCropX + startCropW - newW }
  if (handle.includes('s')) newH = Math.max(MIN_CROP, startCropH + dy)
  if (handle.includes('n')) { newH = Math.max(MIN_CROP, startCropH - dy); newY = startCropY + startCropH - newH }


  if (newX < 0) { newW += newX; newX = 0 }
  if (newY < 0) { newH += newY; newY = 0 }
  if (newX + newW > displayWidth.value) newW = displayWidth.value - newX
  if (newY + newH > displayHeight.value) newH = displayHeight.value - newY


  const ratio = getTargetRatio()
  if (ratio) {
    const anchorX: 'left' | 'right' = handle.includes('w') ? 'right' : 'left'
    const anchorY: 'top' | 'bottom' = handle.includes('n') ? 'bottom' : 'top'
    const enforced = enforceAspectRatio(newX, newY, newW, newH, anchorX, anchorY)
    newX = enforced.x
    newY = enforced.y
    newW = enforced.w
    newH = enforced.h
  }

  cropX.value = newX
  cropY.value = newY
  cropW.value = Math.max(MIN_CROP, newW)
  cropH.value = Math.max(MIN_CROP, newH)
}

const stopInteraction = () => {
  interaction.value = null
}


const confirmCrop = () => {
  const sx = cropX.value / scale.value
  const sy = cropY.value / scale.value
  const sw = cropW.value / scale.value
  const sh = cropH.value / scale.value

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(sw)
  canvas.height = Math.round(sh)
  const ctx = canvas.getContext('2d')!

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    ctx.drawImage(
      img,
      Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh),
      0, 0, Math.round(sw), Math.round(sh),
    )
    emit('crop', { dataUrl: canvas.toDataURL('image/png'), altText: altText.value })
  }
  img.src = props.imageSrc
}
</script>

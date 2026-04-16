<template>
  <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast" appear>
      <div
        v-for="message in toasts"
        :key="message.id"
        :class="toastClasses(message.type)"
        @click="remove(message.id)"
        :style="{ ['--duration-ms']: (message.duration ?? props.defaultDuration) + 'ms' }"
      >
        <div class="flex items-start gap-3 flex-1">
          <div :class="toastIconClasses(message.type)" class="flex-shrink-0 mt-0.5">
            <svg
              v-if="message.type === 'success'"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="message.type === 'error'"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="message.type === 'warning'"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1 space-y-1 pr-3">
            <div class="font-semibold text-sm leading-tight">{{ message.title }}</div>
            <div v-if="message.message" :class="toastTextClasses(message.type)" class="text-sm leading-tight">
              {{ message.message }}
            </div>
          </div>
        </div>
        <button
          aria-label="Dismiss toast"
          :class="toastCloseButtonClasses(message.type)"
          @click.stop="remove(message.id)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div :class="toastProgressBarBgClasses(message.type)" class="absolute left-0 bottom-0 h-1 w-full rounded-b-lg overflow-hidden">
          <div :class="toastProgressBarClasses(message.type)" class="h-full progress-shrink" :style="{ animationDuration: (message.duration ?? props.defaultDuration) + 'ms', transformOrigin: 'left' }" :key="message.id + '-bar'"></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ToastItem, ToastPayload } from '~/utils/types/uiTypes';

const props = defineProps({
  position: { type: String as () => "top-right" | "top-left" | "bottom-right" | "bottom-left", default: "top-right" },
  defaultDuration: { type: Number, default: 6000 }
});

const toasts = ref<ToastItem[]>([]);

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function add(toast: ToastPayload) {
  const id = makeId();
  const item: ToastItem = {
    id,
    title: toast.title,
    message: toast.message,
    duration: toast.duration ?? props.defaultDuration,
    type: toast.type ?? 'info'
  };
  toasts.value.push(item);

  if (item.duration && item.duration > 0) {
    setTimeout(() => remove(id), item.duration);
  }
  return id;
}

function remove(id: string) {
  const index = toasts.value.findIndex((t: ToastItem) => t.id === id);
  if (index >= 0) toasts.value.splice(index, 1);
}

function toastClasses(type?: string) {
  const baseClasses = 'relative flex items-start justify-between gap-3 rounded-lg shadow-lg backdrop-blur-sm px-4 py-3 min-w-72 max-w-96 pointer-events-auto transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border';
  
  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-50 border-green-400 text-green-900 hover:bg-green-100`;
    case 'error':
      return `${baseClasses} bg-red-50 border-red-400 text-red-900 hover:bg-red-100`;
    case 'warning':
      return `${baseClasses} bg-amber-50 border-amber-400 text-amber-900 hover:bg-amber-100`;
    case 'info':
    default:
      return `${baseClasses} bg-blue-50 border-blue-400 text-blue-900 hover:bg-blue-100`;
  }
}

function toastIconClasses(type?: string) {
  switch (type) {
    case 'success':
      return 'text-green-600';
    case 'error':
      return 'text-red-600';
    case 'warning':
      return 'text-amber-600';
    case 'info':
    default:
      return 'text-blue-600';
  }
}

function toastTextClasses(type?: string) {
  switch (type) {
    case 'success':
      return 'text-green-700';
    case 'error':
      return 'text-red-700';
    case 'warning':
      return 'text-amber-700';
    case 'info':
    default:
      return 'text-blue-700';
  }
}

function toastCloseButtonClasses(type?: string) {
  const baseClasses = 'flex-shrink-0 opacity-70 hover:opacity-100 rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2';
  
  switch (type) {
    case 'success':
      return `${baseClasses} text-green-900 hover:bg-green-400 focus:ring-green-500`;
    case 'error':
      return `${baseClasses} text-red-900 hover:bg-red-400 focus:ring-red-500`;
    case 'warning':
      return `${baseClasses} text-amber-900 hover:bg-amber-400 focus:ring-amber-500`;
    case 'info':
    default:
      return `${baseClasses} text-blue-900 hover:bg-blue-400 focus:ring-blue-500`;
  }
}

function toastProgressBarBgClasses(type?: string) {
  switch (type) {
    case 'success':
      return 'bg-green-100';
    case 'error':
      return 'bg-red-100';
    case 'warning':
      return 'bg-amber-100';
    case 'info':
    default:
      return 'bg-blue-100';
  }
}

function toastProgressBarClasses(type?: string) {
  switch (type) {
    case 'success':
      return 'bg-green-300';
    case 'error':
      return 'bg-red-300';
    case 'warning':
      return 'bg-amber-300';
    case 'info':
    default:
      return 'bg-blue-300';
  }
}

defineExpose({ add, remove });
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.9);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.9);
}
.toast-enter-active {
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0, 1, 1);
}

.progress-shrink {
  animation-name: progressShrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes progressShrink {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Ensure clicks on the container are possible */
.pointer-events-auto {
  pointer-events: auto;
}
</style>

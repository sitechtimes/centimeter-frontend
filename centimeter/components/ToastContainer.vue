<template>
  <div 
    class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none"
  >
    <TransitionGroup name="toast" appear>
      <div
        v-for="message in toasts"
        :key="message.id"
        class="
          flex items-start justify-between gap-3 
          bg-red-50 border border-red-400
          text-red-900 
          rounded-lg shadow-lg backdrop-blur-sm
          px-4 py-3 min-w-72 max-w-96
          pointer-events-auto
          transition-all duration-300
          hover:shadow-xl hover:scale-[1.02] hover:bg-red-200
        "
      >
        <div class="flex-1 space-y-1">
          <div class="font-semibold text-sm leading-tight">{{ message.title }}</div>
          <div v-if="message.message" class="text-sm text-red-800 leading-tight">{{ message.message }}</div>
        </div>
        <button
          aria-label="Dismiss toast"
          class="
            flex-shrink-0 
            text-red-900 opacity-70 
            hover:opacity-100 hover:bg-red-400
            rounded-full p-1 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500
          "
          @click="remove(message.id)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { ToastItem, ToastPayload } from '../utils/types';

const props = defineProps({
  position: { type: String as () => 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left', default: 'top-right' },
  defaultDuration: { type: Number, default: 6000 },
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
</style>

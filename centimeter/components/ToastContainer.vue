<template>
  <div>
    <div
    v-for="t in toasts"
    :key="t.id"
    >
    <div class="flex-1">
        <div class="font-semibold text-sm">{{ t.title }}</div>
        <div v-if="t.message" class="text-sm mt-1">{{ t.message }}</div>
    </div>
    <button
        aria-label="Dismiss toast"
        class="ml-4 text-sm opacity-75 hover:opacity-100"
        @click="remove(t.id)"
    >
        ✕
    </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ToastItem, ToastPayload } from '../utils/types';

const props = defineProps({
  position: { type: String as () => 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left', default: 'top-right' },
  defaultDuration: { type: Number, default: 4000 },
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
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index >= 0) toasts.value.splice(index, 1);
}
defineExpose({ add, remove });
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 160ms ease;
}
</style>

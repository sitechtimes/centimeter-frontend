<template>
  <div class="bg-[var(--primary-light)] mb-16">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between gap-4">
        <div class="w-8 flex-shrink-0"></div>
        <div class="flex items-center gap-4 flex-1 justify-center">
          <span class="text-[var(--text-color)] font-semibold whitespace-nowrap">
            Enter code to join a live Centi
          </span>
          <div class="flex items-center gap-2">
            <input
              v-model="joinCode"
              @input="onInput"
              placeholder="123456"
              type="text"
              inputmode="numeric"
              maxlength="6"
              class="bg-[var(--bg-color)] text-[var(--text-color)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent w-30"
            />
            <button
              :disabled="!isValid"
              @click="onJoin"
              :class="[
                'px-6 py-2 font-semibold rounded-3xl transition-colors duration-200',
                isValid ? 'bg-[var(--faded-bg-color)] text-[var(--faded-text-color)] hover:bg-[var(--primary-shade-translucent)] cursor-pointer' : 'opacity-50 cursor-not-allowed'
              ]"
            >
              Join
            </button>
          </div>
        </div>
        <button>
          <i class="pi pi-times cursor-pointer text-[var(--text-color)]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const emit = defineEmits<{
  (e: 'join', joinCode: string): void;
}>();

const joinCode = ref<string>('');
const loading = ref(false);

const isValid = computed(() => /^\d{6}$/.test(joinCode.value));

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  joinCode.value = el.value.replace(/\D/g, '').slice(0, 6);
}

import { useUserStore } from '../stores/userStore';
const userStore = useUserStore();

async function joinActiveSession(code: string) {
  try {
    await userStore.joinSession(code);
  } catch (error) {
    console.log('Error joining session:', error);
    throw error;
  }
}

async function onJoin() {
  if (!isValid.value || loading.value) return;
  loading.value = true;
  try {
    await joinActiveSession(joinCode.value);
    emit('join', joinCode.value);
  } catch (error) {
    console.log('Failed to join session:', error);
  } finally {
    loading.value = false;
  }
}
</script>
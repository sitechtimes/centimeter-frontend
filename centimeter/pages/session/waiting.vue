<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />
    <ToastContainer ref="toastContainer" />

    <div class="container mx-auto px-4 py-12 max-w-2xl">
      <div class="space-y-8">
        <div class="text-center space-y-4">
          <h1 class="text-5xl font-bold text-[var(--text-color)]">Waiting Room</h1>
          <p class="text-xl text-[var(--text-color)] opacity-80">
            Session Code: <span class="font-semibold">{{ sessionCode }}</span>
          </p>
          <p class="text-lg text-[var(--text-color)] opacity-60">You're about to join this session. Enter your nickname below to get started!</p>
        </div>

        <div v-if="!hasJoined" class="space-y-6 mt-12">
          <div>
            <label for="nickname" class="block text-lg font-semibold text-[var(--text-color)] mb-3"> Enter your nickname </label>
            <input
              id="nickname"
              v-model="nickname"
              type="text"
              required
              maxlength="50"
              class="block w-full px-6 py-5 text-xl bg-[var(--faded-bg-color)] text-[var(--text-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Your nickname"
              @keyup.enter="handleJoin"
            />
          </div>

          <button
            @click="handleJoin"
            :disabled="!nickname.trim() || joining"
            class="w-full bg-[var(--primary)] text-white hover:bg-[var(--primary-shade)] px-8 py-5 text-xl font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {{ joining ? "Joining..." : "Join Session" }}
          </button>
        </div>

        <div v-else class="text-center space-y-6 mt-12">
          <div class="inline-block rounded-full bg-green-100 dark:bg-green-900/30 p-4">
            <svg class="h-16 w-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-[var(--text-color)]">Welcome, {{ nickname }}!</h2>
          <p class="text-xl text-[var(--text-color)] opacity-70">Waiting for the session to start...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from "~/stores/sessionStore";
import NavBar from "~/components/presentation/ui/NavBar.vue";
import ToastContainer from "~/components/presentation/ui/ToastContainer.vue";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const toastContainer = ref<InstanceType<typeof ToastContainer>>();

const sessionCode = ref((route.query.code as string) || "");
const nickname = ref("");
const joining = ref(false);
const hasJoined = ref(false);

onMounted(() => {
  if (!sessionCode.value) {
    router.push("/");
  }
});

const handleJoin = async () => {
  const trimmedNickname = nickname.value.trim();

  if (!trimmedNickname) {
    return;
  }

  if (hasJoined.value || joining.value) {
    return;
  }

  await joinSession(trimmedNickname);
};

const joinSession = async (nicknameValue: string) => {
  joining.value = true;

  try {
    await sessionStore.joinSession(sessionCode.value, nicknameValue);
    hasJoined.value = true;
  } catch (err: any) {
    toastContainer.value?.add({
      title: "Failed to join session",
      message: err?.message || "Please try again."
    });
    joining.value = false;
    nickname.value = "";
  } finally {
    if (hasJoined.value) {
      joining.value = false;
    }
  }
};
</script>

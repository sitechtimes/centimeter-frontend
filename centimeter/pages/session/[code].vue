<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />
    <ToastContainer ref="toastContainer" />

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto space-y-8">
        <div class="text-center space-y-4">
          <h1 class="text-5xl font-bold text-[var(--text-color)]">{{ sessionData?.title || "Presentation Session" }}</h1>
          <div class="flex items-center justify-center gap-4">
            <p class="text-2xl text-[var(--text-color)] opacity-80">
              Join Code: <span class="font-mono font-bold bg-[var(--primary)] text-[var(--text-color-contrast)] px-4 py-2 rounded-lg">{{ joinCode }}</span>
            </p>
            <button @click="copyJoinCode" class="p-2 hover:bg-[var(--faded-bg-color)] rounded-lg transition-colors" title="Copy join code">
              <Copy class="w-5 h-5 text-[var(--text-color)]" />
            </button>
          </div>
        </div>

        <div v-if="isLiveHost" class="bg-[var(--faded-bg-color-light)] rounded-xl p-4 md:p-6 space-y-4">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 class="text-2xl font-semibold text-[var(--text-color)]">Host Live</h2>
              <p class="text-sm text-[var(--faded-text-color)]">Use Left/Right arrow keys to change slides.</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-[var(--faded-text-color)]">Current slide ID</p>
              <p class="text-xl font-mono text-[var(--text-color)]">{{ currentSlideId || "No slide selected" }}</p>
              <p class="text-sm text-[var(--faded-text-color)] mt-1">Slide {{ hostSlides.length ? hostSlideIndex + 1 : 0 }} / {{ hostSlides.length }}</p>
            </div>
          </div>

          <div class="rounded-lg overflow-hidden border border-[var(--faded-bg-color)] h-[72vh]">
            <PresentationCanvas class="!h-full" :currentSlide="currentHostSlide" :presentationMode="true" />
          </div>
        </div>

        <div v-else class="bg-[var(--faded-bg-color-light)] rounded-xl p-8 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-[var(--text-color)]">Participants</h2>
            <span class="text-lg text-[var(--faded-text-color)]">{{ participants.length }} joined</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" v-if="participants.length > 0">
            <div v-for="participant in participants" :key="participant.id" class="bg-[var(--bg-color)] rounded-lg p-4 text-center">
              <div class="w-12 h-12 rounded-full bg-[var(--primary)] text-[var(--text-color-contrast)] flex items-center justify-center mx-auto mb-2 text-xl font-semibold">
                {{ participant.nickname.charAt(0).toUpperCase() }}
              </div>
              <p class="text-sm text-[var(--text-color)] truncate">{{ participant.nickname }}</p>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <Users class="w-16 h-16 text-[var(--faded-text-color)] mx-auto mb-4 opacity-50" />
            <p class="text-lg text-[var(--faded-text-color)]">Waiting for participants to join...</p>
          </div>

          <div class="pt-2 border-t border-[var(--faded-bg-color)]">
            <p class="text-sm text-[var(--faded-text-color)]">Current slide ID (beta):</p>
            <p class="text-lg font-mono text-[var(--text-color)]">{{ currentSlideId || "No slide selected" }}</p>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button
            v-if="!isLiveHost"
            @click="startPresentation"
            :disabled="isStartingPresentation"
            class="px-8 py-4 text-lg font-semibold text-[var(--text-color-contrast)] bg-[var(--primary)] hover:bg-[var(--primary-shade)] rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Play class="w-6 h-6" />
            {{ isStartingPresentation ? "Starting..." : "Start Presentation" }}
          </button>

          <button
            @click="endSession"
            :disabled="isEndingSession"
            class="px-8 py-4 text-lg font-semibold text-[var(--text-color)] bg-[var(--faded-bg-color)] hover:bg-[var(--faded-bg-color-dark)] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEndingSession ? "Ending..." : "End Session" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSessionStore } from "~/stores/sessionStore";
import { usePresentationStore } from "~/stores/presentationStore";
import type { SessionParticipant, SessionStatus } from "~/utils/types/sessionTypes";
import type { Slide } from "~/utils/types/presentationTypes";
import { Copy, Users, Play } from "lucide-vue-next";
import NavBar from "~/components/presentation/ui/NavBar.vue";
import ToastContainer from "~/components/presentation/ui/ToastContainer.vue";
import PresentationCanvas from "~/components/presentation/editor/PresentationCanvas.vue";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const presentationStore = usePresentationStore();
const toastContainer = ref<InstanceType<typeof ToastContainer>>();

const joinCode = ref(route.params.code as string);
const statusData = ref<SessionStatus | null>(null);
const presentationCode = computed(() => {
  const fromQuery = (route.query.presentation as string) || "";
  const fromStorage = localStorage.getItem(`centimeter.session.presentation.${joinCode.value}`) || "";
  return fromQuery || fromStorage;
});
const sessionData = ref(sessionStore.currentSession);
const participants = ref<SessionParticipant[]>([]);
const loading = ref(true);
const isEndingSession = ref(false);
const isStartingPresentation = ref(false);
const currentSlideId = ref("");
const isLiveHost = ref(false);
const hostSlides = ref<Slide[]>([]);
const hostSlideIndex = ref(0);
const pollTimerId = ref<ReturnType<typeof setInterval> | null>(null);

const currentHostSlide = computed<Slide | undefined>(() => {
  if (!hostSlides.value.length) return undefined;
  return hostSlides.value[hostSlideIndex.value];
});

onMounted(async () => {
  if (!joinCode.value) {
    router.push("/app/dashboard");
    return;
  }

  await refreshParticipants();
  await refreshSessionStatus();
  startParticipantsPolling();
});

onBeforeUnmount(() => {
  stopParticipantsPolling();
  window.removeEventListener("keydown", onHostKeyDown);
});

const copyJoinCode = () => {
  navigator.clipboard.writeText(joinCode.value);
  toastContainer.value?.add({
    title: "Copied!",
    message: "Join code copied to clipboard",
    type: 'success'
  });
};

const startPresentation = async () => {
  if (isStartingPresentation.value) return;

  if (!presentationCode.value) {
    toastContainer.value?.add({
      title: "Missing presentation",
      message: "Open this session from the editor so the presentation can be attached.",
      type: 'error'
    });
    return;
  }

  const sessionId = sessionData.value?.id || statusData.value?.id;
  if (!sessionId) {
    toastContainer.value?.add({
      title: "Missing session",
      message: "Session ID not found. Please reopen the session from the editor.",
      type: 'error'
    });
    return;
  }

  isStartingPresentation.value = true;
  try {
    await presentationStore.attachPresentationToSession(presentationCode.value, sessionId);

    const presentation = await presentationStore.getPresentation(presentationCode.value);
    const incomingSlides = Array.isArray(presentation?.data?.slides) ? presentation.data.slides : [];
    hostSlides.value = incomingSlides;

    const activeSlide = presentation?.data?.active_slide;
    const firstSlideId = presentation?.data?.slides?.[0]?.id;
    const slideIdToBroadcast = activeSlide || firstSlideId;

    if (slideIdToBroadcast) {
      await presentationStore.changeActiveSlide(presentationCode.value, slideIdToBroadcast);
      currentSlideId.value = slideIdToBroadcast;
      const foundIndex = hostSlides.value.findIndex((slide) => slide.id === slideIdToBroadcast);
      hostSlideIndex.value = foundIndex >= 0 ? foundIndex : 0;
      localStorage.setItem(`centimeter.session.activeSlide.${joinCode.value}`, slideIdToBroadcast);
    }

    localStorage.setItem(`centimeter.session.presentationData.${joinCode.value}`, JSON.stringify(presentation));

    isLiveHost.value = true;
    window.addEventListener("keydown", onHostKeyDown);

    toastContainer.value?.add({
      title: "Live session started",
      message: "Participants will now receive live session updates.",
      type: 'success'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start presentation";
    toastContainer.value?.add({
      title: "Failed to start",
      message,
      type: 'error'
    });
  } finally {
    isStartingPresentation.value = false;
  }
};

function onHostKeyDown(event: KeyboardEvent): void {
  if (!isLiveHost.value) return;
  if (!hostSlides.value.length) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    navigateHostBy(1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    navigateHostBy(-1);
  }
}

function navigateHostBy(delta: number): void {
  const next = Math.max(0, Math.min(hostSlides.value.length - 1, hostSlideIndex.value + delta));
  if (next === hostSlideIndex.value) return;
  void broadcastSlideByIndex(next);
}

async function broadcastSlideByIndex(index: number): Promise<void> {
  const slide = hostSlides.value[index];
  if (!slide?.id || !presentationCode.value) return;

  try {
    await presentationStore.changeActiveSlide(presentationCode.value, slide.id);
    hostSlideIndex.value = index;
    currentSlideId.value = slide.id;
    localStorage.setItem(`centimeter.session.activeSlide.${joinCode.value}`, slide.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change slide";
    toastContainer.value?.add({ title: "Slide change failed", message, type: 'error' });
  }
}

async function refreshParticipants(showErrorToast: boolean = true): Promise<void> {
  try {
    participants.value = await sessionStore.listParticipants(joinCode.value);
  } catch (error) {
    console.error("Failed to load participants:", error);
    if (showErrorToast) {
      toastContainer.value?.add({
        title: "Error",
        message: "Failed to load participants",
        type: 'error'
      });
    }
  } finally {
    loading.value = false;
  }
}

async function refreshSessionStatus(): Promise<void> {
  try {
    statusData.value = await sessionStore.checkSessionStatus(joinCode.value);

    if (statusData.value?.id && !sessionData.value?.id) {
      sessionData.value = {
        id: String(statusData.value.id),
        join_code: statusData.value.join_code || joinCode.value,
        title: statusData.value.title || "Presentation Session"
      };
    }
  } catch (error) {
    console.error("Failed to load session status:", error);
  }
}

function startParticipantsPolling(): void {
  stopParticipantsPolling();
  pollTimerId.value = setInterval(() => {
    refreshParticipants(false);
  }, 3000);
}

function stopParticipantsPolling(): void {
  if (pollTimerId.value) {
    clearInterval(pollTimerId.value);
    pollTimerId.value = null;
  }
}

const endSession = async () => {
  if (isEndingSession.value) return;

  isEndingSession.value = true;
  stopParticipantsPolling();

  try {
    await sessionStore.endSession(joinCode.value);

    toastContainer.value?.add({
      title: "Session Ended",
      message: "The session has been successfully closed",
      type: 'success'
    });

    if (presentationCode.value) {
      router.push(`/app/create/${presentationCode.value}`);
    } else {
      router.push("/app/dashboard");
    }
  } catch (error) {
    console.error("Failed to end session:", error);
    toastContainer.value?.add({
      title: "Error",
      message: "Failed to end session. Please try again.",
      type: 'error'
    });
    isEndingSession.value = false;
  }
};
</script>

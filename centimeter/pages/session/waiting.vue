<template>
  <div class="min-h-screen w-screen bg-[var(--bg-color)]">
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
import type { SessionParticipant, ParticipantPresencePayload } from "~/utils/types/sessionTypes";
import ToastContainer from "~/components/Presentation/ui/ToastContainer.vue";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const toastContainer = ref<InstanceType<typeof ToastContainer>>();

const sessionCode = ref((route.query.code as string) || "");
const nickname = ref("");
const joining = ref(false);
const hasJoined = ref(false);
const heartbeatTimerId = ref<ReturnType<typeof setInterval> | null>(null);
const joinedNickname = ref("");
const sessionSocket = ref<WebSocket | null>(null);
const skipLeaveOnUnmount = ref(false);
const statusPollTimerId = ref<ReturnType<typeof setInterval> | null>(null);

function sessionJoinStorageKey(code: string): string {
  return `centimeter.session.joined.${code}`;
}

function sessionPresentationStorageKey(code: string): string {
  return `centimeter.session.presentationData.${code}`;
}

function sessionActiveSlideStorageKey(code: string): string {
  return `centimeter.session.activeSlide.${code}`;
}

function restoreJoinedParticipant(): void {
  const code = sessionCode.value;
  if (!code) return;

  const savedNickname = localStorage.getItem(sessionJoinStorageKey(code));
  if (!savedNickname) return;

  nickname.value = savedNickname;
  joinedNickname.value = savedNickname;
  hasJoined.value = true;
  startHeartbeat();
}

onMounted(() => {
  if (!sessionCode.value) {
    router.push("/");
    return;
  }

  connectSessionSocket();
  restoreJoinedParticipant();
  startStatusPolling();
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(async () => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  disconnectSessionSocket();
  stopStatusPolling();
  stopHeartbeat();
  if (!skipLeaveOnUnmount.value) {
    await leaveIfJoined();
  }
});

onBeforeRouteLeave(async (to) => {
  const navigatingToLive = to.path === "/session/live";
  skipLeaveOnUnmount.value = navigatingToLive;

  disconnectSessionSocket();
  stopStatusPolling();
  stopHeartbeat();

  if (!navigatingToLive) {
    await leaveIfJoined();
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
    joinedNickname.value = nicknameValue;
    hasJoined.value = true;
    localStorage.setItem(sessionJoinStorageKey(sessionCode.value), nicknameValue);

    await fetchParticipants();

    startHeartbeat();
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

function getPresencePayload(): ParticipantPresencePayload | null {
  if (!sessionCode.value || !joinedNickname.value) return null;
  return {
    join_code: sessionCode.value,
    nickname: joinedNickname.value
  };
}

async function sendHeartbeat(): Promise<void> {
  const payload = getPresencePayload();
  if (!payload) return;

  try {
    await sessionStore.sendHeartbeat(payload);
  } catch (error) {
    console.error("Heartbeat failed:", error);

    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("not found") || message.includes("404")) {
      stopHeartbeat();
      hasJoined.value = false;
      joinedNickname.value = "";
      localStorage.removeItem(sessionJoinStorageKey(sessionCode.value));
    }
  }
}

function startHeartbeat(): void {
  stopHeartbeat();
  sendHeartbeat();
  heartbeatTimerId.value = setInterval(sendHeartbeat, 3000);
}

function stopHeartbeat(): void {
  if (heartbeatTimerId.value) {
    clearInterval(heartbeatTimerId.value);
    heartbeatTimerId.value = null;
  }
}

async function leaveIfJoined(): Promise<void> {
  const payload = getPresencePayload();
  if (!payload || !hasJoined.value) return;

  try {
    await sessionStore.leaveParticipant(payload);
  } catch (error) {
    console.error("Failed to leave session:", error);
  } finally {
    hasJoined.value = false;
    joinedNickname.value = "";
    localStorage.removeItem(sessionJoinStorageKey(sessionCode.value));
  }
}

function handleBeforeUnload(): void {
  const payload = getPresencePayload();
  if (!payload || !hasJoined.value) return;

  try {
    const endpoint = `${import.meta.env.VITE_BACKEND_URL}/participants/leave/`;
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
  } catch {}
}

function buildSessionSocketUrl(code: string): string {
  const baseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
  if (!baseUrl) return "";

  const wsBase = baseUrl.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://");

  return `${wsBase}/ws/session/${code}/`;
}

function connectSessionSocket(): void {
  if (!sessionCode.value || sessionSocket.value) return;

  const socketUrl = buildSessionSocketUrl(sessionCode.value);
  if (!socketUrl) return;

  const socket = new WebSocket(socketUrl);
  sessionSocket.value = socket;

  socket.onmessage = (event: MessageEvent) => {
    let payload: any;
    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }

    const eventName = payload?.event;
    const data = payload?.data || {};

    if (eventName === "presentation_attached") {
      const presentationPayload = data?.presentation;
      const slideId = presentationPayload?.data?.active_slide || "";
      if (presentationPayload) {
        localStorage.setItem(sessionPresentationStorageKey(sessionCode.value), JSON.stringify(presentationPayload));
      }
      if (slideId) {
        localStorage.setItem(sessionActiveSlideStorageKey(sessionCode.value), slideId);
      }
      skipLeaveOnUnmount.value = true;
      router.push({ path: "/session/live", query: { code: sessionCode.value, slide: slideId } });
    }

    if (eventName === "slide_changed") {
      const slideId = data?.active_slide || "";
      if (slideId) {
        localStorage.setItem(sessionActiveSlideStorageKey(sessionCode.value), slideId);
      }
      skipLeaveOnUnmount.value = true;
      router.push({ path: "/session/live", query: { code: sessionCode.value, slide: slideId } });
    }

    if (eventName === "presentation_updated") {
      const presentationPayload = data?.presentation;
      const slideId = presentationPayload?.data?.active_slide || "";
      if (presentationPayload) {
        localStorage.setItem(sessionPresentationStorageKey(sessionCode.value), JSON.stringify(presentationPayload));
      }
      if (slideId) {
        localStorage.setItem(sessionActiveSlideStorageKey(sessionCode.value), slideId);
      }
      skipLeaveOnUnmount.value = true;
      router.push({ path: "/session/live", query: { code: sessionCode.value, slide: slideId } });
    }
  };

  socket.onclose = () => {
    sessionSocket.value = null;
  };
}

function routeToLiveFromStatus(status: SessionStatus): void {
  const presentation = status.presentation;
  if (!presentation) return;

  const slideId = presentation.active_slide || "";
  if (presentation) {
    localStorage.setItem(
      sessionPresentationStorageKey(sessionCode.value),
      JSON.stringify({
        data: {
          slides: (presentation.slides || []) as Slide[],
          active_slide: slideId || null
        }
      })
    );
  }
  if (slideId) {
    localStorage.setItem(sessionActiveSlideStorageKey(sessionCode.value), slideId);
  }

  skipLeaveOnUnmount.value = true;
  router.push({ path: "/session/live", query: { code: sessionCode.value, slide: slideId } });
}

async function pollSessionStatus(): Promise<void> {
  if (!sessionCode.value || !hasJoined.value) return;

  try {
    const status = await sessionStore.checkSessionStatus(sessionCode.value);
    if (status?.presentation) {
      routeToLiveFromStatus(status);
    }
    await fetchParticipants();
  } catch (error) {
    console.error("Failed to poll session status:", error);
  }
}

function startStatusPolling(): void {
  stopStatusPolling();
  statusPollTimerId.value = setInterval(pollSessionStatus, 3000);
}

function stopStatusPolling(): void {
  if (statusPollTimerId.value) {
    clearInterval(statusPollTimerId.value);
    statusPollTimerId.value = null;
  }
}

function disconnectSessionSocket(): void {
  if (sessionSocket.value) {
    sessionSocket.value.close();
    sessionSocket.value = null;
  }
}

const participants = ref<SessionParticipant[]>([]);

const fetchParticipants = async () => {
  try {
    participants.value = await sessionStore.listParticipants(sessionCode.value);
  } catch (error) {
    console.error("Failed to fetch participants:", error);
  }
};

</script>

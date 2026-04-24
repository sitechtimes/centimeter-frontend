<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />
    <ToastContainer ref="toastContainer" />

    <div class="container mx-auto px-4 py-12 max-w-3xl">
      <div class="bg-[var(--faded-bg-color-light)] rounded-xl p-4 md:p-6 space-y-6">
        <div class="text-center space-y-3">
          <h1 class="text-4xl font-bold text-[var(--text-color)]">Live Session</h1>
          <p class="text-lg text-[var(--faded-text-color)]">Session code: {{ sessionCode }}</p>
        </div>

        <div class="rounded-lg bg-[var(--bg-color)] border border-[var(--faded-bg-color)] p-4 md:p-6 space-y-3">
          <p class="text-sm text-[var(--faded-text-color)]">Current slide</p>
          <p class="text-2xl font-mono text-[var(--text-color)]">{{ currentSlideId || "No slide selected" }}</p>

          <p class="text-sm text-[var(--faded-text-color)]">Current session</p>
          <p class="text-lg font-mono text-[var(--text-color)]">{{ sessionIdentifier }}</p>

          <p class="text-sm text-[var(--faded-text-color)]">Host</p>
          <p class="text-lg text-[var(--text-color)]">{{ hostName || "Unknown" }}</p>

          <p class="text-sm text-[var(--faded-text-color)]">Presentation status</p>
          <p class="text-lg text-[var(--text-color)]">{{ presentationStatus }}</p>
        </div>

        <div class="rounded-lg overflow-hidden border border-[var(--faded-bg-color)] h-[70vh]">
          <PresentationCanvas 
            class="!h-full" 
            :currentSlide="currentSlide" 
            :presentationMode="true" 
            :sessionJoinCode="sessionCode"
            :nickname="nickname"
            :activePollId="activePollId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "~/components/Presentation/ui/NavBar.vue";
import ToastContainer from "~/components/Presentation/ui/ToastContainer.vue";
import PresentationCanvas from "~/components/Presentation/editor/PresentationCanvas.vue";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const toastContainer = ref<InstanceType<typeof ToastContainer>>();
const sessionCode = ref((route.query.code as string) || "");
const nickname = ref("");
const currentSlideId = ref((route.query.slide as string) || "");
const sessionIdentifier = ref("");
const hostName = ref("");
const presentationStatus = ref("open");
const slides = ref<Slide[]>([]);
const sessionSocket = ref<WebSocket | null>(null);
const heartbeatTimerId = ref<ReturnType<typeof setInterval> | null>(null);
const statusPollTimerId = ref<ReturnType<typeof setInterval> | null>(null);
const activePollId = ref<number | undefined>(undefined)

async function fetchActivePoll(): Promise<void> {
  if (!currentSlide.value || currentSlide.value.type !== 'Multiple Choice') {
    activePollId.value = undefined
    return
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/polls/${sessionCode.value}/active/`
  )
  const body = await response.json()
  activePollId.value = body?.active_poll?.id ?? undefined

  const backendOptions = body?.active_poll?.options ?? []
  backendOptions.forEach((backendOpt: any, i: number) => {
    const localOpt = currentSlide.value?.pollsComponents?.options?.[i]
    if (localOpt) {
      localOpt.backendId = backendOpt.id
    }
  })
}

const currentSlide = computed<Slide | undefined>(() => {
  if (!slides.value.length) return undefined;
  const matched = slides.value.find((slide) => slide.id === currentSlideId.value);
  return matched || slides.value[0];
});

watch(currentSlide, () => {
  void fetchActivePoll()
}, { immediate: true })

function sessionJoinStorageKey(code: string): string {
  return `centimeter.session.joined.${code}`;
}

function sessionPresentationStorageKey(code: string): string {
  return `centimeter.session.presentationData.${code}`;
}

function sessionActiveSlideStorageKey(code: string): string {
  return `centimeter.session.activeSlide.${code}`;
}

function getJoinedNickname(): string {
  return localStorage.getItem(sessionJoinStorageKey(sessionCode.value)) || "";
}

function restorePresentationState(): void {
  const raw = localStorage.getItem(sessionPresentationStorageKey(sessionCode.value));
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    const dataSlides = Array.isArray(parsed?.data?.slides) ? parsed.data.slides : [];
    slides.value = dataSlides;
    const activeSlideFromData = parsed?.data?.active_slide || "";
    const activeSlideFromStorage = localStorage.getItem(sessionActiveSlideStorageKey(sessionCode.value)) || "";
    currentSlideId.value = currentSlideId.value || activeSlideFromData || activeSlideFromStorage;
  } catch {}
}

function applyStatusPresentation(status: any): void {
  const presentation = status?.presentation;
  if (!presentation) return;

  const statusSlides = Array.isArray(presentation.slides) ? presentation.slides : [];
  if (statusSlides.length) {
    slides.value = statusSlides;
  }

  const statusActiveSlide = presentation.active_slide || "";
  if (statusActiveSlide) {
    currentSlideId.value = statusActiveSlide;
    localStorage.setItem(sessionActiveSlideStorageKey(sessionCode.value), statusActiveSlide);
  }

  localStorage.setItem(sessionPresentationStorageKey(sessionCode.value), JSON.stringify({ data: { slides: statusSlides, active_slide: statusActiveSlide || null } }));
}

async function ensureSlideExists(slideId: string): Promise<void> {
  const exists = slides.value.some((slide) => slide.id === slideId);
  if (exists) return;

  try {
    const status = await sessionStore.checkSessionStatus(sessionCode.value);
    applyStatusPresentation(status);
  } catch (error) {
    console.error("Failed to sync slide data after broadcast:", error);
  }
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

    if (eventName === "slide_changed") {
      currentSlideId.value = data?.active_slide || "";
      if (currentSlideId.value) {
        localStorage.setItem(sessionActiveSlideStorageKey(sessionCode.value), currentSlideId.value);
        void ensureSlideExists(currentSlideId.value);
      }
    }

    if (eventName === "presentation_updated") {
      const presentationPayload = data?.presentation;
      if (presentationPayload) {
        localStorage.setItem(sessionPresentationStorageKey(sessionCode.value), JSON.stringify(presentationPayload));
        slides.value = Array.isArray(presentationPayload?.data?.slides) ? presentationPayload.data.slides : slides.value;
      }
      currentSlideId.value = presentationPayload?.data?.active_slide || currentSlideId.value;
    }

    if (eventName === "presentation_attached") {
      const presentationPayload = data?.presentation;
      if (presentationPayload) {
        localStorage.setItem(sessionPresentationStorageKey(sessionCode.value), JSON.stringify(presentationPayload));
        slides.value = Array.isArray(presentationPayload?.data?.slides) ? presentationPayload.data.slides : slides.value;
      }
      currentSlideId.value = presentationPayload?.data?.active_slide || currentSlideId.value;
    }
  };

  socket.onclose = () => {
    sessionSocket.value = null;
  };
}

function disconnectSessionSocket(): void {
  if (sessionSocket.value) {
    sessionSocket.value.close();
    sessionSocket.value = null;
  }
}

async function sendHeartbeat(): Promise<void> {
  const nickname = getJoinedNickname();
  if (!sessionCode.value || !nickname) return;

  try {
    await sessionStore.sendHeartbeat({
      join_code: sessionCode.value,
      nickname
    });
  } catch (error) {
    console.error("Heartbeat failed:", error);
  }
}

async function refreshStatus(): Promise<void> {
  if (!sessionCode.value) return;
  try {
    const status = await sessionStore.checkSessionStatus(sessionCode.value);
    sessionIdentifier.value = String(status?.id || status?.join_code || sessionCode.value);
    hostName.value = status?.host_name || "";
    presentationStatus.value = status?.is_active ? "open" : "closed";
    applyStatusPresentation(status);
  } catch (error) {
    console.error("Failed to refresh session status:", error);
  }
}

function startStatusPolling(): void {
  stopStatusPolling();
  refreshStatus();
  statusPollTimerId.value = setInterval(refreshStatus, 3000);
}

function stopStatusPolling(): void {
  if (statusPollTimerId.value) {
    clearInterval(statusPollTimerId.value);
    statusPollTimerId.value = null;
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

async function leaveSession(): Promise<void> {
  const nickname = getJoinedNickname();
  if (!sessionCode.value || !nickname) return;

  try {
    await sessionStore.leaveParticipant({
      join_code: sessionCode.value,
      nickname
    });
    localStorage.removeItem(sessionJoinStorageKey(sessionCode.value));
  } catch (error) {
    console.error("Failed to leave session:", error);
  }
}

onMounted(() => {
  if (!sessionCode.value) {
    router.push("/");
    return;
  }

  if (!getJoinedNickname()) {
    router.push({ path: "/session/waiting", query: { code: sessionCode.value } });
    return;
  }

  nickname.value = getJoinedNickname();
  restorePresentationState();
  connectSessionSocket();
  startHeartbeat();
  startStatusPolling();
});

onBeforeUnmount(async () => {
  disconnectSessionSocket();
  stopHeartbeat();
  stopStatusPolling();
  await leaveSession();
});

onBeforeRouteLeave(async () => {
  disconnectSessionSocket();
  stopHeartbeat();
  stopStatusPolling();
  await leaveSession();
});
</script>

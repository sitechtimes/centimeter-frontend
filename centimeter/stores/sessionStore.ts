import { apiCall } from "~/utils/apiCall";
import type {
  JoinSessionResponse,
  ParticipantPresencePayload,
  SessionParticipant,
  SessionStatus,
} from "../utils/types/sessionTypes";

export const useSessionStore = defineStore("sessionStore", () => {
  const currentSession = ref<JoinSessionResponse | null>(null);
  const isInSession = ref(false);

  function normalizeSessionTitle(title: string): string {
    const trimmed = (title || "").trim();
    const fallback = "Live Session";
    return (trimmed || fallback).slice(0, 20);
  }

  async function checkSessionStatus(code: string): Promise<SessionStatus | null> {
    const { ok, data } = await apiCall<SessionStatus>(
      import.meta.env.VITE_BACKEND_URL + `/session/${code}/status/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!ok) {
      throw new Error("Session not found");
    }
    return (data ?? null) as SessionStatus | null;
  }

  async function joinSession(join_code: string, nickname: string) {
    const { ok, status, data } = await apiCall<JoinSessionResponse | Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/session/join/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join_code, nickname })
      }
    );
    if (!ok) {
      throw new Error(`Failed to join session (HTTP ${status})`);
    }

    const sessionData = data as JoinSessionResponse | undefined
    currentSession.value = sessionData ?? null;
    isInSession.value = true;
    return sessionData;
  }

  async function openSession(title: string) {
    const userStore = useUserStore();
    const token = userStore.user?.access
    if (!token) {
      throw new Error("You are not authenticated. Please log in again.");
    }

    const normalizedTitle = normalizeSessionTitle(title)

    const { ok, status, data } = await apiCall<JoinSessionResponse | Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/session/open/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: normalizedTitle })
      }
    );
    if (!ok) {
      if (status === 401) {
        userStore.logOut()
        throw new Error("Your login session expired. Please log in again.")
      }

      throw new Error(`Failed to open session (HTTP ${status})`)
    }

    const sessionData = data as JoinSessionResponse | undefined
    if (!sessionData?.join_code) {
      throw new Error("Session created but response payload was invalid.")
    }

    currentSession.value = sessionData;
    isInSession.value = true;
    return sessionData;
  }
  
  async function endSession(sessionCode: string) {
    const userStore = useUserStore();
    const token = userStore.user?.access;
    
    const { ok } = await apiCall(
      import.meta.env.VITE_BACKEND_URL + `/session/${sessionCode}/close/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ''
        }
      }
    );
    
    if (!ok) {
      throw new Error("Failed to end session");
    }
    
    currentSession.value = null;
    isInSession.value = false;
  }
  async function listParticipants(code: string): Promise<SessionParticipant[]> {
    const { ok, data } = await apiCall<SessionParticipant[]>(
      import.meta.env.VITE_BACKEND_URL + `/participants/${code}/list/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!ok) {
      throw new Error("Failed to fetch participants");
    }
    return data ?? [];
  }

  async function sendHeartbeat(payload: ParticipantPresencePayload) {
    const { ok, status, data } = await apiCall<Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/participants/heartbeat/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (!ok) {
      throw new Error(`Failed to send heartbeat (HTTP ${status})`)
    }
  }

  async function leaveParticipant(payload: ParticipantPresencePayload) {
    const { ok, status } = await apiCall<Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/participants/leave/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (!ok) {
      throw new Error(`Failed to leave session (HTTP ${status})`)
    }
  }

  function leaveSession() {
    currentSession.value = null;
    isInSession.value = false;
  }
  return {
    currentSession,
    isInSession,
    checkSessionStatus,
    joinSession,
    openSession,
    listParticipants,
    sendHeartbeat,
    leaveParticipant,
    leaveSession,
    endSession,
  };


}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  }
});

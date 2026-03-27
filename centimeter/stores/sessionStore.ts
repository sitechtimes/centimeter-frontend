import { apiCall } from "~/utils/apiCall";
import type { JoinSessionResponse, SessionStatus } from "../utils/types/sessionTypes";

export const useSessionStore = defineStore("sessionStore", () => {
  const currentSession = ref<JoinSessionResponse | null>(null);
  const isInSession = ref(false);

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
    const { ok, data } = await apiCall<JoinSessionResponse>(
      import.meta.env.VITE_BACKEND_URL + "/session/join/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join_code, nickname })
      }
    );
    if (!ok) {
      throw new Error("Failed to join session");
    }
    currentSession.value = data ?? null;
    isInSession.value = true;
    return data;
  }

  async function openSession(title: string) {
    const userStore = useUserStore();
    const token = userStore.user?.access
    const { ok, data } = await apiCall<JoinSessionResponse>(
      import.meta.env.VITE_BACKEND_URL + "/session/open/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ title })
      }
    );
    if (!ok) {
      throw new Error("Failed to open session");
    }
    currentSession.value = data ?? null;
    isInSession.value = true;
    return data;
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
  async function listParticipants(code: string) {
    const { ok, data } = await apiCall<any[]>(
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

  function leaveSession() {
    currentSession.value = null;
    isInSession.value = false;
  }
  return { currentSession, isInSession, checkSessionStatus, joinSession, openSession, listParticipants, leaveSession, endSession };


}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  }
});

async function apiCall<ApiResponse>(url: string, options: RequestInit): Promise<{ ok: boolean; data?: ApiResponse }> {
  const res = await fetch(url, options);
  let data: ApiResponse | undefined = undefined;
  try {
    data = await res.json();
  } catch (e){
    console.log(`Response is not JSON: ${e}`);
  }
  return { ok: res.ok, data };
}

import { defineStore } from "pinia";
import type { JoinSessionResponse, SessionStatus } from "../utils/types";

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

  function leaveSession() {
    currentSession.value = null;
    isInSession.value = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentSession');
      localStorage.removeItem('isInSession');
    }
  }

  return { currentSession, isInSession, checkSessionStatus, joinSession, leaveSession };
});

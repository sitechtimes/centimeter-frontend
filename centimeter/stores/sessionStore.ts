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
import type { JoinSessionResponse } from "../utils/types";

export const useSessionStore = defineStore("sessionStore", () => {
  const currentSession = ref<JoinSessionResponse | null>(null);
  const isInSession = ref(false);

  if (typeof window !== 'undefined') {
    const savedSession = localStorage.getItem('currentSession');
    const savedIsInSession = localStorage.getItem('isInSession');
    
    if (savedSession) currentSession.value = JSON.parse(savedSession);
    if (savedIsInSession) isInSession.value = JSON.parse(savedIsInSession);
  }

  if (typeof window !== 'undefined') {
    watch(currentSession, (newSession) => {
      if (newSession) {
        localStorage.setItem('currentSession', JSON.stringify(newSession));
      } else {
        localStorage.removeItem('currentSession');
      }
    });

    watch(isInSession, (newIsInSession) => {
      localStorage.setItem('isInSession', JSON.stringify(newIsInSession));
    });
  }

  async function checkSessionStatus(code: string) {
    const { ok, data } = await apiCall(
      import.meta.env.VITE_BACKEND_URL + `session/${code}/status/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!ok) {
      throw new Error("Session not found");
    }
    return data;
  }

  async function joinSession(join_code: string, nickname: string) {
    const { ok, data } = await apiCall<JoinSessionResponse>(
      import.meta.env.VITE_BACKEND_URL + "session/join/",
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

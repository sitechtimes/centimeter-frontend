import { apiCall } from "../utils/apiCall";
import type { Presentation } from "../utils/types/presentationTypes";

export const usePresentationStore = defineStore("presentationStore", () => {
  const presentations = ref<Presentation[]>([])

  function extractApiErrorMessage(payload: unknown): string | null {
    if (!payload) return null
    if (typeof payload === "string") return payload
    if (Array.isArray(payload)) {
      const first = payload[0]
      return typeof first === "string" ? first : null
    }
    if (typeof payload === "object") {
      const data = payload as Record<string, unknown>
      if (typeof data.detail === "string") return data.detail
      for (const value of Object.values(data)) {
        if (typeof value === "string") return value
        if (Array.isArray(value) && typeof value[0] === "string") return value[0]
      }
    }
    return null
  }

  function getAuthToken(): string {
    const userStore = useUserStore();
    const token = userStore.user?.access
    if (!token) {
      throw new Error("You are not authenticated. Please log in again.")
    }
    return token
  }

  async function createPresentation(title: string, description?: string) {
    try {
      const token = getAuthToken()

      const { ok, status, data } = await apiCall<Presentation | Record<string, unknown> | string | string[]>(
        import.meta.env.VITE_BACKEND_URL + "/presentations/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ title, description })
        }
      );

      if (ok && data && typeof data === "object" && "id" in data) {
        const presentation = data as Presentation
        presentations.value = [presentation, ...presentations.value]
        return presentation;
      } else {
        const detail = extractApiErrorMessage(data)
        throw new Error(detail || `Failed to create presentation (HTTP ${status})`);
      }
    } catch (err) {
      throw err;
    }
  }

  async function listPresentations() {
    const token = getAuthToken()

    const { ok, status, data } = await apiCall<Presentation[] | Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/presentations/list/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )

    if (!ok) {
      const detail = extractApiErrorMessage(data)
      throw new Error(detail || `Failed to fetch presentations (HTTP ${status})`)
    }

    const isPresentationArray = Array.isArray(data) && data.every((item) => {
      return typeof item === "object" && item !== null && "id" in item
    })

    presentations.value = isPresentationArray ? (data as Presentation[]) : []
    return presentations.value
  }

  async function getPresentation(code: string): Promise<any> {
    const token = getAuthToken()
    const { ok, status, data } = await apiCall<any>(
      import.meta.env.VITE_BACKEND_URL + `/presentations/${code}/get/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )

    if (!ok || !data) {
      const detail = extractApiErrorMessage(data)
      throw new Error(detail || `Failed to fetch presentation (HTTP ${status})`)
    }

    return data
  }

  async function attachPresentationToSession(presentationCode: string, sessionId: string | number): Promise<void> {
    const token = getAuthToken()
    const { ok, status, data } = await apiCall<Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + `/presentations/${presentationCode}/attach/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId })
      }
    )

    if (!ok) {
      const detail = extractApiErrorMessage(data)
      throw new Error(detail || `Failed to attach presentation to session (HTTP ${status})`)
    }
  }

  async function changeActiveSlide(presentationCode: string, slideId: string): Promise<void> {
    const token = getAuthToken()
    const { ok, status, data } = await apiCall<Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + `/presentations/${presentationCode}/slide/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ slide_id: slideId })
      }
    )

    if (!ok) {
      const detail = extractApiErrorMessage(data)
      throw new Error(detail || `Failed to change active slide (HTTP ${status})`)
    }
  }

  return {
    presentations,
    createPresentation,
    listPresentations,
    getPresentation,
    attachPresentationToSession,
    changeActiveSlide
  };
});
import { defineStore } from "pinia"
import type { User } from "../utils/types/userTypes"
import type { Presentation } from "../utils/types/presentationTypes"
import { apiCall } from "../utils/apiCall"

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User | null>(null)
  const isAuth = ref(false)
  const theme = ref<"light" | "dark">("light")
  const profilePic = ref<string>("")
  const presentations = ref<Presentation[]>([])

  function authHeaders(): Record<string, string> {
    const token = user.value?.access
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  function normalizePresentation(presentation: Presentation): Presentation {
    const normalizedTitle = presentation.data?.title ?? presentation.title ?? "Untitled Presentation"
    const normalizedSlides = presentation.data?.slides ?? presentation.slides ?? []
    return { ...presentation, title: normalizedTitle, slides: normalizedSlides }
  }

  async function logIn(email: string, password: string) {
    const { ok, data } = await apiCall<User>(
      import.meta.env.VITE_BACKEND_URL + "/users/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    )
    isAuth.value = ok
    user.value = ok ? data ?? null : null
  }

  async function signUp(email: string, password: string) {
    const { ok, data } = await apiCall<User>(
      import.meta.env.VITE_BACKEND_URL + "/users/register/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    )
    isAuth.value = ok
    user.value = ok ? data ?? null : null
  }

  async function logOut() {
    user.value = null
    isAuth.value = false
  }

  async function listPresentations(): Promise<Presentation[]> {
    const { ok, data } = await apiCall<Presentation[]>(
      import.meta.env.VITE_BACKEND_URL + "/presentations/list/",
      { method: "GET", headers: authHeaders() }
    )
    if (!ok) {
      throw new Error("Failed to fetch presentations")
    }
    return (data ?? []).map(normalizePresentation)
  }

  async function getPresentation(code: string): Promise<Presentation | null> {
    if (!code) return null

    const { ok, data } = await apiCall<Presentation>(
      `${import.meta.env.VITE_BACKEND_URL}/presentations/${code}/get/`,
      { method: "GET", headers: authHeaders() }
    )

    if (ok && data) {
      return normalizePresentation(data)
    }
    return null
  }

  async function savePresentation(presentationData: Partial<Presentation>) {
    const token = user.value?.access
    const code = presentationData.presentation_code

    if (!code || !token) {
      throw new Error("Presentation code and authentication token are required")
    }

    const payload = {
      data: {
        title: presentationData.title,
        slides: presentationData.slides,
      },
    }

    const { ok, data } = await apiCall<Presentation>(
      `${import.meta.env.VITE_BACKEND_URL}/presentations/${code}/save/`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      }
    )

    if (!ok || !data) {
      throw new Error("Failed to save presentation")
    }

    const normalized = normalizePresentation(data)
    const existingIndex = presentations.value.findIndex(
      (p) => p.presentation_code === code
    )

    if (existingIndex >= 0) {
      presentations.value[existingIndex] = normalized
    } else {
      presentations.value.push(normalized)
    }

    return normalized
  }

  return { user, isAuth, theme, profilePic, logIn, signUp, logOut, savePresentation, listPresentations, getPresentation }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
import type { User } from "../utils/types/userTypes";
import type { Presentation } from "../utils/types/presentationTypes";
import { apiCall } from "../utils/apiCall";

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User | null>(null);
  const isAuth = ref(false);
  
  const theme = ref<"light" | "dark">("light");

  const profilePic = ref<string>("")
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

  function splitName(fullName?: string): { first_name?: string; last_name?: string } {
    const trimmed = (fullName || "").trim()
    if (!trimmed) return {}

    const segments = trimmed.split(/\s+/)
    const first_name = segments.shift() || ""
    const last_name = segments.join(" ")
    return { first_name, last_name }
  }

  async function logIn(email: string, password: string) {
    const { ok, status, data } = await apiCall<User | Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/users/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );

    if (!ok || !(data && typeof data === "object" && "access" in data)) {
      isAuth.value = false;
      user.value = null;
      const detail = extractApiErrorMessage(data)
      throw new Error(detail || `Invalid credentials (HTTP ${status}).`);
    }

    isAuth.value = true;
    user.value = data as User;
  }

  async function signUp(email: string, password: string, fullName?: string) {
    const namePayload = splitName(fullName)

    const { ok, status, data } = await apiCall<User | Record<string, unknown> | string | string[]>(
      import.meta.env.VITE_BACKEND_URL + "/users/register/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...namePayload })
      }
    );

    if (!ok) {
      isAuth.value = false;
      user.value = null;
      const detail = extractApiErrorMessage(data)
      throw new Error(detail || `Sign up failed (HTTP ${status}).`);
    }

    if (data && typeof data === "object" && "access" in data) {
      isAuth.value = true;
      user.value = data as User;
      return;
    }

    await logIn(email, password)
  }

  async function logOut() {
    user.value = null;
    isAuth.value = false;
  }

  async function savePresentation(presentationData: Partial<Presentation>) {
    const token = user.value?.access
    const code = presentationData.presentation_code

    if (!code || !token) {
      throw new Error('Presentation code and authentication token are required')
    }

    const payload = {
      title: presentationData.title,
      data: {
        title: presentationData.title,
        slides: presentationData.slides || [],
        theme: {},
        active_slide: presentationData.slides?.[0]?.id || null
      }
    }

    const { ok, data } = await apiCall<Presentation>(
      `${import.meta.env.VITE_BACKEND_URL}/presentations/${code}/save/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    )

    if (!ok || !data) {
      throw new Error('Failed to save presentation')
    }

    const existingIndex = presentations.value.findIndex(
      p => p.presentation_code === code
    )

    if (existingIndex >= 0) {
      presentations.value[existingIndex] = data
    } else {
      presentations.value.push(data)
    }

    return data
  }
  return { user, isAuth, theme, profilePic, logIn, signUp, logOut, savePresentation };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  }
});
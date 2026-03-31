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
import type { User } from "../utils/types/userTypes";
import type { Presentation } from "../utils/types/presentationTypes";


export const useUserStore = defineStore("userStore", () => {
  const user = ref<User | null>(null);
  const isAuth = ref(false);
  
  const theme = ref<"light" | "dark">("light");

  const profilePic = ref<string>("")
  const presentations = ref<Presentation[]>([])

  async function logIn(email: string, password: string) {
    const { ok, data } = await apiCall<User>(
      import.meta.env.VITE_BACKEND_URL + "/users/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );
    isAuth.value = ok;
    user.value = ok ? data ?? null : null;
  }

  async function signUp(email: string, password: string) {
    const { ok, data } = await apiCall<User>(
      import.meta.env.VITE_BACKEND_URL + "/users/register/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );
    isAuth.value = ok;
    user.value = ok ? data ?? null : null;
  }

  async function logOut() {
    user.value = null;
    isAuth.value = false;
  }

  async function listPresentations(): Promise<Presentation[]> {
    const token = user.value?.access;
    const { ok, data } = await apiCall<Presentation[]>(
      import.meta.env.VITE_BACKEND_URL + "/presentations/list/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ''
        }
      }
    );
    if (!ok) {
      throw new Error("Failed to fetch presentations");
    }
    return data ?? [];
  }

  async function getPresentationByCode(code: string): Promise<Presentation | null> {
    if (!code) return null
    const list = await listPresentations()
    return list.find((presentation: Presentation) => (
      presentation.presentation_code === code || presentation.id === code
    )) ?? null
  }

  async function savePresentation(presentationData: Partial<Presentation>) {
    const token = user.value?.access
    const code = presentationData.presentation_code

    if (!code || !token) {
      throw new Error('Presentation code and authentication token are required')
    }

    const payload = {
      data: {
        title: presentationData.title,
        slides: presentationData.slides
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
  return { user, isAuth, theme, profilePic, logIn, signUp, logOut, savePresentation, listPresentations, getPresentationByCode };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  }
});
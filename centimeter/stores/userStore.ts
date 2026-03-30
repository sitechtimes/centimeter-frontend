import type { User } from "../utils/types/userTypes";
import type { Presentation } from "../utils/types/presentationTypes";
import { apiCall } from "../utils/apiCall";

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
    console.log(ok, data)
    isAuth.value = ok;
    user.value = ok ? data ?? null : null;
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
  return { user, isAuth, theme, profilePic, logIn, signUp, logOut, savePresentation };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  }
});
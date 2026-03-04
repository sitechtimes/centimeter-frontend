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
import type { User } from "../utils/types";

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User | null>(null);
  const isAuth = ref(false);
  
  const theme = ref<"light" | "dark">("light");

  const profilePic = ref<string>("")

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

  function logOut() {
    user.value = null;
    isAuth.value = false;
  }
/*   
  async function savePresentation(presentationData: Partial<Presentation>) {
    const token = user.value?.access
    
    if (!token) {
      throw new Error('Not authenticated')
    }

    const { ok, data } = await apiCall<Presentation>(
      import.meta.env.VITE_BACKEND_URL + "/presentations/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(presentationData)
      }
    )

    if (ok && data) {
      presentations.value.push(data)
      return data
    }
    
    throw new Error('Failed to save presentation')
  } */
  return { user, isAuth, theme, profilePic, logIn, signUp, logOut };
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  }
});
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

 async function joinSession(join_code: string) {
    const { ok, data } = await apiCall(
      import.meta.env.VITE_BACKEND_URL + "/session/join/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join_code })
      }
    );
    if (!ok) {
      throw new Error("Failed to join session");
    }
    return data;
  }
  async function getPresentation(){
    const token = localStorage.getItem("token");
    const { ok, data } = await apiCall(
      import.meta.env.VITE_BACKEND_URL + "/presentation/get/",
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    if (!ok) {
      throw new Error("Presentations Not Found");
    }
    return data;
  }
  
  return { user, isAuth, theme, logIn, signUp, joinSession, getPresentation };
});

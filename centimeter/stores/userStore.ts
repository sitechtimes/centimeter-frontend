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

  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    const savedIsAuth = localStorage.getItem('isAuth');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedUser) user.value = JSON.parse(savedUser);
    if (savedIsAuth) isAuth.value = JSON.parse(savedIsAuth);
    if (savedTheme) theme.value = savedTheme as "light" | "dark";
  }

  if (typeof window !== 'undefined') {
    watch(user, (newUser) => {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    });

    watch(isAuth, (newIsAuth) => {
      localStorage.setItem('isAuth', JSON.stringify(newIsAuth));
    });

    watch(theme, (newTheme) => {
      localStorage.setItem('theme', newTheme);
    });
  }

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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuth');
    }
  }

  return { user, isAuth, theme, logIn, signUp, logOut };
});

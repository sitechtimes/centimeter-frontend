import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("userStore", () => {
  const user = ref(false);
  const isAuth = ref(false);

  const theme = ref<"light" | "dark">("light");

  async function logIn(email: string, password: string) {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    isAuth.value = res.ok;
    if (isAuth.value) {
      user.value = await res.json();
    }
  }

  async function signUp(email: string, password: string) {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    isAuth.value = res.ok;
    if (isAuth.value) {
      user.value = await res.json();
    }
  }

  return { user, isAuth, theme, logIn, signUp };
});

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useUserStore = defineStore("userStore", () => {
  const user = ref(false);
  const isAuth = ref(false);

  const theme = ref<"light" | "dark">("light");
  const presentations = ref<Presentation[]>([]);
  const currentPres = ref<Presentation>();

  async function logIn(email: string, password: string) {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    isAuth.value = res.ok;
    if (isAuth.value) {
      user.value = await res.json();
    }
  }

  async function signUp(email: string, password: string, name: string) {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    isAuth.value = res.ok;
    if (isAuth.value) {
      user.value = await res.json();
    }
  }

  return { user, isAuth, theme, presentations, currentPres, logIn, signUp };
});

<template>
  <div class="flex items-center justify-center flex-col w-screen min-h-screen py-12 bg-[color:var(--bg-color)]">
    <a href="/"><img class="hover:saturate-50 h-32 transition duration-500" src="/logo/logoWithWords.svg" aria-hidden="true" /></a>
    <h1 class="text-5xl font-bold mb-8 text-[color:var(--text-color)]">Welcome{{ showLogin ? " back" : "" }}!</h1>

  <div class="flex items-center justify-center flex-col p-4 rounded-3xl mb-4 w-full max-w-md bg-[color:var(--bg-color)]">
      <h3 class="mb-4 text-[color:var(--text-color)]" v-show="showLogin">Log in to your Centimeter account</h3>
      <h3 class="mb-4 text-[color:var(--text-color)]" v-show="!showLogin">Create a free account</h3>

      <div class="loginButtons flex items-center justify-center flex-col gap-2 w-96">
        <button
          class="flex items-center justify-center gap-2 w-full bg-transparent rounded-full transition duration-500 border-solid border-2 border-[color:var(--text-color)]"
          v-for="button in loginButtons"
          :key="button.name"
          @click="button.function"
        >
          <img class="w-4" :src="button.img" aria-hidden="true" />
          <p class="my-2 font-bold text-[color:var(--text-color)]">{{ showLogin ? "Log in" : "Sign up" }} with {{ button.name }}</p>
        </button>
      </div>

      <span class="m-4 text-[color:var(--text-color)]">or using email</span>

  <form class="login flex items-center justify-center flex-col gap-7 w-full" @submit.prevent="loginWithEmail">
        <div class="relative flex items-start justify-center flex-col gap-1">
          <label class="font-medium text-[color:var(--text-color)]" for="email">Your email address <span title="Required" class="text-[color:var(--danger)] font-2xl">*</span></label>
          <input
            class="w-96 h-12 rounded-lg border-0 px-4 transition duration-500 focus:outline-2 bg-[color:var(--faded-bg-color)] text-[color:var(--text-color)] outline-[color:var(--primary)]"
            id="email"
            type="email"
            required
            v-model="email"
          />
          <p class="absolute error font-medium text-[color:var(--danger)] translate-y-14" v-show="emailErr.length > 0">{{ emailErr }}</p>
        </div>

        <div class="relative flex items-start justify-center flex-col gap-1">
          <label class="font-medium text-[color:var(--text-color)]" for="password">{{ showLogin ? "Your" : "Choose a" }} password <span title="Required" class="text-[color:var(--danger)] font-2xl">*</span></label>
          <input
            class="w-96 h-12 rounded-lg border-0 px-4 transition duration-500 focus:outline-2 bg-[color:var(--faded-bg-color)] outline-[color:var(--primary)] text-[color:var(--text-color)]"
            id="password"
            type="password"
            required
            v-model="password"
            :autocomplete="showLogin ? 'current-password' : 'new-password'"
          />
          <p class="absolute error font-medium text-[color:var(--danger)] translate-y-14" v-show="passwordErr.length > 0">{{ passwordErr }}</p>
        </div>

        <button
          class="w-96 h-12 rounded-full border-0 mt-4 transition duration-200 bg-[color:var(--bg-color-contrast)] text-[color:var(--text-color-contrast)] active:brightness-60"
          type="submit"
        >
          <span>{{ showLogin ? "Log in" : "Sign up" }}</span>
        </button>
        <button type="button" @click="resetPassword = true" class="no-underline font-medium text-[color:var(--danger)]" v-if="showLogin">Forgot password?</button>
      </form>
    </div>
    <span class="mb-4" v-show="!showLogin">By signing up, you accept our <a href="/">terms of use</a> and <a href="/">privacy policy</a>.</span>

    <h3 v-show="showLogin" class="text-[color:var(--text-color)]">New to Centimeter?</h3>
    <h3 v-show="!showLogin" class="text-[color:var(--text-color)]">Already have an account?</h3>
    <button class="bg-transparent border-0" @click="showLogin ? navigateTo('/auth/signup') : navigateTo('/auth/login')">
      <h3 class="m-0 font-medium cursor-pointer text-[color:var(--text-color)]">{{ showLogin ? "Sign up now" : "Log in" }}</h3>
    </button>
    
    <ToastContainer ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import ToastContainer from './ToastContainer.vue';

const route = useRoute();
const userStore = useUserStore();
const toastRef = ref<InstanceType<typeof ToastContainer> | null>(null);

const showLogin = ref(true);
const resetPassword = ref(false);
watch(
  () => resetPassword.value,
  (value: boolean) => {
    if (value) navigateTo("/auth/reset-password");
    else navigateTo('/auth/login');
  }
);

const email = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");


const emailErr = ref("");
const nameErr = ref("");
const passwordErr = ref("");
const confirmPasswordErr = ref("");

watch(
  () => route.name,
  (routeName: string | symbol | undefined) => {
    showLogin.value = routeName === 'login';
  },
  { immediate: true }
);


watch(
  () => email.value,
  (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (value.length != 0 && !emailRegex.test(value)) emailErr.value = "Invalid email.";
    else emailErr.value = "";
  }
);


watch(
  () => password.value,
  (value: string) => {
    if (value != confirmPassword.value) confirmPasswordErr.value = "Passwords do not match.";

    if (value.length < 8) passwordErr.value = "Password must be at least 8 characters.";
    else if (value.length > 50) passwordErr.value = "Password must be less than 50 characters.";
    else passwordErr.value = "";
  }
);

watch(
  () => name.value,
  (value: string) => {
    if (value.length < 2) nameErr.value = "Name must be at least 2 characters.";
    else if (value.length > 40) nameErr.value = "name must be less than 40 characters.";
    else nameErr.value = "";
  }
);


watch(
  () => confirmPassword.value,
  (value: string) => {
    if (value != password.value) confirmPasswordErr.value = "Passwords do not match.";
    else confirmPasswordErr.value = "";
  }
);



onMounted(() => {
  if (route.query["reset-password"]) resetPassword.value = true;
  showLogin.value = route.query.signup == undefined;
});

const loginButtons = [
  {
    name: "Google",
    img: "/logo/google.svg",
    function: loginWithGoogle
  },
  {
    name: "Microsoft",
    img: "/logo/microsoft.svg",
    function: loginWithMicrosoft
  },
  {
    name: "Facebook",
    img: "/logo/facebook.svg",
    function: loginWithFacebook
  }
];

async function loginWithEmail() {
  try {
    await userStore.logIn(email.value, password.value);
    
    if (userStore.isAuth) {
      toastRef.value?.add({ 
        title: 'Login successful!', 
        message: 'Welcome back to Centimeter'
      });
      setTimeout(() => navigateTo("/app/dashboard"), 1000);
    } else {
      passwordErr.value = "Invalid credentials. Please try again.";
    }
  } catch (error) {
    if (error instanceof Error) {
      passwordErr.value = error.message;
      if (!error.message) passwordErr.value = "Something went wrong. Please try again.";
    }
    toastRef.value?.add({ 
      title: 'Login failed', 
      message: 'Please check your credentials and try again'
    });
    return;
  }
}

async function loginWithGoogle() {
  window.location.href = "https://www.youtube.com/watch?v=uHgt8giw1LY";
}

async function loginWithMicrosoft() {
  loginWithGoogle();
}

async function loginWithFacebook() {
  loginWithGoogle();
}
</script>

<style scoped>
.opacity-enter-active,
.opacity-leave-active {
  transition: all 0.2s ease-in-out;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}


</style>

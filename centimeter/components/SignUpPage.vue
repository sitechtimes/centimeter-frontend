
<template>
    <div class="flex items-center justify-center flex-col w-screen min-h-screen py-12">
        <a href="/"><img class="hover:saturate-50 h-32 transition duration-500" src="/logo/logoWithWords.svg" aria-hidden="true" /></a>
        <h1 class="text-5xl font-bold mb-8">Welcome!</h1>
        <div class="flex items-center justify-center flex-col bg-[color:var(--bg-color)] p-4 rounded-3xl mb-4 overlay-parent w-full max-w-md">
            <h3 class="mb-4">Create a free account</h3>
            <div class="loginButtons flex items-center justify-center flex-col gap-2 w-96">
                <button class="flex items-center justify-center gap-2 w-full bg-transparent rounded-full transition duration-500 border-solid border-2 border-[color:var(--text-color)]">
                    <img class="w-4" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" aria-hidden="true" />
                    <p class="my-2 font-bold">Sign up with Google</p>
                </button>
                <button class="flex items-center justify-center gap-2 w-full bg-transparent rounded-full transition duration-500 border-solid border-2 border-[color:var(--text-color)]">
                    <img class="w-4" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg" aria-hidden="true" />
                    <p class="my-2 font-bold">Sign up with Microsoft</p>
                </button>
                <button class="flex items-center justify-center gap-2 w-full bg-transparent rounded-full transition duration-500 border-solid border-2 border-[color:var(--text-color)]">
                    <img class="w-4" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" aria-hidden="true" />
                    <p class="my-2 font-bold">Sign up with Facebook</p>
                </button>
            </div>
            <span class="m-4">or using email</span>
            <form class="login flex items-center justify-center flex-col gap-7 w-full" @submit.prevent="signupWithEmail">
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="email">Your email address <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input v-model="email" class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="email" type="email" required />
                    <p class="absolute error font-medium text-red-500" v-show="emailErr.length > 0">{{ emailErr }}</p>
                </div>
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="name">Your name <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input v-model="name" class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="name" type="text" required autocomplete="name" />
                    <p class="absolute error font-medium text-red-500" v-show="nameErr.length > 0">{{ nameErr }}</p>
                </div>
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="password">Choose a password <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input v-model="password" class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="password" type="password" required autocomplete="new-password" />
                    <p class="absolute error font-medium text-red-500" v-show="passwordErr.length > 0">{{ passwordErr }}</p>
                </div>
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="confirm">Confirm password <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input v-model="confirmPassword" class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="confirm" type="password" required autocomplete="new-password" />
                    <p class="absolute error font-medium text-red-500" v-show="confirmPasswordErr.length > 0">{{ confirmPasswordErr }}</p>
                </div>
                <button class="btn btn-primary w-96 mt-4" type="submit">Sign up</button>

                    </form>
                    <span class="mb-4 mt-2">By signing up, you accept our <a href="/" class="underline">terms of use</a> and <a href="/" class="underline">privacy policy</a>.</span>
                    <h3 class="mt-2">Already have an account?</h3>
                    <button class="bg-transparent border-0" @click="goToLogin">
                        <h3 class="m-0 font-medium cursor-pointer">Log in</h3>
                    </button>
                </div>
            </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
import { useUserStore } from '../stores/userStore';
const userStore = useUserStore();

const email = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");

const emailErr = ref("");
const nameErr = ref("");
const passwordErr = ref("");
const confirmPasswordErr = ref("");

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
        else if (value.length > 40) nameErr.value = "Name must be less than 40 characters.";
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


async function signupWithEmail() {
    try {
        await userStore.signUp(email.value, password.value);
    } catch (error) {
        if (error instanceof Error) {
            passwordErr.value = error.message;
            if (!error.message) passwordErr.value = "Something went wrong. Please try again.";
        }
        return;
    }
    if (userStore.isAuth) router.push("/app/dashboard");
    else passwordErr.value = "Something went wrong. Please try again.";
}

function goToLogin() {
    router.push('/auth/login');
}
</script>


<style scoped>
.overlay-parent { position: relative; }
.opacity-enter-active,
.opacity-leave-active {
    transition: all 0.25s ease;
}
.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
}
</style>
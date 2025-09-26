
<template>
    <div class="flex items-center justify-center flex-col w-screen min-h-screen py-12">
        <a href="/"><img class="hover:saturate-50 h-32 transition duration-500" src="/logo/logoWithWords.svg" aria-hidden="true" /></a>
        <h1 class="text-5xl font-bold mb-8">Welcome!</h1>
        <div class="flex items-center justify-center flex-col bg-[color:var(--bg-color)] p-4 rounded-3xl mb-4">
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
            <form class="login flex items-center justify-center flex-col gap-7 w-full">
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="email">Your email address <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="email" type="email" required />
                </div>
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="name">Your name <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="name" type="text" required autocomplete="name" />
                </div>
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="password">Choose a password <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="password" type="password" required autocomplete="new-password" />
                </div>
                <div class="relative flex items-start justify-center flex-col gap-1">
                    <label class="font-medium" for="confirm">Confirm password <span title="Required" class="text-red-500 font-2xl">*</span></label>
                    <input class="w-96 h-12 rounded-lg border-0 bg-[color:var(--faded-bg-color)] px-4 transition duration-500 focus:outline-2 focus:outline-[color:var(--primary)] focus:bg-[color:var(--bg-color)]" id="confirm" type="password" required autocomplete="new-password" />
                </div>
                <button class="hover:bg-[var(--text-color)] w-96 h-12 rounded-full border-0 bg-[color:var(--bg-color-contrast)] mt-4 transition duration-500" type="submit">
                    <p class="text-[color:var(--text-color-contrast)]">Sign up</p>
                </button>

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
import { useRouter } from 'vue-router';
const router = useRouter();
function goToLogin() {
    router.push('/auth/login');
}
</script>


<style scoped></style>
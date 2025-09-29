<template>
  <div class="mb-24 flex flex-col items-center justify-center sticky top-0">
    <header class="transition duration-500 bg-[color:var(--bg-color)] h-16 w-screen">
      <div class="w-screen flex items-center justify-evenly border-b-2 border-solid border-[color:var(--faded-bg-color)] bg-[color:var(--bg-color)] relative z-20">
        <RouterLink class="flex items-center justify-center gap-2 no-underline text-[color:var(--text-color)]" to="/">
          <!-- <img class="h-16" src="/logo/logoWithWords.svg" alt="Vent Defeater logo" /> -->
        </RouterLink>
        <nav>
            <div v-for="return in returnArrow" >
                <RouterLink :to="return.path">
                    {{ return.name }}
                <RouterLink/>
            </div>
        </nav>


        <nav class="flex items-center justify-center gap-3">
          <div class="relative group" v-for="button in navButtons" :key="button.name">
            <RouterLink :to="button.path" class="navButton relative no-underline text-[color:var(--text-color)] font-bold flex items-center justify-center px-4 py-2 rounded hover:bg-[color:var(--primary-light)] transition">
              {{ button.name }}
            </RouterLink>
            <div
              class="absolute left-0 mt-2 flex-col items-start justify-center gap-1 bg-[color:var(--bg-color)] shadow-2xl shadow-[color:var(--bg-color-contrast-translucent)] p-4 rounded-sm transition opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-30 min-w-max"
              v-if="button.dropdown"
            >
              <RouterLink class="no-underline text-[color:var(--text-color)] block w-full hover:bg-[color:var(--primary-light)] rounded px-2 py-1 transition" v-for="option in button.dropdown" :to="option.path" :key="option.name">
                <h4 class="font-medium m-1">{{ option.name }}</h4>
              </RouterLink>
            </div>
          </div>
        </nav>
        <div class="flex items-center justify-center gap-3">
          <ThemeToggle />
          <RouterLink class="no-underline" to="/login">
            <h3 class="font-bold m-0">Log in</h3>
          </RouterLink>
          <RouterLink class="no-underline bg-[color:var(--primary)] hover:bg-[color:var(--primary-shade)] px-5 py-2 transition rounded-full" to="/login?signup=1">
            <h3 class="font-bold m-0 text-[color:var(--text-color-contrast)] dark:text-white">Sign up</h3>
          </RouterLink>
        </div>
      </div>

      <Transition name="goToJoin">
        <div class="w-screen flex items-center justify-center gap-3 bg-[color:var(--primary-light)] rounded-b-3xl py-3 relative bottom-0 z-10" v-show="showJoinBanner">
          <p class="text-lg font-medium">Trying to join a live Vent?</p>
          <RouterLink to="/join" class="flex items-center justify-center gap-1 rounded-full bg-[color:var(--bg-color)] text-[color:var(--text-color)] font-semibold px-4 py-2 hover:bg-[color:var(--primary-light)] transition">
            Join
          </RouterLink>
          <button class="absolute right-12 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[color:var(--primary-shade-translucent)] transition" @click="emit('toggleBanner')">
            <span class="sr-only">Close</span>
            <!-- <img class="w-5 h-5 dark:invert" src="/ui/x.svg" aria-hidden="true" /> -->
            ×
          </button>
        </div>
      </Transition>
    </header>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
type NavButtons = {
  name: string;
  path: string;
  dropdown?: { name: string; path: string }[];
};

const props = defineProps<{ showJoinBanner?: boolean }>();
const emit = defineEmits<{ toggleBanner: [void] }>();

const returnArrow = [
    {
    name: "Return",
    path: "/",
    dropdown: [
        {
            name: "Back to My presentations",
            path: "/"
        }
    ]
}]

const navButtons = [
  {
    name: "Work",
    path: "/",
    dropdown: [
      {
        name: "Overview",
        path: "/"
      },
      
    ]
  },
  {
    name: "Education",
    path: "/",
    dropdown: [
      {
        name: "Overview",
        path: "/"
      },
      
    ]
  },
  {
    name: "Features",
    path: "/",
    dropdown: [
      {
        name: "Overview",
        path: "/"
      },
      
    ]
  },
  {
    name: "Resources",
    path: "/",
    dropdown: [
      {
        name: "How To",
        path: "/"
      },
    ]
  },
] as const satisfies NavButtons[];
</script>

<style scoped lang="scss">
.goToJoin-enter-active,
.goToJoin-leave-active {
  transition: all 0.5s ease;
}

.goToJoin-enter-from,
.goToJoin-leave-to {
  opacity: 0;
  transform: translateY(-10vh);
}


</style>
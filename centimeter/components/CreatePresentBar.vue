<template>
  <div class="mb-24 flex flex-col items-center justify-center sticky top-0">
    <header class="transition duration-500 bg-[color:var(--bg-color)] h-16 w-screen">
      <div class="w-screen flex items-center justify-evenly border-b-2 border-solid border-[color:var(--faded-bg-color)] bg-[color:var(--bg-color)] relative z-20">
        <RouterLink class="flex items-center justify-center gap-2 no-underline text-[color:var(--text-color)]" to="/">
          <!-- <img class="h-16" src="/logo/logoWithWords.svg" alt="Vent Defeater logo" /> -->
        </RouterLink>

        <RouterLink to="/">
            <img src="" alt="">
            <!-- Image of an arrow when hover turn gray click go back to see all your presentations -->
        </RouterLink>


        <nav class="flex items-center justify-center gap-3">
          <div class="relative group" v-for="button in PresentButtons" :key="button.name">
            <RouterLink :to="button.path" class="navButton relative no-underline text-[color:var(--text-color)] font-bold flex items-center justify-center px-4 py-2 rounded hover:bg-[color:var(--primary-light)] transition">
              {{ button.name }}
            </RouterLink>
          </div>
        </nav>
        <div class="flex items-center justify-center gap-3">
          <ThemeToggle />
          <div v-for="button in SharePresentButtons" :key="button.name">
            <RouterLink :to="button.path">
                {{ button.name }}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- <Transition name="goToJoin">
        <div class="w-screen flex items-center justify-center gap-3 bg-[color:var(--primary-light)] rounded-b-3xl py-3 relative bottom-0 z-10" v-show="showJoinBanner">
          <p class="text-lg font-medium">Trying to join a live Vent?</p>
          <RouterLink to="/join" class="flex items-center justify-center gap-1 rounded-full bg-[color:var(--bg-color)] text-[color:var(--text-color)] font-semibold px-4 py-2 hover:bg-[color:var(--primary-light)] transition">
            Join
          </RouterLink>
          <button class="absolute right-12 rounded-full w-8 h-8 flex items-center justify-center hover:bg-[color:var(--primary-shade-translucent)] transition" @click="emit('toggleBanner')">
            <span class="sr-only">Close</span>
            <img class="w-5 h-5 dark:invert" src="/ui/x.svg" aria-hidden="true" />
            ×
          </button>
        </div>
      </Transition> -->
    </header>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
type ShowButtons = {
  name: string;
  path: string;
  dropdown?: { name: string;}[];
};

const props = defineProps<{ showJoinBanner?: boolean }>();
const emit = defineEmits<{ toggleBanner: [void] }>();

const PresentButtons = [
  {
    name: "Create",
    path: "/create",

},
{
    name: "Result",
    path: "/results",
}
] 

const SharePresentButtons = [
    {
        name: "Preview",
        path: "/preview",
        dropdown: [
            {
                name: "preview",
    }
        ]
    },
    {
        name: "Share",
        path: "/share",
        dropdown: [
            {
                name: "Who do you want to share with?",
    }
        ]
    },
] as const as ShowButtons[];
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
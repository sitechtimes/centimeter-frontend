<template>
  <div class="flex flex-col items-center justify-center w-screen m-0">
    <header class="transition duration-500 bg-[color:var(--bg-color)] w-screen">
      <div class="w-screen flex items-center justify-evenly border-b-2 border-solid border-[color:var(--faded-bg-color)] bg-[color:var(--bg-color)] relative z-20">
        <RouterLink class="flex items-center justify-center gap-2 no-underline text-[color:var(--text-color)]" to="/">
        </RouterLink>
        <button
            @click="ReturnPresent"
            class="absolute left-2 top-2 -translate-y-0.5 flex items-center justify-center">
            <img
            class="h-6 transition-all duration-500"
            :src="'/ui/arrow.svg'"
            aria-hidden="true"/>
  </button>
  <input v-model="PresentationName" class="h-16 border-solid border-2 border-[color:var(--text-color)]" />
        <nav class="flex items-center justify-center gap-3">
          <div class="relative group" v-for="button in PresentButtons" :key="button.name">
            <RouterLink :to="button.path" class="navButton relative no-underline text-[color:var(--text-color)] font-bold flex items-center justify-center px-4 py-2 rounded hover:bg-[color:var(--primary-light)] transition">
              {{ button.name }}
            </RouterLink>
          </div>
        </nav>
        <div class="flex items-center justify-center gap-3">
          <div v-for="button in SharePresentButtons" :key="button.name">
            <RouterLink :to="button.path">
                {{ button.name }}
            </RouterLink>
          </div>
        </div>
      </div>

    </header>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
type ShowButtons = {
  name: string;
  path: string;
  dropdown?: { name: string;}[];
};

const props = defineProps<{ showJoinBanner?: boolean }>();
const emit = defineEmits<{ toggleBanner: [void] }>();

const PresentationName = ref('My Presentation');

const PresentButtons = [
  {
    name: "Create",
    path: "app/dashboard/create/",

},
{
    name: "Result",
    path: "app/dashboard/results",
}
] 

const SharePresentButtons = [
    {
        name: "Preview",
        path: "app/dashboard/create/preview",
        dropdown: [
            {
                name: "preview",
    }
        ]
    },
    {
        name: "Share",
        path: "app/dashboard/share",
        dropdown: [
            {
                name: "Who do you want to share with?",
    }
        ]
    },
] as const as ShowButtons[];

function ReturnPresent() {
    // go back to see all your presentations
    // window.history.back();
    window.location.href = '/';
}
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
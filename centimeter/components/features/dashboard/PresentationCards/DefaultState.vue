<template>
  <div class="min-h-screen bg-[var(--faded-bg-color-light)] text-[var(--text-color)]">
    <main class="max-w-7xl mx-auto px-6 py-8">
      <h1 class="text-3xl font-normal mb-8">My presentations</h1>

      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <button
            @click="goToCreatePresentation"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-full hover:bg-[var(--primary-shade)] transition-colors"
          >
            <span class="text-lg leading-none">+</span>
            <span>New Menti</span>
          </button>
          <button
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--faded-bg-color-light)] text-[color:var(--text-color)] text-sm font-medium rounded-full hover:bg-[var(--faded-bg-color)] transition-colors"
          >
            <span class="text-lg leading-none">+</span>
            <span>New folder</span>
          </button>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray)]" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search my presentations"
              class="w-96 pl-9 pr-9 py-2 bg-[var(--faded-bg-color-light)] text-[var(--text-color)] placeholder:text-[var(--faded-text-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-shade)]"
            />
          </div>

          <div class="flex items-center gap-1 border border-[var(--faded-bg-color)] rounded-lg p-1 bg-[var(--bg-color)]">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-1.5 rounded transition-colors',
                viewMode === 'grid' ? 'bg-[var(--primary)] text-[var(--text-color-contrast)]' : 'text-[var(--faded-text-color)] hover:bg-[var(--faded-bg-color-light)]'
              ]"
            >
              <LayoutGrid />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-1.5 rounded transition-colors',
                viewMode === 'list' ? 'bg-[var(--primary)] text-[var(--text-color-contrast)]' : 'text-[var(--faded-text-color)] hover:bg-[var(--faded-bg-color-light)]'
              ]"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-sm font-medium">Presentations ({{ filteredPresentations.length }})</h2>
        <button class="flex items-center gap-2 text-sm text-[var(--faded-text-color)] hover:text-[var(--text-color)]">
          <span>Last modified</span>
          <ChevronDown />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" v-if="viewMode === 'grid'">
        <GridPresentation v-for="presentation in filteredPresentations" :key="presentation.id" :presentation="presentation" />
      </div>

      <div v-else>
        <CompactPresentationView :presentations="filteredPresentations" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Search, LayoutGrid, Menu, ChevronDown } from "lucide-vue-next";
import GridPresentation from "./GridPresentation.vue";
import CompactPresentationView from "./PresentationView.vue";


const searchQuery = ref("");
const viewMode = ref<"grid" | "list">("grid");
const presentations = ref<Presentation[]>([]);

const router = useRouter();
const presentationStore = usePresentationStore()
const userStore = useUserStore()

async function goToCreatePresentation() {
  try {
    const presentation = await presentationStore.createPresentation("Untitled Presentation")
    if (presentation?.id) {
      router.push(`/app/create/${presentation.presentation_code}`)
    }
  } catch (err) {
    console.error("Failed to create presentation:", err)
  }
}

async function loadPresentations() {
  try {
    presentations.value = await userStore.listPresentations();
  } catch (err) {
    console.error("Failed to load presentations:", err);
    presentations.value = [];
  }
}

onMounted(() => {
  loadPresentations();
});

const filteredPresentations = computed(() => {
  if (!searchQuery.value) return presentations.value;

  const query = searchQuery.value.toLowerCase();
  return presentations.value.filter((p) => {
    const titleMatch = p.title?.toLowerCase().includes(query);
    const hostMatch = p.host?.toLowerCase().includes(query);
    return titleMatch || hostMatch;
  });
});
</script>

<template>
  <div class="min-h-screen bg-[var(--faded-bg-color-light)] text-[var(--text-color)]">
    <main class="max-w-7xl mx-auto px-6 py-8">
      <h1 class="text-3xl font-normal mb-8">My presentations</h1>

      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <button
            @click="goToCreatePresentation"
            :disabled="isCreating"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-full hover:bg-[var(--primary-shade)] transition-colors"
          >
            <span class="text-lg leading-none">+</span>
            <span>{{ isCreating ? 'Creating...' : 'New Menti' }}</span>
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
import { ref, computed, onMounted } from "vue";
import { Search, LayoutGrid, Menu, ChevronDown } from "lucide-vue-next";
import GridPresentation from "./GridPresentation.vue";
import CompactPresentationView from "./PresentationView.vue";
import { useRouter } from "vue-router";
import { usePresentationStore } from '~/stores/presentationStore'
import { useUserStore } from '~/stores/userStore'
import type { Presentation } from "~/utils/types/presentationTypes";

const searchQuery = ref("");
const viewMode = ref<"grid" | "list">("grid");
const isCreating = ref(false)
const isLoading = ref(true)

const router = useRouter();
const presentationStore = usePresentationStore();
const userStore = useUserStore();

const presentations = computed<Presentation[]>(() => presentationStore.presentations)

onMounted(async () => {
  if (!userStore.isAuth) {
    isLoading.value = false
    return
  }

  try {
    await presentationStore.listPresentations()
  } catch (err) {
    console.error('Failed to load presentations:', err)
  } finally {
    isLoading.value = false
  }
})

async function goToCreatePresentation() {
  if (isCreating.value) return

  if (!userStore.isAuth) {
    alert('Please log in before creating a presentation.')
    router.push('/auth/login')
    return
  }

  isCreating.value = true
  try {
    const presentation = await presentationStore.createPresentation('Untitled Presentation')
    const routeId = presentation?.presentation_code || presentation?.id

    if (routeId) {
      router.push(`/app/create/${routeId}`)
    } else {
      alert('Presentation created but no identifier was returned by the API.')
    }
  } catch (err) {
    console.error('Failed to create presentation:', err)
    const message = err instanceof Error ? err.message : 'Failed to create presentation.'
    alert(message)

    if (message.toLowerCase().includes('authenticated') || message.toLowerCase().includes('log in')) {
      router.push('/auth/login')
    }
  } finally {
    isCreating.value = false
  }
}

const filteredPresentations = computed(() => {
  if (isLoading.value) return []
  if (!searchQuery.value) return presentations.value;

  const query = searchQuery.value.toLowerCase();
  return presentations.value.filter((p) => {
    const title = (p.title || '').toLowerCase()
    const host = (p.host || '').toLowerCase()
    return title.includes(query) || host.includes(query)
  });
});
</script>

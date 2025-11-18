<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <NavBar />
    
    <!-- Dashboard Header -->
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[var(--text-color)] mb-2">
            Welcome back, {{ userStore.user?.name || 'User' }}!
          </h1>
          <p class="text-[var(--faded-text-color)] text-lg">
            Here's what's happening with your presentations today.
          </p>
        </div>
        <div class="flex gap-3 mt-4 lg:mt-0">
          <NuxtLink 
            to="/CreatePresentation" 
            class="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          >
            <img src="/ui/plus.svg" class="w-5 h-5 dark:invert" alt="Plus icon" />
            New Presentation
          </NuxtLink>
          <button class="btn btn-outline flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all">
            <img src="/ui/settings.svg" class="w-5 h-5" alt="Settings icon" />
            Settings
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--faded-bg-color)]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--faded-text-color)] text-sm font-medium">Total Presentations</p>
              <p class="text-3xl font-bold text-[var(--text-color)] mt-1">{{ stats.totalPresentations }}</p>
            </div>
            <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <img src="/ui/presentation.svg" class="w-6 h-6 text-blue-600" alt="Presentation icon" />
            </div>
          </div>
          <div class="flex items-center mt-4 text-green-600">
            <span class="text-sm font-medium">+12% from last month</span>
          </div>
        </div>

        <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--faded-bg-color)]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--faded-text-color)] text-sm font-medium">Active Sessions</p>
              <p class="text-3xl font-bold text-[var(--text-color)] mt-1">{{ stats.activeSessions }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <div class="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center mt-4 text-green-600">
            <span class="text-sm font-medium">{{ stats.activeSessions }} currently live</span>
          </div>
        </div>

        <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--faded-bg-color)]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--faded-text-color)] text-sm font-medium">Total Views</p>
              <p class="text-3xl font-bold text-[var(--text-color)] mt-1">{{ formatNumber(stats.totalViews) }}</p>
            </div>
            <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <img src="/ui/eye.svg" class="w-6 h-6 text-purple-600" alt="View icon" />
            </div>
          </div>
          <div class="flex items-center mt-4 text-green-600">
            <span class="text-sm font-medium">+8% from last week</span>
          </div>
        </div>

        <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--faded-bg-color)]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[var(--faded-text-color)] text-sm font-medium">Avg. Session Time</p>
              <p class="text-3xl font-bold text-[var(--text-color)] mt-1">{{ stats.avgSessionTime }}m</p>
            </div>
            <div class="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <img src="/ui/clock.svg" class="w-6 h-6 text-orange-600" alt="Clock icon" />
            </div>
          </div>
          <div class="flex items-center mt-4 text-orange-600">
            <span class="text-sm font-medium">{{ stats.avgSessionTime > 15 ? 'Great' : 'Good' }} engagement</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Recent Presentations -->
        <div class="lg:col-span-2 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--faded-bg-color)]">
          <div class="p-6 border-b border-[var(--faded-bg-color)]">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-[var(--text-color)]">Recent Presentations</h2>
              <NuxtLink to="/presentations" class="text-[var(--primary)] hover:underline font-medium">
                View all
              </NuxtLink>
            </div>
          </div>
          <div class="p-6">
            <div v-if="presentations.length === 0" class="text-center py-12">
              <img src="/ui/presentation.svg" class="w-16 h-16 mx-auto mb-4 opacity-50" alt="No presentations" />
              <p class="text-[var(--faded-text-color)] text-lg mb-4">No presentations yet</p>
              <NuxtLink 
                to="/CreatePresentation" 
                class="btn btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold"
              >
                <img src="/ui/plus.svg" class="w-5 h-5 dark:invert" alt="Plus icon" />
                Create your first presentation
              </NuxtLink>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="presentation in presentations.slice(0, 5)" 
                :key="presentation.id"
                class="flex items-center justify-between p-4 rounded-lg border border-[var(--faded-bg-color)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                @click="openPresentation(presentation.id)"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <img src="/ui/presentation.svg" class="w-6 h-6 text-white" alt="Presentation icon" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-[var(--text-color)]">{{ presentation.title }}</h3>
                    <p class="text-[var(--faded-text-color)] text-sm">
                      {{ presentation.slides }} slides • Updated {{ formatDate(presentation.updatedAt) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getStatusClass(presentation.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ presentation.status }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <button class="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors" @click.stop="editPresentation(presentation.id)">
                      <img src="/ui/edit.svg" class="w-4 h-4" alt="Edit" />
                    </button>
                    <button class="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors" @click.stop="sharePresentation(presentation.id)">
                      <img src="/ui/share.svg" class="w-4 h-4" alt="Share" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          
          <!-- Quick Actions -->
          <div class="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--faded-bg-color)]">
            <div class="p-6 border-b border-[var(--faded-bg-color)]">
              <h2 class="text-xl font-bold text-[var(--text-color)]">Quick Actions</h2>
            </div>
            <div class="p-6 space-y-3">
              <button class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-left">
                <img src="/ui/plus.svg" class="w-5 h-5" alt="New" />
                <span class="font-medium text-[var(--text-color)]">New Presentation</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-left">
                <img src="/ui/upload.svg" class="w-5 h-5" alt="Import" />
                <span class="font-medium text-[var(--text-color)]">Import Slides</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-left">
                <img src="/ui/template.svg" class="w-5 h-5" alt="Template" />
                <span class="font-medium text-[var(--text-color)]">Browse Templates</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-left" @click="handleJoinSession">
                <img src="/ui/rightArrow.svg" class="w-5 h-5" alt="Join" />
                <span class="font-medium text-[var(--text-color)]">Join Session</span>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--faded-bg-color)]">
            <div class="p-6 border-b border-[var(--faded-bg-color)]">
              <h2 class="text-xl font-bold text-[var(--text-color)]">Recent Activity</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-3">
                  <div :class="getActivityIcon(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center">
                    <img :src="`/ui/${activity.icon}.svg`" class="w-4 h-4" :alt="activity.type" />
                  </div>
                  <div class="flex-1">
                    <p class="text-[var(--text-color)] text-sm">{{ activity.description }}</p>
                    <p class="text-[var(--faded-text-color)] text-xs mt-1">{{ formatTime(activity.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Storage Usage -->
          <div class="bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--faded-bg-color)]">
            <div class="p-6 border-b border-[var(--faded-bg-color)]">
              <h2 class="text-xl font-bold text-[var(--text-color)]">Storage Usage</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-[var(--text-color)]">{{ storageUsed }} GB of {{ storageLimit }} GB used</span>
                  <span class="text-[var(--faded-text-color)]">{{ storagePercentage }}%</span>
                </div>
                <div class="w-full bg-[var(--faded-bg-color)] rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${storagePercentage}%` }"
                  ></div>
                </div>
                <button class="text-[var(--primary)] hover:underline text-sm font-medium">
                  Upgrade storage
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
});

import NavBar from '~/components/NavBar.vue';
import { useUserStore } from '~/stores/userStore';

const userStore = useUserStore();

const stats = ref({
  totalPresentations: 24,
  activeSessions: 3,
  totalViews: 12847,
  avgSessionTime: 18
});

const presentations = ref([
  {
    id: 1,
    title: "Q4 Sales Review",
    slides: 15,
    status: "Published",
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 2,
    title: "Product Roadmap 2025",
    slides: 23,
    status: "Draft",
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 3,
    title: "Team Building Workshop",
    slides: 8,
    status: "Live",
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: 4,
    title: "Customer Success Metrics",
    slides: 12,
    status: "Published",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  }
]);

const recentActivity = ref([
  {
    id: 1,
    type: "create",
    icon: "plus",
    description: "Created new presentation 'Marketing Strategy'",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: "edit",
    icon: "edit",
    description: "Updated slides in 'Q4 Sales Review'",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: 3,
    type: "share",
    icon: "share",
    description: "Shared 'Product Roadmap 2025' with team",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  }
]);

const storageUsed = ref(2.4);
const storageLimit = ref(10);
const storagePercentage = computed(() => Math.round((storageUsed.value / storageLimit.value) * 100));

function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffHours >= 24) return formatDate(date);
  if (diffHours > 0) return `${diffHours}h ago`;
  return `${diffMinutes}m ago`;
}

function getStatusClass(status: string): string {
  const classes = {
    'Published': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Live': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
}

function getActivityIcon(type: string): string {
  const classes = {
    'create': 'bg-green-100 text-green-600 dark:bg-green-900/30',
    'edit': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    'share': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30';
}

function openPresentation(id: number): void {
  navigateTo(`/presentation/${id}`);
}

function editPresentation(id: number): void {
  navigateTo(`/presentation/${id}/edit`);
}

function sharePresentation(id: number): void {
  console.log(`Share presentation ${id}`);
}

function handleJoinSession(): void {
  console.log('Join session clicked');
}
</script>
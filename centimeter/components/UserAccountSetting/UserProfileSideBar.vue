<template>
  <aside class="bg-[var(--bg-color)] w-64 min-h-screen p-4 flex flex-col">
    <nuxt-link to="/app" class="p-3 cursor-pointer flex items-center gap-3 hover:bg-[var(--faded-bg-color-light)]">
      <img src="/logo/logo.png" class="w-8 h-8" alt="" />
    </nuxt-link>
    <nuxt-link to="/app" class="flex items-center gap-3 p-3 my-5 rounded-md">
      <ArrowLeft class="w-5 h-5 text-[var(--faded-text-color)]" />
      <span class="text-[var(--faded-text-color)] font-semibold text-sm"> Back to Home </span>
    </nuxt-link>
    <div class="flex flex-col gap-4 p-4">
      <div v-for="section in navItems" :key="section.category">
        <p class="text-xs font-normal text-[var(--faded-text-color)] mb-2">
          {{ section.category }}
        </p>
        <div class="flex flex-col gap-1">
          <div v-for="item in section.items">
            <nuxt-link :key="item.path" :to="item.path" class="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--gray)] transition-colors duration-200">
              <component v-if="item.icon" :is="item.icon" class="w-5 h-5 text-[color:var(--text-color)] dark:text-[color:var(--text-color)]" />
              <span class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)] text-sm">
                {{ item.name }}
              </span>
            </nuxt-link>
            <div v-if="item.children" class="ml-6 flex flex-col gap-1 mt-1">
              <nuxt-link
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                class="flex items-center gap-2 p-2 rounded-md text-sm text-[var(--faded-text-color)] transition-colors duration-200"
              >
                <span>{{ child.name }}</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-[var(--faded-bg-color)] p-4 mt-auto space-y-2">
      <a v-for="b in bottom" href="#" class="block text-xs text-[var(--faded-text-color)] hover:text-[var(--text-color)]">{{ b.name }}</a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ChartNoAxesColumn, ArrowLeft, Bolt, UserRoundPen } from "lucide-vue-next";
//FIX THE PATHS IF NEEDED
const navItems = [
  {
    category: "My Profile",
    items: [{ name: "Account settings", path: "/user/profile", icon: Bolt }]
  },
  {
    category: "My Workspace",
    items: [
      {
        name: "Workspace settings",
        path: "/app/workspace",
        icon: ChartNoAxesColumn,
        children: [
          { name: "General", path: "/app/workspace" },
          { name: "Permissions", path: "/app/workspace/permissions" },
          { name: "Security", path: "/app/workspace/security" }
        ]
      },
      { name: "Manage members", path: "/app/teams", icon: UserRoundPen }
    ]
  }
];
const bottom = [
  { name: "Templates", path: "#" },
  { name: "Integrations", path: "#" },
  { name: "Merit Academy", path: "#" },
  { name: "Help", path: "#" },
  { name: "Trash", path: "#" }
];
</script>

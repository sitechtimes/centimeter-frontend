<template>
  <section class="">
    <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 flex gap-5 items-center">
      Email
      <span v-if="isVerified" class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700"> Verified </span>
    </h2>

    <p class="mt-2 text-sm text-gray-600">
      Your email is <span class="font-medium text-gray-900">{{ email }}</span>
    </p>
  </section>

  <section>
    <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 flex gap-5 items-center">Password</h2>
    <div class="mt-4 flex items-center justify-between rounded-lg border p-4">
      <p class="text-sm text-gray-500">Last changed {{ lastPasswordChange }}</p>
      <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">Change password</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
const username = ref("username123");
const email = ref("edsiaohdfos@gmail.com");
const isVerified = ref(true);

const lastPasswordChange = ref("2 months ago");
</script>

<style scoped></style>

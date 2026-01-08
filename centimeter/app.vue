<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const route = useRoute();
const config = useRuntimeConfig();

useSeoMeta({
  ogTitle: "Centimeter",
  ogImage: () => config.public.url + "/logo/logo.png",
  twitterImage: () => config.public.url + "/logo/logo.png",
  twitterCard: "summary_large_image",
  ogDescription:
    "Featuring features fraught with a few fixes featured in many of your favorite apps and websites, Centimeter enables the imagination of anyone looking to build modern, sleek, and top-quality presentations.",
  ogSiteName: "Centimeter",
  ogUrl: () => config.public.url as string
});

onBeforeMount(() => {
  sessionStorage.removeItem("previousIsHome");

  if (userStore.theme === "dark") {
    document.body.classList.add("dark");
  }
  document.body.style.display = "flex";
});
</script>

<style lang="scss" scoped></style>

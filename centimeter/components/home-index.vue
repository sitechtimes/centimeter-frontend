<template>
  <div>
    <main class="flex flex-col items-center text-center gap-20 bg-color-white dark:bg-color-black ">
      <section class="flex flex-col gap-3 items-center mt-10">
        <h1 class="text-6xl">What will you ask your audience?</h1>
        <p class="text-2xl">Turn presentations into conversations with interactive polls that engage meetings and classrooms.</p>
        <button
          class="bg-black text-white dark:bg-white dark:text-black capsule"
        >
          Get started, it's free
        </button>
        <p class="text-sm text-gray-600 dark:text-gray-300">No credit card needed</p>
      </section>
      <div class="video-container">
        <video loop autoplay muted src="https://static.mentimeter.com/static/motion/Square.mp4"></video>
      </div>
      <section class="flex flex-col gap-3 items-center">
        <p class="rounded bg-gray-200 dark:bg-gray-800">Audience experience</p>
        <h2 class="text-5xl">From presentations to conversations</h2>
        <p class="text-xl">Centimeter ensures all voices are heard, even those who might not usually speak up. Anonymous questions means your audience won't be afraid to ask and engage.</p>
        <div class="flex gap-6">
          <button class="capsule switcher active">one</button>
          <button class="capsule switcher">two</button>
        </div>
      </section>
      <div id="container" style="width: 500px; height: 400px"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
section {
  max-width: 800px;
  overflow-x: hidden;
}

.capsule {
  min-width: 100px;
  padding: 10px;
  width: 25%;
  border-radius: 500px;
  font-weight: 600;
}

.switcher {
  background-color: rgb(229 231 235);
}

.dark .switcher {
  background-color: rgb(55 65 81);
}

.switcher.active {
  background-color: white;
  border: 2px solid black;
}

.dark .switcher.active {
  background-color: black;
  border: 2px solid white;
}

.rounded {
  min-width: fit-content;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
}

.video-container {
  display: flex;
  background-image: url(https://static.mentimeter.com/static/images/BKGIMAGENU.svg);
  background-position: center;
  background-size: cover;
  justify-content: center;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}

video {
  max-width: 1030px;
  border-radius: 10px;
  border: 4px solid lightgray;
}
</style>

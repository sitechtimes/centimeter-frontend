<template>
  <div class="h-screen flex items-center justify-center bg-[var(--faded-bg-color-light)] p-6">
    <div
      role="region"
      aria-label="Presentation canvas"
      class="relative w-full h-full 
             max-w-[min(96vw,calc((100vh-6rem)*16/9))] 
             max-h-[min(calc(100vh-6rem),calc(96vw*9/16))] 
             aspect-video 
             bg-[var(--faded-bg-color)] 
             rounded-[6px] 
             shadow-[0_10px_30px_rgba(0,0,0,0.12)] 
             border border-[rgba(0,0,0,0.06)] 
             overflow-hidden"
    >

    </div>
  </div>
</template>
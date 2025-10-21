<template>
  <div
    class="bg-[var(--primary-light)] mb-16"
  >
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center justify-between gap-4">
        <div class="w-8 flex-shrink-0"></div>


        <div class="flex items-center gap-4 flex-1 justify-center">
          <span class="text-[var(--text-color)] font-semibold whitespace-nowrap">
            Enter code to join a live Menti
          </span>
          
          <div class="flex items-center gap-2">
            <input
            placeholder="12345678"
              type="text"
              class="bg-[var(--bg-color)] text-[var(--text-color)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent w-30"
            />
            
            <button
              class="bg-[var(--faded-bg-color)] text-[var(--faded-text-color)] hover:bg-[var(--primary-shade-translucent)] px-6 py-2 font-semibold rounded-3xl transition-colors duration-200 cursor-pointer"
            >
              Join
            </button>
          </div>
        </div>
        
        <button>
            <i class="pi pi-times cursor-pointer text-[var(--text-color)]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

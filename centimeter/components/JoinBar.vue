<template>
  <div
    class="bg-blue-100"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-4">
        <div class="w-8 flex-shrink-0"></div>
        

        <div class="flex items-center gap-4 flex-1 justify-center">
          <span class="text-black font-semibold whitespace-nowrap">
            Enter code to join a live Menti
          </span>
          
          <div class="flex items-center gap-2">
            <input
            placeholder="12345678"
              type="text"
              class="px-4 py-2 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent w-30"
            />
            
            <button
              class="px-6 py-2 bg-gray-300 text-gray-500  font-semibold rounded-3xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              Join
            </button>
          </div>
        </div>
        
        <!-- X Button -->
        <button>
            <i class="pi pi-times cursor-pointer text-black"></i>
        </button>
      </div>
    </div>
  </div>
</template>

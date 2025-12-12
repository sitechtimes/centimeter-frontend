<template>
    <div class="bg-[var(--bg-color)] dark:bg-[var(--bg-color)] w-1/6">
        <div class="cursor-pointer transition-all hover:bg-[var(--gray)] rounded-md">
        <nuxt-link to="/app" class="">
            <ArrowLeft class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)]"/>
            <h3 class="text-[color:var(--text-color)] dark:text-[color:var(--text-color)]">Back To Home</h3>
        </nuxt-link>
        </div>  
    </div>
    
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/main.css'],
  modules: [
    '@pinia/nuxt',
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
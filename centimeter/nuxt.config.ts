// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-11-16",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern"
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      url: import.meta.env.VITE_URL
    }
  },
  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
  pinia: {
    storesDirs: ["./stores/**"]
  },
  piniaPersistedstate: {
    storage: "localStorage"
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: "Centimeter",
      meta: [
        { charset: "UTF-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        {
          hid: "description",
          name: "description",
          content:
            "Featuring features fraught with a few fixes featured in many of your favorite apps and websites, Centimeter enables the imagination of anyone looking to build modern, sleek, and top-quality presentations."
        }
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo/logo.svg" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap"
        }
      ]
    }
  }
});

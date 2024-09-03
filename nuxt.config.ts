// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "nuxt-headlessui",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  router: {
    options: {
      // scrollBehaviorType: "smooth",
    },
  },
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.scss", { injectPosition: "first" }],
    configPath: "tailwind.config.ts",
  },
  headlessui: {
    prefix: "Headless",
  },
  colorMode: {
    preference: "system",
  },
  devServer: {
    host: ["localhost", "192.168.100.227"],
  },
});

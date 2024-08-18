// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "nuxt-headlessui",
    "@nuxtjs/color-mode",
  ],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.scss", { injectPosition: "first" }],
    configPath: "tailwind.config.ts",
  },
  headlessui: {
    prefix: "Headless",
  },
  devServer: {
    host: ["localhost", "192.168.100.227"],
  },
});

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
    "nuxt-auth-sanctum",
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
  sanctum: {
    baseUrl: "http://localhost:8000",
    endpoints: {
      login: "/auth/login",
      logout: "/auth/logout",
      user: "/api/v1/user",
    },
    redirect: {
      onLogin: false,
      onLogout: "/signin",
      onGuestOnly: "/",
      onAuthOnly: "/signin"
    },
  },
});

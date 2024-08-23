import { authRoutes } from "./auth-routes";
import type { NuxtPage } from "nuxt/schema";

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
    "@formkit/auto-animate/nuxt",
  ],
  hooks: {
    "pages:extend"(pages) {
      // add route
      pages.push(...authRoutes);

      // remove routes
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove: NuxtPage[] = [];
        for (const page of pages) {
          if (page.file && pattern.test(page.file)) {
            pagesToRemove.push(page);
          } else {
            removePagesMatching(pattern, page.children);
          }
        }
        for (const page of pagesToRemove) {
          pages.splice(pages.indexOf(page), 1);
        }
      }
      removePagesMatching(/\.ts$/, pages);
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
      login: "/login",
      logout: "/logout",
      user: "/api/user",
    },
    redirect: {
      onAuthOnly: "/signin",
      onLogout: "/signin",
      onLogin: false,
    },
  },
});

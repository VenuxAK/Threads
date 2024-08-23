import type { NuxtPage } from "@nuxt/schema";

export const authRoutes: NuxtPage[] = [
  { name: "signin", path: "/signin", file: "~/pages/auth/signin.vue" },
  { name: "signup", path: "/signup", file: "~/pages/auth/signup.vue" },
  {
    name: "forgot-password",
    path: "/forgot-password",
    file: "~/pages/auth/forgot-password.vue",
  },
  {
    name: "password-reset",
    path: "/password-reset/:token",
    file: "~/pages/auth/password-reset/[token].vue",
  },
];

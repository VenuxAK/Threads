<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <nav class="mobile-navbar">
    <div class="w-[55%] flex justify-between items-center">
      <div>
        <NuxtLink href="/">
          <Logo />
        </NuxtLink>
      </div>
      <SidebarMenu />
    </div>
  </nav>
  <div
    :class="[
      'sm:hidden w-full bg-white dark:bg-dark flex',
      route.path == '/' || route.path == '/following' ? 'mt-16' : 'invisible',
    ]"
  >
    <div class="w-[50%] text-center">
      <NuxtLink
        href="/"
        class="nav-link"
        :class="route.path === '/' ? 'link-active' : ''"
        >For you</NuxtLink
      >
    </div>
    <div class="w-[50%] text-center">
      <NuxtLink
        href="/following"
        class="nav-link"
        :class="route.path === '/following' ? 'link-active' : ''"
        >Following</NuxtLink
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-navbar {
  @apply w-full sm:hidden fixed top-0 z-[99] flex justify-end items-center p-3 
        bg-white/90 backdrop-filter backdrop-blur-sm dark:bg-dark/80;
}
.nav-link {
  @apply block py-4 border-b-2 border-gray-200 dark:border-gray-700;
}
.link-active {
  @apply border-b-black dark:border-b-white;
}
</style>

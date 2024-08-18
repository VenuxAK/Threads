<script lang="ts" setup>
const route = useRoute();
// console.log(route.path);
</script>

<template>
  <nav class="mobile-navbar">
    <div class="w-[55%] flex justify-between items-center">
      <div>
        <Logo class="" />
      </div>
      <div>
        <button
          class="text-gray-400 hover:text-black dark:text-lightGray dark:hover:text-white transition-all"
        >
          <Icon name="ci:menu-alt-02" size="30px" />
        </button>
      </div>
    </div>
  </nav>
  <div class="mt-16 w-full bg-white dark:bg-dark flex">
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
  @apply w-full sm:hidden fixed top-0 z-50 flex justify-end items-center p-3 
        bg-white/90 backdrop-filter backdrop-blur-sm dark:bg-dark/80;
}
.nav-link {
  @apply block py-4 border-b-2 border-gray-200 dark:border-gray-700;
}
.link-active {
  @apply border-b-black dark:border-b-white;
}
</style>

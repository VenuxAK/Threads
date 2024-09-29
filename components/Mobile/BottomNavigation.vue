<script lang="ts" setup>
const user = useSanctumUser();
const items = ref([
  {
    id: 1,
    name: "Home",
    link: "/",
    icon: "teenyicons:home-solid",
    class: "mobile-menu-item",
  },
  {
    id: 2,
    name: "Search",
    link: "/search",
    icon: "mingcute:search-line",
    class: "mobile-menu-item",
  },
  {
    id: 3,
    name: "Thread",
    link: "/create",
    icon: "mingcute:edit-line",
    class: "mobile-menu-item",
  },
  {
    id: 4,
    name: "Notifications",
    link: "/notifications",
    icon: "gravity-ui:heart",
    class: "mobile-menu-item",
  },
  {
    id: 5,
    name: "Profile",
    link: `/@${user.value.username}`,
    icon: "gravity-ui:person",
    class: "mobile-menu-item",
  },
]);
</script>

<template>
  <!-- Mobile view bottom navigation -->
  <div class="mobile-menu">
    <div class="mobile-menu-items">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :href="item.link"
        :class="item.class"
      >
        <Icon :name="item.icon" size="25px" />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-menu {
  // @apply fixed sm:hidden bottom-0 left-0 z-50 w-full h-[70px] bg-white/20 backdrop-filter backdrop-blur-md border-t
  //       dark:bg-dark/80  dark:backdrop-blur-sm dark:border-dark;
  @apply fixed sm:hidden bottom-0 left-0 z-[99] w-full h-[70px]
     bg-white/90 backdrop-filter backdrop-blur-sm dark:bg-dark/80;

  .mobile-menu-items {
    @apply grid h-full max-w-lg grid-cols-5 mx-auto font-medium;

    .mobile-menu-item {
      @apply inline-flex flex-col items-center justify-center px-5 text-gray-400 hover:bg-lightGray/5 rounded-md dark:hover:bg-darkGray/50 dark:text-gray-600 transition-all;

      &.router-link-active {
        @apply text-black dark:text-white;
      }
    }
  }
}
</style>

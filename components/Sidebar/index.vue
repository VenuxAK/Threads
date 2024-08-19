<script lang="ts" setup>
const items = ref([
  {
    id: 1,
    name: "Home",
    link: "/",
    icon: "teenyicons:home-solid",
    class: "menu-item",
  },
  {
    id: 2,
    name: "Search",
    link: "/search",
    icon: "mingcute:search-line",
    class: "menu-item",
  },
  {
    id: 3,
    name: "Thread",
    link: "/create",
    icon: "mingcute:edit-line",
    class: "menu-item sm:hidden",
  },
  {
    id: 4,
    name: "Notifications",
    link: "/notifications",
    icon: "gravity-ui:heart",
    class: "menu-item",
  },
  {
    id: 5,
    name: "Account",
    link: "/account",
    icon: "gravity-ui:person",
    class: "menu-item",
  },
]);
</script>

<template>
  <!-- Tablet and Desktop view sidebar -->
  <div
    class="fixed top-0 left-0 w-[90px] hidden sm:block h-screen z-10"
  >
    <div class="sidebar">
      <div>
        <NuxtLink href="/">
          <Logo />
        </NuxtLink>
      </div>
      <div class="menu">
        <div class="menu-items">
          <NuxtLink
            :href="item.link"
            :class="item.class"
            v-for="item in items"
            :key="item.id"
          >
            <Icon :name="item.icon" class="menu-item-icon" size="25px" />
          </NuxtLink>
        </div>
      </div>
      <SidebarMenu />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  @apply w-full h-screen sm:flex bg-white dark:bg-dark flex-col justify-between items-center py-4;

  .menu {
    .menu-items {
      @apply flex flex-col space-y-4 w-full;
      .menu-item {
        @apply hover:bg-gray-100 px-3 py-2 rounded-lg text-gray-400 transition-all dark:hover:bg-darkGray/50;
        &.router-link-active {
          @apply text-black dark:text-white;
        }
      }
    }
  }
}
</style>

<script lang="ts" setup>
const route = useRoute();
const routeName = computed(() => {
  // route.name == "index" ? "For you" : useUseCaptitalize(route.name)
  if (route.name == "index") {
    return "For you";
  } else if (route.name.startsWith("@")) {
    return "Profile";
  } else {
    return useCaptitalize(route.name);
  }
});

const items = ref([
  {
    id: 1,
    name: "For You",
    link: "/",
  },
  {
    id: 2,
    name: "Following",
    link: "/following",
  },
  {
    id: 3,
    name: "Liked",
    link: "/liked",
  },
  {
    id: 4,
    name: "Saved",
    link: "/saved",
  },
]);
</script>

<template>
  <div class="navbar">
    <HeadlessMenu
      as="div"
      class="relative text-left w-full flex justify-center"
    >
      <div>
        <HeadlessMenuButton class="flex items-center">
          <span class="font-semibold text-base">{{ routeName }}</span>
          <Icon
            name="gg:chevron-down-o"
            class="-mr-1 ml-2 text-lightGray dark:text-white hover:scale-110 transition-all"
            size="25px"
          />
        </HeadlessMenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <HeadlessMenuItems class="navbar-menu-items">
          <div class="px-1 py-1">
            <HeadlessMenuItem
              v-slot="{ active, close }"
              v-for="item in items"
              :key="item.id"
              as="div"
            >
              <NuxtLink
                :href="item.link"
                @click="close"
                class="menu-item"
                :aria-current-value="item.name"
              >
                <span class="">{{ item.name }}</span>

                <Icon
                  v-if="route.path == item.link"
                  name="f7:checkmark"
                  class="text-dark dark:text-white"
                  size="20px"
                />
              </NuxtLink>
            </HeadlessMenuItem>
          </div>
        </HeadlessMenuItems>
      </transition>
    </HeadlessMenu>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  @apply w-full hidden sm:flex justify-center items-center bg-white dark:bg-dark py-3 fixed top-0 z-10;
  .navbar-menu-items {
    @apply absolute top-8 left-[50%] right-[50%] translate-x-[-50%] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-darkGray shadow-lg ring-1 ring-black/5 focus:outline-none px-2 py-1;

    .menu-item {
      @apply text-gray-900 dark:text-white font-bold w-full flex justify-between items-center rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-lightGray/10;
    }
  }
}
</style>

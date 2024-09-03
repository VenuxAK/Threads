<template>
  <HeadlessMenu as="div" class="relative inline-block text-left">
    <div>
      <HeadlessMenuButton
        @click="() => isApperenceOpen ?? false"
        class="text-gray-400 hover:text-black dark:text-lightGray dark:hover:text-white transition-all"
      >
        <Icon
          class="hidden sm:block"
          name="heroicons-outline:menu-alt-2"
          size="25px"
        />
        <Icon class="sm:hidden" name="ci:menu-alt-02" size="30px" />
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
      <HeadlessMenuItems class="menu-items">
        <div class="px-1 py-1">
          <HeadlessMenuItem v-slot="{ active, close }">
            <button
              class="menu-item"
              @click="
                () => {
                  close();
                  isApperenceOpen = true;
                }
              "
            >
              Apperence
            </button>
          </HeadlessMenuItem>
          <HeadlessMenuItem v-slot="{ active, close }">
            <button class="menu-item" @click="handleClose(close, '/settings')">
              Settings
            </button>
          </HeadlessMenuItem>
          <HeadlessMenuItem v-slot="{ active, close }" v-if="width < 640">
            <button class="menu-item" @click="handleClose(close, '/saved')">
              Saved
            </button>
          </HeadlessMenuItem>
          <HeadlessMenuItem v-slot="{ active, close }" v-if="width < 640">
            <button class="menu-item" @click="handleClose(close, '/liked')">
              Your likes
            </button>
          </HeadlessMenuItem>
        </div>
        <div class="p-1">
          <HeadlessMenuItem v-slot="{ active, close }">
            <button
              class="menu-item"
              @click="
                () => {
                  onSignOut();
                  handleClose(close);
                }
              "
            >
              Sign out
            </button>
          </HeadlessMenuItem>
        </div>
      </HeadlessMenuItems>
    </transition>

    <Apperence
      :is-apperence-open="isApperenceOpen"
      @close-apperence="isApperenceOpen = false"
    />
  </HeadlessMenu>
</template>

<script lang="ts" setup>
const router = useRouter();
const { width, height } = useWindowSize();
let isApperenceOpen = ref(false);
const { signOut } = useAuth();

const onSignOut = async () => {
  await signOut();
};

const handleClose = (close, link = null) => {
  close();
  if (link) {
    router.push(link);
  }
};
</script>

<style lang="scss" scoped>
.menu-items {
  @apply absolute right-0 sm:left-12 sm:-top-36 z-50 p-1 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-dark rounded-md bg-white dark:bg-darkGray shadow-lg ring-1 ring-black/5 focus:outline-none;

  .menu-item {
    @apply text-gray-900 dark:text-white font-bold w-full flex justify-between items-center rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-lightGray/10;
  }
}
</style>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <HeadlessMenuItems
      class="absolute z-[50] right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-darkGray rounded-xl bg-white dark:bg-dark border border-darkGray shadow-lg ring-1 ring-black/5 focus:outline-none"
    >
      <div class="px-1 py-1">
        <!-- active ? 'bg-violet-500 text-white' : 'text-gray-900', -->
        <HeadlessMenuItem v-slot="{ active }">
          <button :class="['post-header-menu-btn']">
            Save
            <Icon
              name="material-symbols:bookmark-outline"
              class="absolute right-2 text-xl"
            />
          </button>
        </HeadlessMenuItem>
        <HeadlessMenuItem v-slot="{ active }">
          <button :class="['post-header-menu-btn']">
            Report
            <Icon
              name="flowbite:exclamation-circle-outline"
              class="absolute right-2 text-xl text-red-600"
            />
          </button>
        </HeadlessMenuItem>
      </div>
      <div class="px-1 py-1">
        <HeadlessMenuItem v-slot="{ active }">
          <button :class="['post-header-menu-btn']">
            Copy link
            <Icon
              name="flowbite:link-outline"
              class="absolute right-2 text-xl"
            />
          </button>
        </HeadlessMenuItem>
      </div>
    </HeadlessMenuItems>
  </transition>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.post-header-menu-btn {
  @apply relative flex w-full items-center rounded-md px-4 py-2 text-base text-white hover:bg-darkGray font-semibold;
}
</style>

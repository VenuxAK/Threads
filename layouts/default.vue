<template>
  <div class="relative">
    <Navigation />
    <main
      class="sm:ml-[90px] sm:mt-12 sm:w-[calc(100%-90px)] h-auto md:pt-3 flex justify-center relative"
    >
      <div
        class="w-full sm:w-[560px] pb-28 lg:pb-0 md:w-[640px] dark:bg-white/[0.02] border-t border-x border-gray-300 dark:border-darkGray sm:rounded-3xl min-h-screen"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<!-- <MobileBottomNavigation /> -->
<script setup lang="ts"></script>

<style scoped lang="scss"></style>

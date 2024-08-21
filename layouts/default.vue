<template>
  <div class="relative">
    <Navigation />
    <main
      class="sm:ml-[90px] sm:mt-12 sm:w-[calc(100%-90px)] h-screen py-3 flex justify-center"
    >
      <div class="w-full sm:w-[550px] md:w-[630px]">
        <slot />
      </div>
    </main>
  </div>
</template>

<!-- <MobileBottomNavigation /> -->
<script setup lang="ts"></script>

<style scoped lang="scss"></style>

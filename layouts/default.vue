<template>
  <div class="relative">
    <Navigation />
    <main class="sm:ml-[90px] sm:w-[calc(100%-90px)] h-screen p-3">
      <slot />
    </main>
  </div>
</template>

<!-- <MobileBottomNavigation /> -->
<script setup lang="ts"></script>

<style scoped lang="scss"></style>

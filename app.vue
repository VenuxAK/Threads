<script lang="ts" setup>
// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId());
const indicator = ref({
  height: 3,
  color:
    "repeating-linear-gradient(to right, rgb(0, 220, 130) 0%, rgb(52, 205, 254) 50%, rgb(0, 71, 225) 100%)",
});
</script>
<template>
  <NuxtLoadingIndicator :height="indicator.height" :color="indicator.color" />
  <NuxtLayout>
    <NuxtPage />
    <!-- <div class="my-24 invisible">
      &copy; Copyrights 2024. All Rights Reserved
    </div> -->
  </NuxtLayout>
</template>

<style>
/* .page-enter-active,
.page-leave-active {
  transition: all 300ms;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
} */
</style>
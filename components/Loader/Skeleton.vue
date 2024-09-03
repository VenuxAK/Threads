<template>
  <div v-if="loading" class="py-4 rounded w-full animate-pulse">
    <div class="flex pt-4 px-4 space-x-4">
      <div
        class="flex-shrink-0 w-16 h-16 rounded-full bg-gray-300 dark:bg-darkGray"
      ></div>
      <div class="flex-1 py-2 space-y-4">
        <div class="w-full h-3 rounded bg-gray-300 dark:bg-darkGray"></div>
        <div class="w-full h-3 rounded bg-gray-300 dark:bg-darkGray"></div>
      </div>
    </div>
    <div class="p-4 space-y-3">
      <div class="w-full h-3 rounded bg-gray-300 dark:bg-darkGray"></div>
      <div class="w-full h-3 rounded bg-gray-300 dark:bg-darkGray"></div>
      <div class="w-full h-3 rounded bg-gray-300 dark:bg-darkGray"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  loading: {
    required: false,
    default: true,
  },
});
</script>

<style></style>

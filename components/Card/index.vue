<template>
  <div
    class="w-full border-b dark:border-b-lightGray/20 sm:border dark:sm:border-lightGray/20 shadow sm:rounded-xl py-2 px-3"
    :class="class"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["class"]);
</script>

<style></style>

<template>
  <div
    class="w-full px-5 py-3"
    :class="extraClass"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  extraClass?: string;
}>();
</script>

<style></style>

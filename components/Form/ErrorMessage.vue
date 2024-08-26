<template>
  <span :class="['error-msg', error ? 'visible' : 'invisible']">
    {{ error ?? "Error" }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps(["error"]);
</script>

<style scoped lang="scss">
.error-msg {
  @apply text-red-600 font-bold text-sm pt-1;
}
</style>

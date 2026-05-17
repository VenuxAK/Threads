<template>
  <span v-if="error" class="error-msg">
    {{ error }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  error?: string | null;
}>();
</script>

<style scoped lang="scss">
.error-msg {
  @apply text-red-600 font-bold text-sm pt-1;
}
</style>

<template>
  <NuxtLink v-if="href" :href="href" class="signin-btn">
    <slot />
  </NuxtLink>
  <button v-else type="submit" class="signin-btn" :disabled="loading">
    <span
      v-if="loading"
      class="border-gray-300 h-5 w-5 animate-spin rounded-full border-4 border-t-blue-600"
    />
    <span v-else><slot /></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  href?: string;
}>();
</script>

<style scoped lang="scss"></style>

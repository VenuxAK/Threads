<template>
  <NuxtLink v-if="href" :href="href" class="signin-btn">
    <slot />
  </NuxtLink>
  <button v-else type="submit" class="signin-btn" :disabled="loading">
    <span
      v-show="loading"
      class="border-gray-300 h-5 w-5 animate-spin rounded-full border-4 border-t-blue-600"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    default: false,
  },
  href: {
    type: String,
    required: false,
  },
});
</script>

<style scoped lang="scss"></style>

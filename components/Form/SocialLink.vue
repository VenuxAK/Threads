<template>
  <button type="button" class="social-signin-btn">
    <Icon :name="icon" size="25" />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps(["icon"]);
</script>

<style scoped lang="scss"></style>

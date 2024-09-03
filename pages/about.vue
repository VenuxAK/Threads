<template>
  <div>
    <h1 class="page-title">About page</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "sanctum:auth",
});
</script>

<style scoped lang="scss"></style>

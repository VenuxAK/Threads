<script setup lang="ts">
definePageMeta({
  middleware: "sanctum:auth",
});
</script>

<template>
  <div>
    <h1 class="page-title">Settings page</h1>
  </div>
</template>

<style></style>

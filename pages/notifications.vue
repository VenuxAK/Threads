<template>
  <div>
    <h1 class="page-title">Notifications page</h1>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "sanctum:auth",
});
</script>

<style></style>

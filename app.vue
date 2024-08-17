<script lang="ts" setup>
// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId());
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

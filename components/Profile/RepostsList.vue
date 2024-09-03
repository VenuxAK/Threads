<template>
  <div class="space-y-4">
    <CardRepost v-if="posts" v-for="post in posts" :key="post" />
    <div v-else class="text-center text-gray-700 dark:text-gray-400">
      <LoaderSkeleton v-for="i in 2" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["posts"]);
</script>

<style></style>

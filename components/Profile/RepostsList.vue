<script lang="ts" setup>
const props = defineProps(["posts"]);
</script>

<template>
  <div v-if="posts?.length > 0" class="space-y-4">
    <CardRepost v-for="i in 10" />
  </div>
  <div v-else>
    <h3 class="text-center mt-4 text-gray-700 dark:text-gray-400">
      No posts yet
    </h3>
  </div>
</template>

<style></style>

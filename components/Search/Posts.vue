<script setup lang="ts">
import type { Post } from '~/types';

defineProps<{
  posts: Post[];
  loading: boolean;
}>();
</script>

<template>
  <div v-if="posts.length > 0">
    <div class="divide-y dark:divide-darkGray">
      <Post v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
  <div v-else-if="loading">
    <LoaderSkeleton v-for="i in 3" :key="i" />
  </div>
  <div v-else>No Posts Found</div>
</template>

<style scoped lang="scss"></style>

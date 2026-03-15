<script lang="ts" setup>
import type { Post } from '~/types';

defineProps<{
  posts?: Post[];
}>();
</script>

<template>
  <div class="space-y-4">
    <CardRepost v-if="posts" v-for="post in posts" :key="post.id" :repost="post" />
    <div v-else class="text-center text-gray-700 dark:text-gray-400">
      <LoaderSkeleton v-for="i in 2" :key="i" />
    </div>
  </div>
</template>

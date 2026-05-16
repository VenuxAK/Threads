<script lang="ts" setup>
import type { Post } from '~/types';

withDefaults(
  defineProps<{
    posts: Post[];
    loading?: boolean;
  }>(),
  {
    posts: () => [],
    loading: true,
  },
);
</script>

<template>
  <div>
    <div v-if="loading" class="divide-y divide-darkGray">
      <LoaderSkeleton v-for="i in 2" :key="i" :loading="true" />
    </div>
    <div
      v-else-if="posts.length === 0"
      class="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
    >
      No reposts yet
    </div>
    <div v-else class="divide-y divide-darkGray">
      <CardRepost v-for="post in posts" :key="post.id" :repost="post" />
    </div>
  </div>
</template>

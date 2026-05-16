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
    <div v-else class="divide-y divide-darkGray">
      <Post v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

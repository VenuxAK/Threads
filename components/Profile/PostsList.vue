<script lang="ts" setup>
import type { Post } from '~/types';

defineProps<{
  posts: Post[];
  loading?: boolean;
}>();
</script>

<template>
  <div>
    <div class="divide-y divide-darkGray">
      <LoaderSkeleton v-for="i in 2" :key="i" :loading="!loading" />
    </div>
    <div class="divide-y divide-darkGray">
      <Post v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

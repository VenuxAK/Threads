<template>
  <div class="space-y-3">
    <h1 class="page-title">Liked</h1>

    <div v-if="likedPosts.length === 0 && !loading" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">You haven't liked any posts yet</p>
    </div>

    <div
      class="w-full divide-y divide-gray-300 dark:divide-darkGray"
      v-if="likedPosts.length > 0"
    >
      <Post v-for="post in likedPosts" :key="post.id" :post="post" />
    </div>

    <div class="divide-y divide-gray-300 dark:divide-darkGray">
      <LoaderSkeleton v-for="i in 3" :key="i" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Post } from '~/types';

/**
 * Liked Posts View.
 *
 * Fetches the authenticated user's liked posts via the GraphQL `myLikedPosts` query.
 * Replaces the previous client-side memory filter with a true server-backed query.
 */
definePageMeta({
  middleware: "sanctum:auth",
});

const { getMyLikedPosts } = useUser();
const loading = ref(true);
const likedPosts = ref<Post[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    const result = await getMyLikedPosts(1);
    likedPosts.value = result.posts;
  } catch (err) {
    console.error('Failed to load liked posts:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl mb-4;
}
</style>

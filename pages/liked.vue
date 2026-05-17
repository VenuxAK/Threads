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

definePageMeta({
  middleware: "sanctum:auth",
});

const postsStore = usePostsStore();
const interactionsStore = useInteractionsStore();
const { loadPosts } = usePostList();

const loading = ref(true);

const likedPosts = computed<Post[]>(() => {
  return postsStore.posts.filter(post => interactionsStore.isPostLiked(post.id.toString()));
});

onMounted(async () => {
  await loadPosts();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl mb-4;
}
</style>

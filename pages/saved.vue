<script setup lang="ts">
import type { Post } from "~/types";

/**
 * Saved Posts Page.
 * Displays threads bookmarked by the authenticated user via the `mySavedPosts` GraphQL query.
 * Supports infinite scrolling, opening comments, and optimistic bookmark removal.
 */
definePageMeta({
  middleware: "sanctum:auth",
});

const { getMySavedPosts } = useSavePost();

const posts = ref<Post[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);
const loadTrigger = ref<HTMLElement | null>(null);

const selectedPost = ref<Post | null>(null);
const isCommentsModalOpen = ref(false);

const openComments = (post: Post) => {
  selectedPost.value = post;
  isCommentsModalOpen.value = true;
};

const closeComments = () => {
  isCommentsModalOpen.value = false;
  selectedPost.value = null;
};

const fetchSaved = async (page: number = 1, append: boolean = false) => {
  if (append && loadingMore.value) return;

  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const result = await getMySavedPosts(page);
    if (result && result.posts) {
      if (append) {
        posts.value = [...posts.value, ...result.posts];
      } else {
        posts.value = result.posts;
      }

      if (result.pagination) {
        hasMore.value = result.pagination.current_page < result.pagination.last_page;
        currentPage.value = result.pagination.current_page;
      } else {
        hasMore.value = false;
      }
    }
  } catch (err) {
    console.error('Failed to load saved posts:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value && !loading.value) {
    fetchSaved(currentPage.value + 1, true);
  }
};

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await fetchSaved(1, false);

  if (import.meta.client) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    nextTick(() => {
      if (loadTrigger.value && observer) {
        observer.observe(loadTrigger.value);
      }
    });
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div class="space-y-3 sm:divide-y divide-gray-300 dark:divide-darkGray">
    <div class="p-4 border-b border-gray-200 dark:border-white/10">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
        <Icon name="ph:bookmark-simple-fill" class="text-amber-500" size="22px" />
        <span>Saved Posts</span>
      </h1>
    </div>

    <!-- Posts Feed -->
    <div
      class="w-full divide-y divide-gray-300 dark:divide-darkGray"
      v-if="posts && posts.length > 0"
    >
      <Post
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @open-comments="openComments(post)"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && posts.length === 0" class="py-20 text-center px-4 space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
        <Icon name="ph:bookmark-simple" size="32px" />
      </div>
      <div class="space-y-1">
        <h3 class="font-bold text-lg text-gray-900 dark:text-white">No saved posts</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Save threads to read them later. Tap the bookmark icon on any post to add it here.
        </p>
      </div>
    </div>

    <!-- Skeleton Loaders -->
    <div class="divide-y divide-gray-300 dark:divide-darkGray" v-if="loading">
      <LoaderSkeleton v-for="i in 3" :key="i" :loading="loading" />
    </div>

    <!-- Infinite Scroll Trigger -->
    <div ref="loadTrigger" class="py-4 text-center">
      <div v-if="loadingMore" class="text-sm text-gray-500">
        <Loader />
      </div>
      <div
        v-else-if="!hasMore && posts.length > 0"
        class="text-sm text-gray-500"
      >
        No more saved posts
      </div>
    </div>

    <!-- Comments Modal -->
    <PostCommentsModal
      v-if="selectedPost"
      :post="selectedPost"
      :is-open="isCommentsModalOpen"
      @close="closeComments"
    />
  </div>
</template>

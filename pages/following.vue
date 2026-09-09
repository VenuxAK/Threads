<script setup lang="ts">
import type { Post } from "~/types";

/**
 * Following Feed Page.
 * Displays threads published exclusively by users the authenticated account follows.
 * Incorporates infinite scrolling via IntersectionObserver and comments modal interaction.
 */
definePageMeta({
  middleware: "sanctum:auth",
});

const { getFollowingFeed } = useFollow();
const uiStore = useUIStore();

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

const fetchFeed = async (page: number = 1, append: boolean = false) => {
  if (append && loadingMore.value) return;

  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const result = await getFollowingFeed(page);
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
    console.error('Failed to load following feed:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value && !loading.value) {
    fetchFeed(currentPage.value + 1, true);
  }
};

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await fetchFeed(1, false);

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
    <!-- Quick Thread Creation Box -->
    <Card class="hidden sm:block">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div>
            <NuxtLink href="/">
              <Avatar />
            </NuxtLink>
          </div>
          <div>
            <button
              class="cursor-pointer text-sm font-medium text-lightGray dark:text-lightGray/70 hover:text-black dark:hover:text-white transition-colors"
              @click="uiStore.openCreatePostModal()"
            >
              Start a thread...
            </button>
          </div>
        </div>
        <div>
          <button
            class="text-[12px] font-bold border dark:text-white/80 dark:border-lightGray/40 rounded-md py-[3px] px-[10px] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            @click="uiStore.openCreatePostModal()"
          >
            Post
          </button>
        </div>
      </div>
    </Card>

    <ModalCreatePost
      :is-open="uiStore.isCreatePostModalOpen"
      @closeModal="uiStore.closeCreatePostModal()"
      @openModal="uiStore.openCreatePostModal()"
      @created="fetchFeed(1, false)"
    />

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
    <div v-else-if="!loading && posts.length === 0" class="py-16 text-center px-4 space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
        <Icon name="gravity-ui:person-plus" size="32px" />
      </div>
      <div class="space-y-1">
        <h3 class="font-bold text-lg text-gray-900 dark:text-white">Your following feed is empty</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Follow users and friends to see their latest threads and replies appear here.
        </p>
      </div>
      <div>
        <NuxtLink
          href="/search"
          class="inline-block bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Discover People
        </NuxtLink>
      </div>
    </div>

    <!-- Skeleton Loaders -->
    <div class="divide-y divide-gray-300 dark:divide-darkGray" v-if="loading">
      <LoaderSkeleton v-for="i in 4" :key="i" :loading="loading" />
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
        No more posts
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

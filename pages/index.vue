<script setup lang="ts">
import type { Post } from "~/types";
// import { LoaderSkeleton } from "../.nuxt/components";

definePageMeta({
  middleware: "sanctum:auth",
});

const uiStore = useUIStore();
const { posts, loading, loadingMore, hasMore, loadPosts, loadMore, addPost } =
  usePostList();
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

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await loadPosts();

  if (import.meta.client) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
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

const handleNewPost = (newPost: Post) => {
  addPost(newPost);
};
</script>

<template>
  <div class="space-y-3 sm:divide-y divide-gray-300 dark:divide-darkGray">
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
              class="cursor-pointer text-sm font-medium text-lightGray dark:text-lightGray/70"
              @click="uiStore.openCreatePostModal()"
            >
              Start a thread...
            </button>
          </div>
        </div>
        <div>
          <button
            class="text-[12px] font-bold border dark:text-white/80 dark:border-lightGray/40 rounded-md py-[3px] px-[10px]"
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
      @created="loadPosts()"
    />

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
    <div v-if="!loading && posts.length === 0">No posts yet</div>
    <div class="divide-y divide-gray-300 dark:divide-darkGray">
      <LoaderSkeleton v-for="i in 5" :key="i" :loading="loading" />
    </div>

    <div ref="loadTrigger" class="py-4 text-center">
      <div v-if="loadingMore" class="text-sm text-gray-500">
        <!-- Loading more... -->
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

<style lang="scss">
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl;
}
</style>

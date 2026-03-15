<script setup lang="ts">
definePageMeta({
  middleware: "sanctum:auth",
});
const { getPosts } = usePost();
const posts = ref<any[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const isOpenModal = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);
const loadTrigger = ref<HTMLElement | null>(null);

const loadPosts = async (page: number = 1, append: boolean = false) => {
  if (append && loadingMore.value) return;
  
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  
  const result = await getPosts(page);
  
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
  
  loading.value = false;
  loadingMore.value = false;
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    loadPosts(currentPage.value + 1, true);
  }
};

onMounted(async () => {
  await loadPosts();
  
  if (process.client) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { threshold: 0.1 });
    
    nextTick(() => {
      if (loadTrigger.value) {
        observer.observe(loadTrigger.value);
      }
    });
    
    onUnmounted(() => observer.disconnect());
  }
});

const handleNewPost = (newPost: any) => {
  posts.value = [newPost, ...posts.value];
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
              @click="() => (isOpenModal = true)"
            >
              Start a thread...
            </button>
          </div>
        </div>
        <div>
          <button
            class="text-[12px] font-bold border dark:text-white/80 dark:border-lightGray/40 rounded-md py-[3px] px-[10px]"
            @click="() => (isOpenModal = true)"
          >
            Post
          </button>
        </div>
      </div>
    </Card>

    <ModalCreatePost
      :is-open="isOpenModal"
      @closeModal="() => (isOpenModal = false)"
      @openModal="() => (isOpenModal = true)"
      @created="loadPosts()"
    />

    <div
      class="w-full divide-y divide-gray-300 dark:divide-darkGray"
      v-if="posts && posts.length > 0"
    >
      <Post v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <div v-if="!loading && posts.length === 0">No posts yet</div>
    <div class="divide-y divide-gray-300 dark:divide-darkGray">
      <LoaderSkeleton v-for="i in 3" :loading="loading" />
    </div>
    
    <div ref="loadTrigger" class="py-4 text-center">
      <div v-if="loadingMore" class="text-sm text-gray-500">Loading more...</div>
      <div v-else-if="!hasMore && posts.length > 0" class="text-sm text-gray-500">No more posts</div>
    </div>
  </div>
</template>

<style lang="scss">
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl;
}
</style>

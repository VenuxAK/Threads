<script setup lang="ts">
definePageMeta({
  middleware: "sanctum:auth",
});
const { getPosts } = usePost();
const posts = ref([]);
const loading = ref(true);
const isOpenModal = ref(false);

onMounted(async () => {
  loading.value = true;
  posts.value = await getPosts();
  loading.value = false;
});
</script>

]
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
    />

    <div
      class="w-full divide-y divide-gray-300 dark:divide-darkGray"
      v-if="posts && posts.length > 0"
    >
      <Post v-for="post in posts" :key="post" :post="post" />
    </div>
    <div v-if="!loading && posts.length === 0">No posts yet</div>
    <div class="divide-y divide-gray-300 dark:divide-darkGray">
      <LoaderSkeleton v-for="i in 3" :loading="loading" />
    </div>
  </div>
</template>

<style lang="scss">
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl;
}
</style>

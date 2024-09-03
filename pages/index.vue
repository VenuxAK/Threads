<script setup lang="ts">
const loading = ref(true);
const posts = ref([]);

const isOpenModal = ref(false);
const getPosts = async () => {
  loading.value = true;
  posts.value = await $fetch("http://localhost:8080/posts");
  loading.value = false;
  // console.log(posts.value);
};

onMounted(async () => {
  await getPosts();
});
</script>

]
<template>
  <div class="space-y-6">
    <Card class="hidden sm:block border-none">
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

    <div class="w-full" v-if="posts && posts.length > 0">
      <!-- Post card -->
      <PostCard v-for="post in posts" :key="post">
        <div class="content">
          <NuxtLink href="/@username/posts/post-test-slug">
            <p>{{ post.body }}</p>
          </NuxtLink>
          <!-- <div>post's images</div> -->
        </div>
      </PostCard>
    </div>
    <div v-if="!loading && posts.length === 0">No posts yet</div>
    <LoaderSkeleton v-for="i in 3" :loading="loading" />
  </div>
</template>

<style lang="scss">
.page-title {
  @apply text-purple-600 text-center font-bold text-3xl;
}
</style>

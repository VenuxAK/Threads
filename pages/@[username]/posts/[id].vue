<script lang="ts" setup>
import type { Post } from '~/types';

definePageMeta({
  middleware: "sanctum:auth",
});

const route = useRoute();
const { getPost } = usePost();
const post = ref<Post | null>(null);

const getPostIdParam = (): string => {
  const param = route.params.id;
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

onMounted(async () => {
  post.value = await getPost(getPostIdParam());
});
</script>

<template>
  <div>
    <Post :post="post" v-if="post" :show-replied="true" />
    <LoaderSkeleton :loading="!post" />
  </div>
</template>

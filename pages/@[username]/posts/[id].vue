<script lang="ts" setup>
definePageMeta({
  middleware: "sanctum:auth",
});
const route = useRoute();
const { getPost } = usePost();
const post = ref(null);

onMounted(async () => {
  post.value = await getPost(route.params.id);
});
</script>
<template>
  <div>
    <Post :post="post" v-if="post" :show-replied="true" />
    <LoaderSkeleton :loading="!post" />
  </div>
</template>

<style></style>

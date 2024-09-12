<script lang="ts" setup>
definePageMeta({
  middleware: "sanctum:auth",
});
const route = useRoute();
const { getPost } = usePost();
const post = ref(null);
post.value = await getPost(route.params.slug);
</script>
<template>
  <div>
    <Post :post="post" />
  </div>
</template>

<style></style>

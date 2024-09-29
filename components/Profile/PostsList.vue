<template>
  <LoaderSkeleton v-for="i in 2" :loading="!loading" />
  <Post v-for="post in posts" :key="post" :post="post" />
</template>

<script lang="ts" setup>
// const props = defineProps(["posts", "loading"]);
const props = defineProps({
  posts: {
    required: true,
    type: Array,
  },
  loading: {
    required: false,
    type: Boolean,
  },
});
</script>

<style></style>

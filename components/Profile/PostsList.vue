<template>
  <div>
    <div class="divide-y divide-darkGray">
      <LoaderSkeleton v-for="i in 2" :loading="!loading" />
    </div>
    <div class="divide-y divide-darkGray">
      <Post v-for="post in posts" :key="post" :post="post" />
    </div>
  </div>
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

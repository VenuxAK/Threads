<script lang="ts" setup>
const props = defineProps(["posts"]);
</script>

<template>
  <div v-if="posts?.length > 0">
    <PostCard>
      <div class="content">
        <NuxtLink href="/@username/posts/post-slug">
          <h1>My first thread</h1>
        </NuxtLink>
      </div>
    </PostCard>
  </div>
  <div v-else>
    <h3 class="text-center mt-4 text-gray-700 dark:text-gray-400">
      No posts yet
    </h3>
  </div>
</template>

<style></style>

<template>
  <div v-if="posts">
    <div>
      <PostCard>
        <div class="content">
          <h1>My first thread</h1>
        </div>
      </PostCard>
    </div>
  </div>
  <div v-else class="text-center text-gray-700 dark:text-gray-400">
    No posts yet
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["posts"]);
</script>

<style></style>

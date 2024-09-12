<template>
  <div v-if="posts">
    <div>
      <PostCard :post="post" v-for="post in posts" :key="post">
        <NuxtLink :href="`/@${post.author.username}/posts/${post.id}`">
          <div class="content">
            {{ post.content }}
          </div>
        </NuxtLink>
      </PostCard>
    </div>
  </div>
  <LoaderSkeleton v-for="i in 2" :loading="!posts.length" />
</template>

<script lang="ts" setup>
const props = defineProps(["posts"]);
</script>

<style></style>

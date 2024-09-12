<script lang="ts" setup>
const { showReplied } = defineProps({
  post: {
    required: true,
  },
  showReplied: {
    default: false,
  },
});
</script>

<template>
  <Card class="post-card" v-if="post">
    <PostHeader :post="post" />
    <div class="card-content">
      <NuxtLink :href="`/@${post.author.username}/posts/${post.id}`">
        <div>{{ post.content }}</div>
      </NuxtLink>
    </div>
    <PostFooter />
    <PostReplied v-if="showReplied" />
  </Card>
</template>

<style lang="scss" scoped>
.post-card {
  @apply mb-4;

  .card-content {
    @apply text-sm text-darkGray dark:text-white/90;
  }
}
</style>

<script lang="ts" setup>
const { showReplied, post } = defineProps({
  post: {
    required: true,
    type: Object,
  },
  showReplied: {
    default: false,
  },
});

const { sanitizeWithHashtags } = useSanitize();

// Computed property to format hashtags and preserve line breaks with sanitization
const formattedCaption = computed(() => {
  return sanitizeWithHashtags(post.content);
});
</script>

<template>
  <Card class="post-card" v-if="post">
    <PostHeader :post="post" />
    <div class="card-content">
       <NuxtLink :href="post.author && post.author.username ? `/@${post.author.username}/posts/${post.id}` : ''">
        <div v-html="formattedCaption"></div>
      </NuxtLink>
    </div>
    <PostFooter />
    <PostReplied v-if="showReplied" />
  </Card>
</template>

<style lang="scss" scoped>
.post-card {
  .card-content {
    @apply text-sm text-darkGray dark:text-white/90;
  }
}
</style>

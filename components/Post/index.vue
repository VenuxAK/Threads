<script lang="ts" setup>
import type { Post } from '~/types';

const props = defineProps<{
  post: Post;
  showReplied?: boolean;
}>();

const emit = defineEmits<{
  openComments: [];
}>();

const { sanitizeWithHashtags } = useSanitize();

const formattedCaption = computed(() => {
  return sanitizeWithHashtags(props.post.content);
});

const handleOpenComments = () => {
  emit('openComments');
};
</script>

<template>
  <Card class="post-card" v-if="post && post.content && post.author">
    <PostHeader :post="post" />
    <div class="card-content">
       <NuxtLink :href="post.author?.username ? `/@${post.author.username}/posts/${post.id}` : ''">
        <div v-html="formattedCaption"></div>
      </NuxtLink>
    </div>
    <PostFooter :post="post" @open-comments="handleOpenComments" />
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

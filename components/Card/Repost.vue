<script lang="ts" setup>
import type { Post } from '~/types';

defineProps<{
  repost: Post;
}>();
</script>

<template>
  <Card>
    <div class="flex items-center gap-2 px-1 text-xs text-lightGray font-semibold mb-1">
      <Icon name="ph:repeat-bold" size="14" />
      <span>Reposted</span>
    </div>
    <PostHeader :post="repost" />
    <div class="card-content">
      <NuxtLink
        :href="
          repost.author?.username
            ? `/@${repost.author.username}/posts/${repost.id}`
            : ''
        "
      >
        <p>{{ repost.content }}</p>
      </NuxtLink>
    </div>
    <PostFooter :post="repost" />
  </Card>
</template>

<style lang="scss" scoped>
.card-content {
  @apply text-sm text-darkGray dark:text-white/90;
}
</style>

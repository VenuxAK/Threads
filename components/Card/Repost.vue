<script lang="ts" setup>
import type { Post } from '~/types';

defineProps<{
  repost: Post;
}>();
</script>

<template>
  <Card>
    <PostHeader :post="repost" />
    <div class="content pl-10">
      <Card class="border border-lightGray/20 rounded-md">
        <div class="flex items-center space-x-3">
          <div>
            <NuxtLink :href="repost?.author?.username ? `/@${repost.author.username}` : ''"
              class="font-bold hover:underline">
              <Avatar :src="repost.author.avatar" />
            </NuxtLink>
          </div>
          <div class="flex items-center text-sm space-x-1">
            <NuxtLink :href="repost?.author?.username ? `/@${repost.author.username}` : ''"
              class="font-bold hover:underline">
              {{ repost?.author?.username ?? 'Username' }}
            </NuxtLink>
          </div>
          <span>.</span>
          <p>{{ repost?.published_at ?? '12h' }}</p>
        </div>

        <div class="content text-sm sm:text-base mt-2">
          <NuxtLink :href="repost?.id ? `/@${repost.author.username}/posts/${repost.id}` : ''">
            <p>{{ repost?.content ?? 'hello, there' }}</p>
          </NuxtLink>
          <div></div>
        </div>
      </Card>
    </div>
    <PostFooter :post="repost" />
  </Card>
</template>

<style></style>

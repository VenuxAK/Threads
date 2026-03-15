<template>
  <Card>
    <PostHeader />
    <div class="content pl-10">
      <Card class="border border-lightGray/20 rounded-md">
        <!-- Repost header -->
        <div class="flex items-center space-x-3">
          <div>
            <NuxtLink :href="repost && repost.author && repost.author.username ? `/@${repost.author.username}` : ''"
              class="font-bold hover:underline">
              <Avatar />
            </NuxtLink>
          </div>
          <div class="flex items-center text-sm space-x-1">
            <NuxtLink :href="repost && repost.author && repost.author.username ? `/@${repost.author.username}` : ''"
              class="font-bold hover:underline">
              {{ repost?.author?.username ?? 'Username' }}
            </NuxtLink>
          </div>
          <span>.</span>
          <p>{{ repost?.published_at ?? '12h' }}</p>
        </div>

        <!-- Repost content -->
        <div class="content text-sm sm:text-base mt-2">
          <!-- post content -->
          <NuxtLink :href="repost && repost.id ? `/@${repost.author.username}/posts/${repost.id}` : ''">
            <p>{{ repost?.content ?? 'hello, there' }}</p>
          </NuxtLink>
          <!-- post images -->
          <div></div>
        </div>
      </Card>
    </div>
    <PostFooter />
  </Card>
</template>

<script lang="ts" setup>
const props = defineProps({
  repost: {
    type: Object,
    required: true,
  },
});
</script>

<style></style>

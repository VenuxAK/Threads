<script lang="ts" setup>
const props = defineProps({
  post: {
    required: true,
  },
});
</script>

<template>
  <div class="card-header">
    <div class="flex items-center space-x-2">
      <div>
        <NuxtLink :href="`/@${post.author.username}`">
          <Avatar />
        </NuxtLink>
      </div>
      <div class="">
        <NuxtLink :href="`/@${post.author.username}`" class="space-x-2">
          <span class="text-sm font-semibold hover:underline">{{ post.author.username }}</span>
          <span class="text-xs text-dark/60 dark:text-white/50">{{ post.created_at }}</span>
        </NuxtLink>
      </div>
    </div>
    <div>
      <button>
        <Icon name="solar:menu-dots-bold" size="20px" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
  @apply flex justify-between items-center mb-2;
}
</style>

<script lang="ts" setup>
// const showReplied = define;
const { showReplied } = defineProps({
  showReplied: {
    default: false,
  },
});
</script>

<template>
  <Card class="post-card">
    <PostHeader />
    <div class="card-content">
      <slot />
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

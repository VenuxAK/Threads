<script lang="ts" setup>
const props = defineProps({
  post: {
    required: true, // Update to true later
    type: Object,
  },
});
const { createLike } = usePost();

const onLike = async (post_id: string) => {
  await createLike(post_id);
};
</script>

<template>
  <div class="card-footer">
    <div>
      <button @click="onLike(post.id)">
        <Icon name="ph:heart-bold" size="17px" />
        <span>{{ post.likes_count != 0 ? post.likes_count : "" }}</span>
      </button>
    </div>
    <div>
      <button>
        <Icon name="ant-design:message-outlined" size="17px" />
        <span>{{ post.comments_count != 0 ? post.comments_count : "" }}</span>
      </button>
    </div>
    <div>
      <button>
        <Icon name="akar-icons:arrow-repeat" size="17px" />
        <span>{{ post?.reposts ?? "" }}</span>
      </button>
    </div>
    <div>
      <button>
        <Icon name="lucide:send" size="17px" />
        <span></span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-footer {
  @apply -ml-2 flex space-x-6 mt-2;

  button {
    @apply hover:bg-dark/5 dark:hover:bg-lightGray/10 px-2 py-1 rounded-full flex items-center space-x-1 text-dark dark:text-white/80;

    span {
      @apply text-xs;
    }
  }
}
</style>

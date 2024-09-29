<script lang="ts" setup>
const props = defineProps({
  post: {
    required: false, // Update to true later
    type: Object,
  },
});
</script>

<template>
  <div class="card-footer">
    <div>
      <button>
        <Icon name="ph:heart-bold" size="17px" />
        <span>{{ post?.likes ?? "" }}</span>
      </button>
    </div>
    <div>
      <button>
        <Icon name="ant-design:message-outlined" size="17px" />
        <span>{{ post?.comments ?? "" }}</span>
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

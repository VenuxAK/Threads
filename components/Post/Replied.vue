<script lang="ts" setup>
const props = defineProps({
  comments: {
    required: true,
    type: Array,
  },
});
</script>

<template>
  <div class="post-replied">
    <div>
      <div>
        <PostCommentForm />
      </div>
      <div>
        <h5 class="text-sm font-bold">Replied</h5>
      </div>
      <div v-if="comments.length > 0">
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <!-- Comment 1 -->
          <div class="p-4 rounded-lg shadow">
            <div class="flex items-center space-x-3 mb-2">
              <div>
                <NuxtLink :href="`/@${comment.user.username}`">
                  <Avatar />
                </NuxtLink>
              </div>
              <div>
                <NuxtLink
                  :href="`/@${comment.user.username}`"
                  class="font-semibold text-sm hover:underline"
                  >{{ comment.user.name }}</NuxtLink
                >
                <p class="text-xs text-gray-500">March 15, 2024</p>
              </div>
            </div>
            <p class="text-sm dark:text-gray-200">{{ comment.content }}</p>
            <div class="post-replied-footer">
              <div>
                <button>
                  <Icon name="ph:heart-bold" size="17px" />
                  <!-- <span>{{ post.likes_count != 0 ? post.likes_count : "" }}</span> -->
                </button>
              </div>
              <div>
                <button>
                  <Icon name="ant-design:message-outlined" size="17px" />
                  <!-- <span>{{
                  post.comments_count != 0 ? post.comments_count : ""
                }}</span> -->
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h3 class="text-sm text-gray-600 dark:text-gray-500 mt-5">
          No one replied yet.
        </h3>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-replied {
  @apply border-t dark:border-darkGray mt-3 py-2;
  .comment {
    @apply border-b dark:border-darkGray;

    .post-replied-footer {
      @apply -ml-2 flex space-x-6 mt-2;

      button {
        @apply hover:bg-dark/5 dark:hover:bg-lightGray/10 px-2 py-1 rounded-full flex items-center space-x-1 text-dark dark:text-white/80;

        span {
          @apply text-xs;
        }
      }
    }
  }
}
</style>

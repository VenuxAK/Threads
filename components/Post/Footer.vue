<script lang="ts" setup>
import type { Post } from "~/types";

const props = defineProps<{
  post: Post;
  showComments?: boolean;
}>();

const emit = defineEmits<{
  openComments: [];
}>();

const postsStore = usePostsStore();
const { likePost } = useLike();

// Track local like state (prioritize prop from API, fallback to store)
const isLiked = ref(
  props.post.is_liked ?? postsStore.isPostLiked(props.post.id.toString()),
);
const likesCount = ref(props.post.likes ?? 0);
const isProcessing = ref(false);

// Sync local state when prop changes (e.g., after page refresh)
watch(
  () => props.post.is_liked,
  (newVal) => {
    if (newVal !== undefined) {
      isLiked.value = newVal;
    }
  },
);

const handleLike = async () => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  const wasLiked = isLiked.value;

  // Optimistic update
  isLiked.value = !wasLiked;

  try {
    const result = await likePost(props.post.id);

    if (result.success) {
      likesCount.value = result.likesCount;
      postsStore.updatePostLikes(props.post.id.toString(), result.likesCount);
      // Sync with server state (toggle behavior)
      isLiked.value = result.liked;
      postsStore.toggleLike(props.post.id.toString(), result.liked);
    } else {
      // Revert on error
      isLiked.value = wasLiked;
      postsStore.toggleLike(props.post.id.toString(), wasLiked);
    }
  } catch (err) {
    // Revert on error
    isLiked.value = wasLiked;
    postsStore.toggleLike(props.post.id.toString(), wasLiked);
  } finally {
    isProcessing.value = false;
  }
};

const handleOpenComments = () => {
  emit("openComments");
};
</script>

<template>
  <div class="card-footer">
    <div>
      <!-- :class="{ 'text-red-500': isLiked }" -->
      <button :disabled="isProcessing" @click="handleLike">
        <Icon
          :name="isLiked ? 'ph:heart-fill' : 'ph:heart-bold'"
          size="17px"
          :class="{ 'text-red-500': isLiked }"
        />
        <span>{{ likesCount }}</span>
      </button>
    </div>
    <div>
      <button @click="handleOpenComments">
        <Icon name="ph:chat-circle-bold" size="17px" />
        <span>{{ post?.comments ?? "" }}</span>
      </button>
    </div>
    <div>
      <button>
        <Icon name="ph:repeat-bold" size="17px" />
        <span>{{ post?.reposts ?? "" }}</span>
      </button>
    </div>
    <!-- <div>
      <Icon name="ph:paper-plane-right-bold" size="17px" />
    </div> -->
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

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
const interactionsStore = useInteractionsStore();
const { likePost } = useLike();
const { toggleRepost } = useRepost();
const { toggleSavePost } = useSavePost();

// Track local like state (prioritize prop from API, fallback to store)
const isLiked = ref(
  props.post.is_liked ?? interactionsStore.isPostLiked(props.post.id.toString()),
);
const likesCount = ref(props.post.likes ?? 0);
const isProcessing = ref(false);

const isReposted = ref(
  props.post.is_reposted ?? interactionsStore.isPostReposted(props.post.id.toString()),
);
const repostsCount = ref(props.post.reposts ?? 0);
const isRepostProcessing = ref(false);

const isSaved = ref(
  props.post.is_saved ?? interactionsStore.isPostSaved(props.post.id.toString()),
);
const isSaveProcessing = ref(false);

// Sync local state when prop changes (e.g., after page refresh)
watch(
  () => props.post.is_liked,
  (newVal) => {
    if (newVal !== undefined) {
      isLiked.value = newVal;
    }
  },
);

watch(
  () => props.post.is_reposted,
  (newVal) => {
    if (newVal !== undefined) {
      isReposted.value = newVal;
    }
  },
);

watch(
  () => props.post.is_saved,
  (newVal) => {
    if (newVal !== undefined) {
      isSaved.value = newVal;
    }
  },
);

watch(
  () => props.post.reposts,
  (newVal) => {
    if (newVal !== undefined) {
      repostsCount.value = newVal;
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
      isLiked.value = result.liked;
      interactionsStore.toggleLike(props.post.id.toString(), result.liked);
    } else {
      isLiked.value = wasLiked;
      interactionsStore.toggleLike(props.post.id.toString(), wasLiked);
    }
  } catch (err) {
    isLiked.value = wasLiked;
    interactionsStore.toggleLike(props.post.id.toString(), wasLiked);
  } finally {
    isProcessing.value = false;
  }
};

const handleOpenComments = () => {
  emit("openComments");
};

const handleRepost = async () => {
  if (isRepostProcessing.value) {
    return;
  }

  isRepostProcessing.value = true;
  const wasReposted = isReposted.value;

  isReposted.value = !wasReposted;
  repostsCount.value = Math.max(
    0,
    repostsCount.value + (wasReposted ? -1 : 1),
  );

  try {
    const result = await toggleRepost(props.post.id);

    if (result.success) {
      repostsCount.value = result.repostsCount;
      isReposted.value = result.reposted;
      postsStore.updatePostReposts(
        props.post.id.toString(),
        result.repostsCount,
      );
      interactionsStore.toggleRepost(props.post.id.toString(), result.reposted);
    } else {
      isReposted.value = wasReposted;
      repostsCount.value = Math.max(
        0,
        repostsCount.value + (wasReposted ? 1 : -1),
      );
    }
  } catch {
    isReposted.value = wasReposted;
    repostsCount.value = Math.max(
      0,
      repostsCount.value + (wasReposted ? 1 : -1),
    );
  } finally {
    isRepostProcessing.value = false;
  }
};

const handleSave = async () => {
  if (isSaveProcessing.value) return;

  isSaveProcessing.value = true;
  const wasSaved = isSaved.value;

  // Optimistic UI update
  isSaved.value = !wasSaved;
  interactionsStore.toggleSave(props.post.id.toString(), !wasSaved);

  try {
    const success = await toggleSavePost(props.post.id, wasSaved);
    if (!success) {
      isSaved.value = wasSaved;
      interactionsStore.toggleSave(props.post.id.toString(), wasSaved);
    }
  } catch {
    isSaved.value = wasSaved;
    interactionsStore.toggleSave(props.post.id.toString(), wasSaved);
  } finally {
    isSaveProcessing.value = false;
  }
};
</script>

<template>
  <div class="card-footer">
    <div>
      <button :disabled="isProcessing" @click="handleLike" title="Like">
        <Icon
          :name="isLiked ? 'ph:heart-fill' : 'ph:heart-bold'"
          size="17px"
          :class="{ 'text-red-500': isLiked }"
        />
        <span>{{ likesCount }}</span>
      </button>
    </div>
    <div>
      <button @click="handleOpenComments" title="Comments">
        <Icon name="ph:chat-circle-bold" size="17px" />
        <span>{{ post?.comments ?? "" }}</span>
      </button>
    </div>
    <div>
      <button
        :disabled="isRepostProcessing"
        @click="handleRepost"
        title="Repost"
      >
        <Icon
          name="ph:repeat-bold"
          size="17px"
          :class="{ 'text-emerald-600 dark:text-emerald-400': isReposted }"
        />
        <span>{{ repostsCount }}</span>
      </button>
    </div>
    <div>
      <button :disabled="isSaveProcessing" @click="handleSave" title="Bookmark">
        <Icon
          :name="isSaved ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple-bold'"
          size="17px"
          :class="{ 'text-amber-500': isSaved }"
        />
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

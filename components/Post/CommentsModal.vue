<script lang="ts" setup>
import type { Comment, Post } from "~/types";
import { nextTick } from "vue";

const props = defineProps<{
  post: Post;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { getComments, createComment, deleteComment, getCommentThread } =
  useComment();
const { sanitizeWithHashtags } = useSanitize();
const auth = useAuth();
const postsStore = usePostsStore();

const comments = ref<Comment[]>([]);
const loading = ref(false);
const newComment = ref("");
const isSubmitting = ref(false);
const replyingTo = ref<string | null>(null);
const replyContent = ref("");
const loadingReplies = ref<Set<string>>(new Set());
const errorMessage = ref<string | null>(null);
const replyErrorMessage = ref<string | null>(null);
const replyErrors = ref<Record<string, string>>({});
const modalRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLElement | null>(null);

const isLoadingReply = (commentId: string) => {
  return loadingReplies.value.has(commentId);
};

const getReplyError = (commentId: string) => {
  return replyErrors.value[commentId];
};

/** Top-level comment that owns the thread containing this parent id */
const findThreadRoot = (parentId: string): Comment | null => {
  const pid = parentId.toString();
  for (const c of comments.value) {
    if (c.id.toString() === pid) {
      return c;
    }
    if (c.threadItems?.some((r) => r.id.toString() === pid)) {
      return c;
    }
  }
  return null;
};

const resolveParentAuthor = (
  root: Comment,
  parentId: string,
): Comment["author"] | null => {
  if (root.id.toString() === parentId) {
    return root.author;
  }
  const row = root.threadItems?.find((r) => r.id.toString() === parentId);
  return row?.author ?? null;
};

const loadCommentThread = async (commentId: string) => {
  const comment = comments.value.find((c) => c.id.toString() === commentId);
  if (!comment) {
    return;
  }
  if ((comment.reply_count || 0) === 0) {
    comment.threadItems = [];
    return;
  }
  loadingReplies.value.add(commentId);
  try {
    const { data: thread, error } = await getCommentThread(commentId);
    if (error) {
      console.error("Error fetching thread:", error);
      replyErrors.value[commentId] = error;
      comment.threadItems = [];
    } else {
      comment.threadItems = thread.map((r: Comment) => ({
        ...r,
        reply_count: r.reply_count || 0,
      }));
    }
  } finally {
    loadingReplies.value.delete(commentId);
  }
};

const refetchCommentThread = async (commentId: string) => {
  const comment = comments.value.find((c) => c.id.toString() === commentId);
  if (!comment?.showReplies) {
    return;
  }
  delete replyErrors.value[commentId];
  await loadCommentThread(commentId);
};

const fetchComments = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data: fetchedComments, error } = await getComments(props.post.id);
    if (error) {
      errorMessage.value = error;
      console.error("Error fetching comments:", error);
      comments.value = [];
      return;
    }
    comments.value = fetchedComments.map((c: Comment) => ({
      ...c,
      showReplies: false,
      reply_count: c.reply_count || 0,
      threadItems: undefined as Comment[] | undefined,
    }));
  } finally {
    loading.value = false;
  }
};

const handleSubmitComment = async () => {
  if (isSubmitting.value) return;
  const content = newComment.value.trim();
  if (!content) return;

  // Check if user is authenticated
  if (!auth.user?.value) {
    errorMessage.value = "You must be logged in to comment";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;
  newComment.value = "";

  try {
    const { data: comment, error } = await createComment(
      props.post.id,
      content,
    );

    if (comment) {
      comments.value.unshift({
        ...comment,
        showReplies: false,
        threadItems: undefined,
      });

      // Update comment count in store
      const currentCount = props.post.comments || 0;
      postsStore.updatePostComments(props.post.id.toString(), currentCount + 1);
    } else if (error) {
      newComment.value = content;
      errorMessage.value = error;
      console.error("Error creating comment:", error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmitReply = async (parentId: string) => {
  if (isSubmitting.value) return;
  const content = replyContent.value.trim();
  if (!content) return;

  // Check if user is authenticated
  if (!auth.user?.value) {
    replyErrorMessage.value = "You must be logged in to reply";
    return;
  }

  isSubmitting.value = true;
  replyErrorMessage.value = null;

  try {
    const { data: comment, error } = await createComment(
      props.post.id,
      content,
      parentId,
    );

    if (comment) {
      const root = findThreadRoot(parentId);
      if (root) {
        if (!root.threadItems) {
          root.threadItems = [];
        }

        const parentAuthor = resolveParentAuthor(root, parentId);
        const replyTargetLabel =
          root.id.toString() !== parentId && parentAuthor
            ? { username: parentAuthor.username }
            : undefined;

        root.threadItems.push({
          ...comment,
          reply_count: 0,
          replying_to: replyTargetLabel ?? null,
        });

        root.showReplies = true;
        root.reply_count = (root.reply_count || 0) + 1;

        delete replyErrors.value[parentId];

        replyContent.value = "";
        replyingTo.value = null;

        const currentCount = props.post.comments || 0;
        postsStore.updatePostComments(props.post.id.toString(), currentCount + 1);
      }
    } else if (error) {
      replyErrorMessage.value = error;
      console.error("Error creating reply:", error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteComment = async (commentId: string) => {
  if (!confirm("Are you sure you want to delete this comment?")) return;

  // Check if user is authenticated
  if (!auth.user?.value) {
    errorMessage.value = "You must be logged in to delete comments";
    return;
  }

  const { success, error } = await deleteComment(commentId);
  if (success) {
    // Find parent comment and remove this comment from its replies
    const findParentAndRemove = (id: string, commentsList: Comment[]): boolean => {
      for (const comment of commentsList) {
        if (!comment.threadItems?.length) {
          continue;
        }
        const replyIndex = comment.threadItems.findIndex(
          (r) => r.id.toString() === id.toString(),
        );
        if (replyIndex !== -1) {
          comment.threadItems.splice(replyIndex, 1);
          comment.reply_count = Math.max(0, (comment.reply_count || 0) - 1);
          return true;
        }
      }
      return false;
    };

    // Try to find and remove from parent (if it's a reply)
    if (!findParentAndRemove(commentId, comments.value)) {
      // If not found as a reply, it's a top-level comment
      const index = comments.value.findIndex(
        (c) => c.id.toString() === commentId.toString(),
      );
      if (index !== -1) {
        comments.value.splice(index, 1);
      }
    }

    // Update comment count in store
    const currentCount = props.post.comments || 0;
    postsStore.updatePostComments(
      props.post.id.toString(),
      Math.max(0, currentCount - 1),
    );
  } else if (error) {
    errorMessage.value = error;
    console.error("Error deleting comment:", error);
  }
};

const toggleReply = (commentId: string) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId;
  replyContent.value = "";
  replyErrorMessage.value = null;
};

const closeReply = () => {
  replyingTo.value = null;
  replyContent.value = "";
  replyErrorMessage.value = null;
};

const toggleShowReplies = async (commentId: string) => {
  const comment = comments.value.find((c) => c.id.toString() === commentId);
  if (!comment) {
    return;
  }
  delete replyErrors.value[commentId];
  const wasHidden = !comment.showReplies;
  comment.showReplies = !comment.showReplies;
  if (comment.showReplies) {
    try {
      await loadCommentThread(commentId);
    } catch {
      comment.showReplies = false;
    }
  }
};

// Fetch comments when modal opens
onMounted(() => {
  if (props.isOpen) {
    fetchComments();
  }
});

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      fetchComments();
      // Focus the close button when modal opens
      nextTick(() => {
        closeButtonRef.value?.focus();
      });
    }
    if (!val) {
      replyingTo.value = null;
      replyContent.value = "";
      errorMessage.value = null;
      replyErrorMessage.value = null;
    }
  },
);

// Handle focus trapping
const handleTabKey = (e: KeyboardEvent) => {
  if (e.key !== "Tab") return;

  const focusableElements = modalRef.value?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  ) as NodeListOf<HTMLElement> | undefined;

  if (!focusableElements || focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (firstElement && lastElement) {
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
};

</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-black/45 dark:bg-black/65 backdrop-blur-[2px]"
    @click.self="emit('close')"
  >
    <div
      ref="modalRef"
      class="comments-sheet bg-white dark:bg-darkGray w-full sm:max-w-md md:max-w-lg max-h-[min(92dvh,820px)] sm:max-h-[85vh] rounded-t-[1.35rem] sm:rounded-2xl overflow-hidden flex flex-col outline-none shadow-2xl shadow-black/20 dark:shadow-black/40 border-t border-x border-gray-200/80 dark:border-white/[0.08] sm:border"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comments-modal-title"
      aria-describedby="comments-modal-description"
      @keydown.escape="emit('close')"
      @keydown.tab="handleTabKey"
      tabindex="-1"
    >
      <!-- Header (Instagram-style bar) -->
      <header
        class="relative flex items-center justify-center shrink-0 border-b border-gray-200/90 dark:border-white/[0.06] bg-white/95 dark:bg-darkGray/95 pt-3 pb-3 px-3"
      >
        <div class="absolute left-2 top-1/2 -translate-y-1/2 sm:left-3">
          <button
            ref="closeButtonRef"
            type="button"
            class="p-2.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] active:scale-95 transition-transform"
            title="Close"
            @click="emit('close')"
          >
            <Icon name="carbon:chevron-left" size="22" />
          </button>
        </div>
        <div class="text-center py-0.5">
          <h3
            id="comments-modal-title"
            class="text-base font-semibold tracking-tight text-gray-950 dark:text-white"
          >
            Comments
          </h3>
          <p
            id="comments-modal-description"
            class="text-[12px] text-lightGray mt-0.5"
          >
            {{ comments.length }}
            {{ comments.length === 1 ? "comment" : "comments" }}
          </p>
        </div>
        <div class="absolute right-2 w-10 sm:right-3" aria-hidden="true" />
      </header>

      <!-- Comments List -->
      <div class="comments-scroll flex-1 overflow-y-auto overscroll-contain px-1 sm:px-2">
        <div v-if="loading" class="text-center py-16 px-4">
          <div class="inline-flex">
            <Loader />
          </div>
          <p class="mt-4 text-sm text-lightGray">Loading comments…</p>
        </div>

        <div v-else-if="errorMessage" class="px-4 py-6">
          <div
            class="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 p-4 text-center"
          >
            <p class="text-red-600 dark:text-red-400 text-sm">
              {{ errorMessage }}
            </p>
            <button
              type="button"
              class="mt-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline"
              @click="fetchComments"
            >
              Try again
            </button>
          </div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-16 px-8">
          <div
            class="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center"
          >
            <Icon
              name="carbon:chat"
              size="32"
              class="text-lightGray"
            />
          </div>
          <h4 class="text-[15px] font-semibold text-gray-900 dark:text-white mb-1">
            No comments yet
          </h4>
          <p class="text-sm text-lightGray leading-relaxed">
            Be the first to comment.
          </p>
        </div>

        <div v-else class="divide-y divide-gray-100/90 dark:divide-white/[0.06]">
          <article
            v-for="comment in comments"
            :key="comment.id"
            class="px-3 py-4 sm:px-4"
          >
            <div class="flex gap-3">
              <NuxtLink
                :href="`/@${comment.author.username}`"
                class="flex-shrink-0 pt-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                <Avatar size="sm" />
              </NuxtLink>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="min-w-0 text-sm leading-tight">
                    <NuxtLink
                      :href="`/@${comment.author.username}`"
                      class="font-semibold text-gray-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {{ comment.author.username }}
                    </NuxtLink>
                    <span class="text-lightGray font-normal">&nbsp;·&nbsp;</span>
                    <span class="text-xs font-normal text-lightGray">{{
                      comment.created_at
                    }}</span>
                  </p>
                  <button
                    v-if="
                      auth.user?.value &&
                      comment.author.id === auth.user?.value.id
                    "
                    type="button"
                    class="flex-shrink-0 -mr-1 p-2 rounded-full text-lightGray hover:text-red-500 hover:bg-gray-100/90 dark:hover:bg-white/[0.06] active:scale-95 transition-transform"
                    title="Delete"
                    @click="handleDeleteComment(comment.id.toString())"
                  >
                    <Icon name="carbon:trash-can" size="16" />
                  </button>
                </div>
                <div
                  class="comment-prose mt-1 text-[14px] leading-relaxed text-gray-900 dark:text-gray-100"
                  v-html="sanitizeWithHashtags(comment.content)"
                />

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <button
                    type="button"
                    class="-ml-1.5 px-2 py-2 text-xs font-semibold text-lightGray hover:text-gray-800 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/[0.05] min-h-[40px]"
                    @click="toggleReply(comment.id.toString())"
                  >
                    Reply
                  </button>
                  <template v-if="(comment.reply_count || 0) > 0">
                    <button
                      type="button"
                      class="py-2 text-xs font-semibold text-lightGray hover:text-gray-800 dark:hover:text-gray-100 min-h-[40px] inline-flex items-center gap-1 disabled:opacity-45"
                      :disabled="isLoadingReply(comment.id.toString())"
                      @click="toggleShowReplies(comment.id.toString())"
                    >
                      <svg
                        v-if="isLoadingReply(comment.id.toString())"
                        class="animate-spin inline text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <template v-else>
                        <span class="text-lightGray">View</span>
                        <span class="text-gray-800 dark:text-gray-100">{{
                          comment.reply_count
                        }}</span>
                        <span class="text-lightGray">{{
                          comment.reply_count === 1 ? "reply" : "replies"
                        }}</span>
                        <Icon
                          :name="
                            comment.showReplies
                              ? 'carbon:chevron-up'
                              : 'carbon:chevron-down'
                          "
                          size="14"
                          class="text-lightGray ml-0.5"
                        />
                      </template>
                    </button>
                  </template>
                </div>

                <!-- Reply composer (root comment) -->
                <div
                  v-if="replyingTo === comment.id.toString()"
                  class="mt-3 border-l-2 border-gray-200/90 dark:border-white/10 pl-3"
                >
                  <p class="text-[11px] text-lightGray mb-2">
                    Replying to
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{
                      comment.author.username
                    }}</span>
                  </p>
                  <div v-if="replyErrorMessage" class="mb-2">
                    <p class="text-xs text-red-600 dark:text-red-400">
                      {{ replyErrorMessage }}
                    </p>
                  </div>
                  <div
                    class="flex flex-col gap-2 rounded-2xl bg-gray-100/90 dark:bg-white/[0.06] p-2 sm:flex-row sm:items-center"
                  >
                    <input
                      v-model="replyContent"
                      type="text"
                      placeholder="Add a reply…"
                      class="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-lightGray focus:outline-none"
                      @keyup.enter="handleSubmitReply(comment.id.toString())"
                      @keydown.escape="closeReply()"
                    />
                    <div
                      class="flex items-center justify-end gap-2 px-1 pb-1 sm:pb-0 sm:pr-1 shrink-0"
                    >
                      <button
                        type="button"
                        class="px-3 py-2 text-sm font-semibold text-lightGray hover:text-gray-700 dark:hover:text-gray-200 rounded-full min-h-[40px]"
                        @click="closeReply()"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-semibold rounded-full min-h-[40px] text-blue-600 dark:text-blue-400 disabled:opacity-35 disabled:pointer-events-none"
                        :disabled="!replyContent.trim() || isSubmitting"
                        @click="handleSubmitReply(comment.id.toString())"
                      >
                        <svg
                          v-if="isSubmitting"
                          class="animate-spin inline text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                        >
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span v-else>Post</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Nested thread -->
                <div v-if="comment.showReplies" class="mt-3 -mx-1">
                  <div
                    class="rounded-2xl overflow-hidden bg-gray-50/90 dark:bg-white/[0.04] ring-1 ring-inset ring-gray-200/70 dark:ring-white/[0.06]"
                  >
                    <div
                      v-if="isLoadingReply(comment.id.toString())"
                      class="text-center py-10"
                    >
                      <Loader />
                      <p class="mt-3 text-xs text-lightGray">Loading replies…</p>
                    </div>
                    <div
                      v-else-if="getReplyError(comment.id.toString())"
                      class="p-4"
                    >
                      <p class="text-xs text-red-600 dark:text-red-400 text-center">
                        {{ getReplyError(comment.id.toString()) }}
                      </p>
                      <button
                        type="button"
                        class="mt-3 w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400"
                        @click="refetchCommentThread(comment.id.toString())"
                      >
                        Try again
                      </button>
                    </div>
                    <div
                      v-else-if="
                        comment.threadItems && comment.threadItems.length > 0
                      "
                    >
                      <PostCommentThreadRow
                        v-for="item in comment.threadItems"
                        :key="item.id"
                        :item="item"
                        :show-composer="replyingTo === item.id.toString()"
                        :reply-content="replyContent"
                        :composer-error="
                          replyingTo === item.id.toString()
                            ? replyErrorMessage
                            : null
                        "
                        :is-submitting="isSubmitting"
                        @update:reply-content="replyContent = $event"
                        @toggle-reply="toggleReply($event)"
                        @submit-reply="handleSubmitReply($event)"
                        @close-reply="closeReply()"
                        @delete="handleDeleteComment($event)"
                      />
                    </div>
                    <div
                      v-else-if="!isLoadingReply(comment.id.toString())"
                      class="text-center text-sm text-lightGray py-8 px-4"
                    >
                      No replies yet.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Composer (Instagram-style bottom bar) -->
      <div
        class="shrink-0 border-t border-gray-200/90 dark:border-white/[0.06] bg-white dark:bg-darkGray pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 px-3 sm:px-4"
      >
        <div v-if="errorMessage && !loading" class="mb-2 px-1">
          <p class="text-xs text-red-600 dark:text-red-400 text-center">
            {{ errorMessage }}
          </p>
        </div>
        <form
          class="flex items-end gap-2.5"
          @submit.prevent="handleSubmitComment"
        >
          <div class="flex-shrink-0 pb-0.5">
            <Avatar size="sm" />
          </div>
          <div
            class="flex-1 min-w-0 flex items-center gap-2 rounded-[1.35rem] bg-gray-100/95 dark:bg-white/[0.07] px-3 sm:px-4 py-1.5 ring-1 ring-inset ring-gray-200/60 dark:ring-white/[0.08] focus-within:ring-2 focus-within:ring-blue-500/35 dark:focus-within:ring-blue-400/30"
          >
            <label for="new-comment-input" class="sr-only">Add a comment</label>
            <input
              id="new-comment-input"
              v-model="newComment"
              type="text"
              autocomplete="off"
              placeholder="Add a comment…"
              class="flex-1 min-w-0 bg-transparent py-2.5 text-[14px] text-gray-900 dark:text-white placeholder:text-lightGray focus:outline-none"
            />
            <button
              type="submit"
              class="shrink-0 py-2 px-1 text-sm font-semibold text-blue-600 dark:text-blue-400 disabled:opacity-30 disabled:pointer-events-none min-w-[44px] min-h-[44px] rounded-full hover:bg-white/50 dark:hover:bg-white/[0.04] active:scale-95 transition-transform flex items-center justify-center"
              :disabled="!newComment.trim() || isSubmitting"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin inline text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span v-else>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comments-scroll {
  scrollbar-gutter: stable;
}

.comments-scroll::-webkit-scrollbar {
  width: 5px;
}

.comments-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.comments-scroll::-webkit-scrollbar-thumb {
  @apply rounded-full bg-gray-300/90;
}

.dark .comments-scroll::-webkit-scrollbar-thumb {
  @apply bg-white/15;
}

.comments-scroll::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

.dark .comments-scroll::-webkit-scrollbar-thumb:hover {
  @apply bg-white/25;
}

.comment-prose :deep(a) {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

button,
input {
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    opacity 0.15s ease,
    transform 0.12s ease;
}
</style>

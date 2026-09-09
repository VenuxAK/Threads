<script lang="ts" setup>
import type { Comment, Post } from '~/types';

/**
 * Thread replies and inline comment composer component for the Single Post view.
 * Fetches and displays root comments for the post via GraphQL, supports nested reply
 * threads via CommentThreadRow, and provides quick inline comment composition.
 */
const props = defineProps<{
  post: Post;
}>();

const { getComments, createComment, deleteComment, getCommentThread } = useComment();
const { sanitizeWithHashtags } = useSanitize();
const auth = useAuth();
const postsStore = usePostsStore();

const comments = ref<Comment[]>([]);
const loading = ref(true);
const newReply = ref('');
const isSubmitting = ref(false);
const replyingTo = ref<string | null>(null);
const replyContent = ref('');
const loadingReplies = ref<Set<string>>(new Set());
const errorMessage = ref<string | null>(null);
const replyErrorMessage = ref<string | null>(null);
const replyErrors = ref<Record<string, string>>({});
const inputRef = ref<HTMLInputElement | null>(null);

const isLoadingReply = (commentId: string) => loadingReplies.value.has(commentId);

/**
 * Find root-level comment that owns the threaded conversation for a given parent comment ID.
 */
const findThreadRoot = (parentId: string): Comment | null => {
  const pid = parentId.toString();
  for (const c of comments.value) {
    if (c.id.toString() === pid) return c;
    if (c.threadItems?.some((r) => r.id.toString() === pid)) return c;
  }
  return null;
};

const resolveParentAuthor = (root: Comment, parentId: string): Comment['author'] | null => {
  if (root.id.toString() === parentId) return root.author;
  const row = root.threadItems?.find((r) => r.id.toString() === parentId);
  return row?.author ?? null;
};

/**
 * Fetch top-level comments for the current post.
 */
const fetchComments = async () => {
  if (!props.post?.id) return;
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data, error } = await getComments(props.post.id);
    if (error) {
      errorMessage.value = error;
      console.error('Error fetching post comments:', error);
      comments.value = [];
    } else {
      comments.value = (data || []).map((c: Comment) => ({
        ...c,
        showReplies: false,
        reply_count: c.reply_count || 0,
        threadItems: undefined,
      }));
    }
  } finally {
    loading.value = false;
  }
};

/**
 * Submit a top-level reply/comment to the post with double-submit guard.
 */
const handleSubmitComment = async () => {
  if (isSubmitting.value) return;
  const content = newReply.value.trim();
  if (!content) return;

  if (!auth.user?.value) {
    errorMessage.value = 'You must be logged in to comment';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;
  newReply.value = '';

  try {
    const { data: comment, error } = await createComment(props.post.id, content);
    if (comment) {
      comments.value.unshift({
        ...comment,
        showReplies: false,
        threadItems: undefined,
      });

      const currentCount = props.post.comments || 0;
      postsStore.updatePostComments(props.post.id.toString(), currentCount + 1);
    } else if (error) {
      newReply.value = content;
      errorMessage.value = error;
      console.error('Error submitting comment:', error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Submit a nested reply to an existing comment or reply in the thread.
 */
const handleSubmitReply = async (parentId: string) => {
  if (isSubmitting.value) return;
  const content = replyContent.value.trim();
  if (!content) return;

  if (!auth.user?.value) {
    replyErrorMessage.value = 'You must be logged in to reply';
    return;
  }

  isSubmitting.value = true;
  replyErrorMessage.value = null;

  try {
    const { data: comment, error } = await createComment(props.post.id, content, parentId);
    if (comment) {
      const root = findThreadRoot(parentId);
      if (root) {
        if (!root.threadItems) root.threadItems = [];
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
        replyContent.value = '';
        replyingTo.value = null;

        const currentCount = props.post.comments || 0;
        postsStore.updatePostComments(props.post.id.toString(), currentCount + 1);
      }
    } else if (error) {
      replyErrorMessage.value = error;
      console.error('Error submitting reply:', error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Delete owned comment and decrement counters.
 */
const handleDeleteComment = async (commentId: string) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  if (!auth.user?.value) return;

  const { success, error } = await deleteComment(commentId);
  if (success) {
    const findParentAndRemove = (id: string, list: Comment[]): boolean => {
      for (const comment of list) {
        if (!comment.threadItems?.length) continue;
        const index = comment.threadItems.findIndex((r) => r.id.toString() === id.toString());
        if (index !== -1) {
          comment.threadItems.splice(index, 1);
          comment.reply_count = Math.max(0, (comment.reply_count || 0) - 1);
          return true;
        }
      }
      return false;
    };

    if (!findParentAndRemove(commentId, comments.value)) {
      const index = comments.value.findIndex((c) => c.id.toString() === commentId.toString());
      if (index !== -1) comments.value.splice(index, 1);
    }

    const currentCount = props.post.comments || 0;
    postsStore.updatePostComments(props.post.id.toString(), Math.max(0, currentCount - 1));
  } else if (error) {
    console.error('Error deleting comment:', error);
  }
};

const loadCommentThread = async (commentId: string) => {
  const comment = comments.value.find((c) => c.id.toString() === commentId);
  if (!comment || (comment.reply_count || 0) === 0) return;

  loadingReplies.value.add(commentId);
  try {
    const { data: thread, error } = await getCommentThread(commentId);
    if (error) {
      console.error('Error fetching thread:', error);
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

const toggleShowReplies = async (commentId: string) => {
  const comment = comments.value.find((c) => c.id.toString() === commentId);
  if (!comment) return;
  delete replyErrors.value[commentId];
  comment.showReplies = !comment.showReplies;
  if (comment.showReplies && (!comment.threadItems || comment.threadItems.length === 0)) {
    try {
      await loadCommentThread(commentId);
    } catch {
      comment.showReplies = false;
    }
  }
};

const toggleReply = (commentId: string) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId;
  replyContent.value = '';
  replyErrorMessage.value = null;
};

const closeReply = () => {
  replyingTo.value = null;
  replyContent.value = '';
  replyErrorMessage.value = null;
};

onMounted(() => {
  fetchComments();
});

watch(
  () => props.post.id,
  () => {
    fetchComments();
  },
);

defineExpose({
  focusInput: () => {
    inputRef.value?.focus();
  },
});
</script>

<template>
  <div class="post-replied border-t border-gray-200 dark:border-darkGray mt-4 pt-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
      <h5 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span>Replies</span>
        <span v-if="comments.length > 0" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
          {{ comments.length }}
        </span>
      </h5>
    </div>

    <!-- Inline Comment / Reply Composer -->
    <div class="py-3 border-b border-gray-100 dark:border-white/10">
      <div v-if="errorMessage" class="mb-2">
        <p class="text-xs text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>
      <form class="flex items-center gap-2.5" @submit.prevent="handleSubmitComment">
        <div class="flex-shrink-0">
          <Avatar size="sm" />
        </div>
        <div class="flex-1 flex items-center gap-2 rounded-full bg-gray-100/95 dark:bg-white/[0.07] px-4 py-1.5 ring-1 ring-inset ring-gray-200/60 dark:ring-white/[0.08] focus-within:ring-2 focus-within:ring-blue-500/35 dark:focus-within:ring-blue-400/30">
          <input
            id="single-post-reply-input"
            name="reply"
            ref="inputRef"
            v-model="newReply"
            type="text"
            autocomplete="off"
            :placeholder="`Reply to @${post.author?.username || 'thread'}…`"
            class="flex-1 min-w-0 bg-transparent py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-lightGray focus:outline-none"
          />
          <button
            type="submit"
            class="shrink-0 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 disabled:opacity-30 disabled:pointer-events-none rounded-full hover:bg-white/50 dark:hover:bg-white/[0.04] active:scale-95 transition-transform flex items-center justify-center min-h-[32px]"
            :disabled="!newReply.trim() || isSubmitting"
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
            <span v-else>Reply</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Comments List -->
    <div class="comments-list">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="py-6 space-y-4">
        <div v-for="i in 2" :key="i" class="flex gap-3 animate-pulse">
          <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="w-24 h-3 rounded bg-gray-200 dark:bg-white/10"></div>
            <div class="w-3/4 h-3 rounded bg-gray-200 dark:bg-white/10"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="comments.length === 0" class="text-center py-10 px-4">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">No one replied yet.</p>
        <p class="text-xs text-lightGray mt-1">Be the first to start the conversation.</p>
      </div>

      <!-- Render Comments -->
      <div v-else class="divide-y divide-gray-100/90 dark:divide-white/[0.06]">
        <article
          v-for="comment in comments"
          :key="comment.id"
          class="py-4"
        >
          <div class="flex gap-3">
            <NuxtLink
              :href="`/@${comment.author.username}`"
              class="flex-shrink-0 pt-0.5 rounded-full focus:outline-none"
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
                  <span class="text-xs font-normal text-lightGray">{{ comment.created_at }}</span>
                </p>
                <button
                  v-if="auth.user?.value && comment.author.id === auth.user?.value.id"
                  type="button"
                  class="flex-shrink-0 -mr-1 p-1.5 rounded-full text-lightGray hover:text-red-500 hover:bg-gray-100/90 dark:hover:bg-white/[0.06] active:scale-95 transition-transform"
                  title="Delete"
                  @click="handleDeleteComment(comment.id.toString())"
                >
                  <Icon name="carbon:trash-can" size="16" />
                </button>
              </div>

              <!-- Content with hashtags/mentions -->
              <div
                class="comment-prose mt-1 text-[14px] leading-relaxed text-gray-900 dark:text-gray-100"
                v-html="sanitizeWithHashtags(comment.content)"
              />

              <!-- Actions row -->
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                <button
                  type="button"
                  class="-ml-1 px-2 py-1 text-xs font-semibold text-lightGray hover:text-gray-800 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/[0.05]"
                  @click="toggleReply(comment.id.toString())"
                >
                  Reply
                </button>
                <template v-if="(comment.reply_count || 0) > 0">
                  <button
                    type="button"
                    class="py-1 text-xs font-semibold text-lightGray hover:text-gray-800 dark:hover:text-gray-100 inline-flex items-center gap-1 disabled:opacity-45"
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
                      <span class="text-gray-800 dark:text-gray-100">{{ comment.reply_count }}</span>
                      <span class="text-lightGray">{{ comment.reply_count === 1 ? 'reply' : 'replies' }}</span>
                      <Icon
                        :name="comment.showReplies ? 'carbon:chevron-up' : 'carbon:chevron-down'"
                        size="14"
                        class="text-lightGray ml-0.5"
                      />
                    </template>
                  </button>
                </template>
              </div>

              <!-- Nested Reply Composer for this root comment -->
              <div
                v-if="replyingTo === comment.id.toString()"
                class="mt-3 border-l-2 border-gray-200/90 dark:border-white/10 pl-3"
              >
                <p class="text-[11px] text-lightGray mb-1.5">
                  Replying to
                  <span class="font-semibold text-gray-800 dark:text-gray-200">@{{ comment.author.username }}</span>
                </p>
                <div v-if="replyErrorMessage" class="mb-2">
                  <p class="text-xs text-red-600 dark:text-red-400">{{ replyErrorMessage }}</p>
                </div>
                <div class="flex flex-col gap-2 rounded-2xl bg-gray-100/90 dark:bg-white/[0.06] p-2 sm:flex-row sm:items-center">
                  <input
                    v-model="replyContent"
                    type="text"
                    placeholder="Add a reply…"
                    class="flex-1 min-w-0 bg-transparent px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-lightGray focus:outline-none"
                    @keyup.enter="handleSubmitReply(comment.id.toString())"
                    @keydown.escape="closeReply()"
                  />
                  <div class="flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      class="px-3 py-1.5 text-xs font-semibold text-lightGray hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
                      @click="closeReply()"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="px-4 py-1.5 text-xs font-semibold rounded-full text-blue-600 dark:text-blue-400 disabled:opacity-35 disabled:pointer-events-none"
                      :disabled="!replyContent.trim() || isSubmitting"
                      @click="handleSubmitReply(comment.id.toString())"
                    >
                      <svg
                        v-if="isSubmitting"
                        class="animate-spin inline text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span v-else>Post</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Nested Thread Replies List -->
              <div v-if="comment.showReplies && comment.threadItems && comment.threadItems.length > 0" class="mt-3">
                <div class="rounded-2xl overflow-hidden bg-gray-50/90 dark:bg-white/[0.04] ring-1 ring-inset ring-gray-200/70 dark:ring-white/[0.06]">
                  <PostCommentThreadRow
                    v-for="replyItem in comment.threadItems"
                    :key="replyItem.id"
                    :item="replyItem"
                    :show-composer="replyingTo === replyItem.id.toString()"
                    :reply-content="replyContent"
                    :composer-error="getReplyError(replyItem.id.toString())"
                    :is-submitting="isSubmitting"
                    @delete="handleDeleteComment($event)"
                    @toggle-reply="toggleReply($event)"
                    @submit-reply="handleSubmitReply($event)"
                    @close-reply="closeReply()"
                    @update:reply-content="replyContent = $event"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-prose :deep(a) {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}
</style>

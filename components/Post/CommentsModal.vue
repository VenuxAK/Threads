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

const { getComments, createComment, deleteComment, getReplies } = useComment();
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

const fetchComments = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const { data: fetchedComments, error } = await getComments(props.post.id);
    if (error) {
      errorMessage.value = error;
      console.error("Error fetching comments:", error);
    }
    comments.value = fetchedComments.map((c: Comment) => ({
      ...c,
      showReplies: false,
      reply_count: c.reply_count || 0,
      replies: c.replies || [],
    }));
  } finally {
    loading.value = false;
  }
};

const handleSubmitComment = async () => {
  if (!newComment.value.trim()) return;

  // Check if user is authenticated
  if (!auth.user?.value) {
    errorMessage.value = "You must be logged in to comment";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;
  const { data: comment, error } = await createComment(
    props.post.id,
    newComment.value.trim(),
  );

  if (comment) {
    comments.value.unshift({
      ...comment,
      showReplies: false,
      replies: [],
    });
    newComment.value = "";

    // Update comment count in store
    const currentCount = props.post.comments || 0;
    postsStore.updatePostComments(props.post.id.toString(), currentCount + 1);
  } else if (error) {
    errorMessage.value = error;
    console.error("Error creating comment:", error);
  }
  isSubmitting.value = false;
};

const handleSubmitReply = async (parentId: string) => {
  if (!replyContent.value.trim()) return;

  // Check if user is authenticated
  if (!auth.user?.value) {
    replyErrorMessage.value = "You must be logged in to reply";
    return;
  }

  isSubmitting.value = true;
  replyErrorMessage.value = null;
  const { data: comment, error } = await createComment(
    props.post.id,
    replyContent.value.trim(),
    parentId,
  );

  if (comment) {
    const parentComment = comments.value.find(
      (c) => c.id.toString() === parentId.toString(),
    );
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.unshift({
        ...comment,
        showReplies: false,
      });

      // Automatically show replies when a new reply is created
      parentComment.showReplies = true;

      // Increment reply count
      parentComment.reply_count = (parentComment.reply_count || 0) + 1;

      // Clear any reply errors for this comment
      delete replyErrors.value[parentId];

      replyContent.value = "";
      replyingTo.value = null;

      // Update comment count in store for replies too
      const currentCount = props.post.comments || 0;
      postsStore.updatePostComments(props.post.id.toString(), currentCount + 1);
    }
  } else if (error) {
    replyErrorMessage.value = error;
    console.error("Error creating reply:", error);
  }
  isSubmitting.value = false;
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
    // First, check if this is a reply (has parent_id)
    const commentToDelete = comments.value.find(
      (c) => c.id.toString() === commentId.toString(),
    );
    if (!commentToDelete) {
      // Might be a reply, check all comments' replies
      for (const comment of comments.value) {
        if (comment.replies) {
          const replyIndex = comment.replies.findIndex(
            (r) => r.id.toString() === commentId.toString(),
          );
          if (replyIndex !== -1) {
            // It's a reply, remove it from parent's replies array
            comment.replies.splice(replyIndex, 1);
            // Decrement reply count
            comment.reply_count = Math.max(0, (comment.reply_count || 0) - 1);

            // Update comment count in store (replies count as comments too)
            const currentCount = props.post.comments || 0;
            postsStore.updatePostComments(
              props.post.id.toString(),
              Math.max(0, currentCount - 1),
            );
            return;
          }
        }
      }
    }

    // If we get here, it's a top-level comment
    const index = comments.value.findIndex(
      (c) => c.id.toString() === commentId.toString(),
    );
    if (index !== -1) {
      comments.value.splice(index, 1);

      // Update comment count in store
      const currentCount = props.post.comments || 0;
      postsStore.updatePostComments(
        props.post.id.toString(),
        Math.max(0, currentCount - 1),
      );
    }
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
  const comment = comments.value.find(
    (c) => c.id.toString() === commentId.toString(),
  );
  if (comment) {
    // Clear any previous error for this comment
    delete replyErrors.value[commentId];

    // Always toggle showReplies first so error messages are visible
    comment.showReplies = !comment.showReplies;

    // If we're showing replies and there are no replies loaded yet, fetch them
    if (
      comment.showReplies &&
      (!comment.replies || comment.replies.length === 0)
    ) {
      loadingReplies.value.add(commentId);
      try {
        const { data: replies, error } = await getReplies(commentId);
        if (error) {
          console.error("Error fetching replies:", error);
          replyErrors.value[commentId] = error;
        } else {
          comment.replies = replies;
        }
      } finally {
        loadingReplies.value.delete(commentId);
      }
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

  if (e.shiftKey && document.activeElement === firstElement) {
    lastElement.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    firstElement.focus();
    e.preventDefault();
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="emit('close')"
  >
    <div
      ref="modalRef"
      class="bg-white dark:bg-darkGray w-full max-w-2xl max-h-[80vh] rounded-lg overflow-hidden flex flex-col outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comments-modal-title"
      aria-describedby="comments-modal-description"
      @keydown.escape="emit('close')"
      @keydown.tab="handleTabKey"
      tabindex="-1"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div>
          <h3
            id="comments-modal-title"
            class="font-bold text-xl text-gray-800 dark:text-white"
          >
            Comments
          </h3>
          <p
            id="comments-modal-description"
            class="text-sm text-gray-600 dark:text-gray-400 mt-1"
          >
            {{ comments.length }}
            {{ comments.length === 1 ? "comment" : "comments" }} on this post
          </p>
        </div>
        <button
          ref="closeButtonRef"
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Close"
        >
          <Icon
            name="carbon:close"
            size="24"
            class="text-gray-500 dark:text-gray-400"
          />
        </button>
      </div>

      <!-- Comments List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
         <div v-if="loading" class="text-center py-12">
           <div class="inline-block">
             <Loader />
           </div>
           <p class="mt-4 text-gray-500 dark:text-gray-400">
             Loading comments...
           </p>
         </div>

        <div v-else-if="errorMessage" class="text-center py-4">
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <p class="text-red-600 dark:text-red-400 text-sm">
              {{ errorMessage }}
            </p>
            <button
              @click="fetchComments"
              class="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-12">
          <div class="max-w-sm mx-auto">
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <Icon
                name="carbon:chat"
                size="28"
                class="text-gray-400 dark:text-gray-500"
              />
            </div>
            <h4
              class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              No comments yet
            </h4>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Be the first to share your thoughts on this post.
            </p>
            <div class="text-sm text-gray-400 dark:text-gray-500">
              Start a conversation by adding a comment below.
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
            <div class="flex-1">
              <div
                class="bg-white dark:bg-dark/40 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <NuxtLink
                      :href="`/@${comment.author.username}`"
                      class="font-semibold text-sm hover:underline text-gray-800 dark:text-gray-200"
                    >
                      {{ comment.author.username }}
                    </NuxtLink>
                    <span class="text-xs text-gray-500">{{
                      comment.created_at
                    }}</span>
                  </div>
                  <button
                    v-if="
                      auth.user?.value &&
                      comment.author.id === auth.user?.value.id
                    "
                    @click="handleDeleteComment(comment.id.toString())"
                    class="text-gray-400 hover:text-red-500 p-1 opacity-80 hover:opacity-100 transition-opacity"
                    title="Delete comment"
                  >
                    <Icon name="carbon:trash-can" size="16" />
                  </button>
                </div>
                <div
                  class="mt-2 text-sm text-gray-700 dark:text-gray-300"
                  v-html="sanitizeWithHashtags(comment.content)"
                ></div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-4 mt-3 ml-2">
                <button
                  @click="toggleReply(comment.id.toString())"
                  class="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                >
                  <Icon name="carbon:reply" size="14" />
                  Reply
                </button>
                <div v-if="comment.reply_count > 0">
                  <button
                    @click="toggleShowReplies(comment.id.toString())"
                    :disabled="isLoadingReply(comment.id.toString())"
                    class="text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      v-if="isLoadingReply(comment.id.toString())"
                      name="carbon:loader"
                      size="14"
                      class="animate-spin"
                    />
                    <Icon
                      v-else
                      :name="
                        comment.showReplies
                          ? 'carbon:chevron-up'
                          : 'carbon:chevron-down'
                      "
                      size="14"
                    />
                    {{ comment.reply_count }}
                    {{ comment.reply_count === 1 ? "reply" : "replies" }}
                    <span
                      v-if="
                        !comment.showReplies &&
                        !isLoadingReply(comment.id.toString())
                      "
                      class="ml-1 text-gray-400"
                      >• View</span
                    >
                    <span
                      v-else-if="
                        comment.showReplies &&
                        !isLoadingReply(comment.id.toString())
                      "
                      class="ml-1 text-gray-400"
                      >• Hide</span
                    >
                    <span v-else class="ml-1 text-gray-400">• Loading...</span>
                  </button>
                </div>
                <div v-else>
                  <span class="text-xs text-gray-500 italic">
                    No replies yet
                  </span>
                </div>
              </div>

              <!-- Reply Input -->
              <div
                v-if="replyingTo === comment.id.toString()"
                class="mt-3 ml-2 pl-6 border-l-2 border-blue-200 dark:border-blue-800"
              >
                <div v-if="replyErrorMessage" class="mb-3">
                  <div
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                  >
                    <p class="text-red-600 dark:text-red-400 text-xs">
                      {{ replyErrorMessage }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 mt-1">
                    <Avatar size="xs" />
                  </div>
                  <div class="flex-1">
                    <div class="mb-2">
                      <span class="text-xs text-gray-600 dark:text-gray-400"
                        >Replying to
                        <span class="font-medium">{{
                          comment.author.username
                        }}</span></span
                      >
                    </div>
                    <div class="flex gap-2">
                      <input
                        v-model="replyContent"
                        type="text"
                        placeholder="Write your reply..."
                        class="flex-1 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        @keyup.enter="handleSubmitReply(comment.id.toString())"
                        @keydown.escape="closeReply()"
                        autofocus
                      />
                      <div class="flex gap-2">
                        <button
                          @click="handleSubmitReply(comment.id.toString())"
                          :disabled="!replyContent.trim() || isSubmitting"
                          class="px-4 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          <Icon
                            v-if="isSubmitting"
                            name="carbon:loader"
                            class="animate-spin"
                            size="16"
                          />
                          <span v-else>Reply</span>
                        </button>
                        <button
                          @click="closeReply()"
                          class="px-3 py-3 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <Icon name="carbon:close" size="16" />
                        </button>
                      </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      Press Enter to submit, Esc to cancel
                    </div>
                  </div>
                </div>
              </div>

              <!-- Replies -->
              <div v-if="comment.showReplies" class="mt-2">
                <div class="relative">
                  <!-- Vertical line connecting replies -->
                  <div
                    class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
                  ></div>

                   <div
                     v-if="isLoadingReply(comment.id.toString())"
                     class="text-center py-4"
                   >
                     <Loader />
                   </div>
                  <div
                    v-else-if="getReplyError(comment.id.toString())"
                    class="pl-8 mb-3"
                  >
                    <div
                      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                    >
                      <p class="text-red-600 dark:text-red-400 text-xs">
                        Failed to load replies:
                        {{ getReplyError(comment.id.toString()) }}
                      </p>
                      <button
                        @click="toggleShowReplies(comment.id.toString())"
                        class="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                  <div
                    v-else-if="comment.replies && comment.replies.length > 0"
                    class="space-y-3 pl-8"
                  >
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="flex gap-3 group"
                    >
                      <div class="flex-shrink-0 relative">
                        <div
                          class="absolute -left-6 top-4 w-6 h-0.5 bg-gray-200 dark:bg-gray-700"
                        ></div>
                        <NuxtLink :href="`/@${reply.author.username}`">
                          <Avatar size="sm" />
                        </NuxtLink>
                      </div>
                      <div class="flex-1">
                        <div
                          class="bg-gray-50 dark:bg-dark/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-dark/50 transition-colors"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <NuxtLink
                                :href="`/@${reply.author.username}`"
                                class="font-semibold text-sm hover:underline text-gray-800 dark:text-gray-200"
                              >
                                {{ reply.author.username }}
                              </NuxtLink>
                              <span class="text-xs text-gray-500">{{
                                reply.created_at
                              }}</span>
                            </div>
                            <button
                              v-if="
                                auth.user?.value &&
                                reply.author.id === auth.user?.value.id
                              "
                              @click="handleDeleteComment(reply.id.toString())"
                              class="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete reply"
                            >
                              <Icon name="carbon:trash-can" size="16" />
                            </button>
                          </div>
                          <div
                            class="mt-1 text-sm text-gray-700 dark:text-gray-300"
                            v-html="sanitizeWithHashtags(reply.content)"
                          ></div>

                          <!-- Reply actions -->
                          <div class="flex items-center gap-4 mt-2 ml-1">
                            <button
                              @click="toggleReply(reply.id.toString())"
                              class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                            >
                              <Icon name="carbon:reply" size="12" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-else-if="!isLoadingReply(comment.id.toString())"
                    class="text-sm text-gray-500 pl-8 py-3 italic"
                  >
                    No replies yet. Be the first to reply!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Comment Input -->
      <div
        class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30"
      >
        <div v-if="errorMessage && !loading" class="mb-4">
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <p class="text-red-600 dark:text-red-400 text-xs">
              {{ errorMessage }}
            </p>
          </div>
        </div>
        <form @submit.prevent="handleSubmitComment" class="flex gap-4">
          <div class="flex-shrink-0">
            <Avatar size="md" />
          </div>
          <div class="flex-1">
            <div class="mb-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Add a comment</label
              >
            </div>
            <div class="flex gap-3">
              <input
                v-model="newComment"
                type="text"
                placeholder="Share your thoughts..."
                class="flex-1 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                @keyup.enter="handleSubmitComment"
              />
              <button
                type="submit"
                :disabled="!newComment.trim() || isSubmitting"
                class="px-6 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Icon
                  v-if="isSubmitting"
                  name="carbon:loader"
                  class="animate-spin"
                  size="16"
                />
                <span v-else>Post</span>
              </button>
            </div>
            <div class="mt-2 text-xs text-gray-500">Press Enter to submit</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Smooth hover transitions
button,
input,
.rounded-lg,
.rounded-md {
  transition: all 0.2s ease-in-out;
}

// Custom scrollbar for comments area
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>

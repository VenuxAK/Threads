<script lang="ts" setup>
import type { Comment } from "~/types";

const props = defineProps<{
  item: Comment;
  showComposer: boolean;
  replyContent: string;
  composerError: string | null;
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  delete: [id: string];
  "toggle-reply": [id: string];
  "submit-reply": [parentId: string];
  "close-reply": [];
  "update:replyContent": [value: string];
}>();

const auth = useAuth();
const { sanitizeWithHashtags } = useSanitize();

const parentIdStr = computed(() => props.item.id.toString());
</script>

<template>
  <div
    class="flex gap-3 py-3 px-2 sm:px-3 border-b border-gray-100/90 dark:border-white/[0.06] last:border-b-0 touch-manipulation"
  >
    <NuxtLink
      :href="`/@${item.author.username}`"
      class="flex-shrink-0 pt-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      <Avatar size="sm" />
    </NuxtLink>
    <div class="flex-1 min-w-0">
      <p
        v-if="item.replying_to?.username"
        class="text-[11px] leading-snug text-lightGray mb-1 truncate"
      >
        Replying to
        <NuxtLink
          :href="`/@${item.replying_to.username}`"
          class="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >@{{ item.replying_to.username }}</NuxtLink
        >
      </p>
      <div class="flex items-start justify-between gap-2">
        <p class="min-w-0 text-sm leading-tight">
          <NuxtLink
            :href="`/@${item.author.username}`"
            class="font-semibold text-gray-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            {{ item.author.username }}
          </NuxtLink>
          <span class="text-lightGray font-normal">&nbsp;·&nbsp;</span>
          <span class="text-xs font-normal text-lightGray">{{
            item.created_at
          }}</span>
        </p>
        <button
          v-if="auth.user?.value && item.author.id === auth.user?.value.id"
          type="button"
          class="flex-shrink-0 -mr-1 p-2 rounded-full text-lightGray hover:text-red-500 hover:bg-gray-100/90 dark:hover:bg-white/[0.06] active:scale-95 transition-transform"
          title="Delete"
          @click="emit('delete', parentIdStr)"
        >
          <Icon name="carbon:trash-can" size="16" />
        </button>
      </div>
      <div
        class="comment-prose mt-1 text-[14px] leading-relaxed text-gray-900 dark:text-gray-100"
        v-html="sanitizeWithHashtags(item.content)"
      />

      <button
        type="button"
        class="mt-2 -ml-1.5 px-2 py-2 text-xs font-semibold text-lightGray hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/[0.05] active:opacity-70 min-h-[40px] inline-flex items-center"
        @click="emit('toggle-reply', parentIdStr)"
      >
        Reply
      </button>

      <div
        v-if="showComposer"
        class="mt-3 pl-0.5 border-l-2 border-gray-200/90 dark:border-white/10 ml-0.5"
      >
        <div v-if="composerError" class="mb-2 px-1">
          <p class="text-xs text-red-600 dark:text-red-400">{{ composerError }}</p>
        </div>
        <div
          class="flex flex-col gap-2 rounded-2xl bg-gray-100/90 dark:bg-white/[0.06] p-2 sm:flex-row sm:items-center"
        >
          <input
            :value="replyContent"
            type="text"
            placeholder="Add a reply…"
            class="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-lightGray focus:outline-none"
            @input="
              emit(
                'update:replyContent',
                ($event.target as HTMLInputElement).value,
              )
            "
            @keyup.enter="emit('submit-reply', parentIdStr)"
            @keydown.escape="emit('close-reply')"
          />
          <div class="flex items-center justify-end gap-2 px-1 pb-1 sm:pb-0 sm:pr-1 shrink-0">
            <button
              type="button"
              class="px-3 py-2 text-sm font-semibold text-lightGray hover:text-gray-700 dark:hover:text-gray-200 rounded-full min-h-[40px]"
              @click="emit('close-reply')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-semibold rounded-full min-h-[40px] text-blue-600 dark:text-blue-400 disabled:opacity-35 disabled:pointer-events-none"
              :disabled="!replyContent.trim() || isSubmitting"
              @click="emit('submit-reply', parentIdStr)"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-prose :deep(a) {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}
</style>

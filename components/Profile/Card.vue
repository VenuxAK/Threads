<script setup lang="ts">
import type { User } from '~/types';

/**
 * Profile user preview card for user lists and search results.
 * Displays user identity, dynamic follower tally, and an interactive Follow/Following
 * action button with optimistic state updates.
 */
const props = defineProps<{ user: User }>();

const { user: authUser } = useAuth();
const { followUser, unfollowUser } = useFollow();

const isFollowing = ref(props.user.is_following ?? false);
const followersCount = ref(props.user.followers_count ?? props.user.followers ?? 0);
const isProcessing = ref(false);

const isSelf = computed(() => {
  if (!authUser.value) return false;
  return (
    String(authUser.value.id) === String(props.user.id) ||
    authUser.value.username === props.user.username
  );
});

watch(
  () => props.user.is_following,
  (newVal) => {
    if (newVal !== undefined) {
      isFollowing.value = newVal;
    }
  }
);

watch(
  () => props.user.followers_count,
  (newVal) => {
    if (newVal !== undefined) {
      followersCount.value = newVal;
    }
  }
);

const handleToggleFollow = async () => {
  if (isProcessing.value || isSelf.value) return;

  isProcessing.value = true;
  const wasFollowing = isFollowing.value;

  // Optimistic UI update
  isFollowing.value = !wasFollowing;
  followersCount.value = Math.max(0, followersCount.value + (wasFollowing ? -1 : 1));

  try {
    const result = wasFollowing
      ? await unfollowUser(props.user.id)
      : await followUser(props.user.id);

    if (result.success) {
      isFollowing.value = result.status;
      followersCount.value = result.followersCount;
    } else {
      // Revert optimistic update
      isFollowing.value = wasFollowing;
      followersCount.value = Math.max(0, followersCount.value + (wasFollowing ? 1 : -1));
    }
  } catch (err) {
    // Revert optimistic update
    isFollowing.value = wasFollowing;
    followersCount.value = Math.max(0, followersCount.value + (wasFollowing ? 1 : -1));
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="w-full px-5 py-3">
    <div class="flex items-center space-x-2">
      <div>
        <NuxtLink :href="user?.username ? `/@${user.username}` : ''">
          <Avatar :src="user.avatar" />
        </NuxtLink>
      </div>
      <div class="flex-1 flex justify-between items-center">
        <div>
          <NuxtLink :href="user?.username ? `/@${user.username}` : ''">
            <p class="text-sm font-bold hover:underline">{{ user.username }}</p>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">{{ user.name }}</p>
          </NuxtLink>
        </div>
        <div v-if="!isSelf">
          <button
            :disabled="isProcessing"
            @click="handleToggleFollow"
            :class="['btn-follow', isFollowing ? 'btn-following' : '']"
          >
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>
    </div>
    <p class="ml-9 text-sm text-gray-500 dark:text-lightGray/60 mt-1">
      <NuxtLink :href="user?.username ? `/@${user.username}` : '#'" class="hover:underline">
        {{ followersCount }} followers
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped lang="scss">
.btn-follow {
  @apply py-1.5 px-5 border border-darkGray rounded-xl text-sm font-bold transition-colors cursor-pointer dark:text-white hover:bg-black/5 dark:hover:bg-white/10;

  &.btn-following {
    @apply border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/70 hover:border-red-500 hover:text-red-500;
  }
}
</style>

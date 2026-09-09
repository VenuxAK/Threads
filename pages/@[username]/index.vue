<script lang="ts" setup>
import type { User, Post, Pagination } from '~/types';

definePageMeta({
  middleware: "sanctum:auth",
});

const { user: authUser } = useAuth();
const {
  getUserPosts,
  getUserAndPosts,
  getUser,
  getMyReposts,
  getUserReposts,
} = useUser();
const route = useRoute();

const getUsernameParam = (): string => {
  const param = route.params.username;
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

const usernameStr = getUsernameParam();
const userData = await getUser(usernameStr);

if (!userData) {
  throw createError({ statusCode: 404, statusMessage: 'User not found' });
}

const user = ref<User>(userData);
const { followUser, unfollowUser } = useFollow();
const isFollowing = ref(user.value.is_following ?? false);
const followersCount = ref(user.value.followers_count ?? user.value.followers ?? 0);
const followingCount = ref(user.value.following_count ?? user.value.following ?? 0);
const isFollowProcessing = ref(false);

const handleToggleFollow = async () => {
  if (isFollowProcessing.value || authUser.value?.username === user.value.username) return;

  isFollowProcessing.value = true;
  const wasFollowing = isFollowing.value;

  isFollowing.value = !wasFollowing;
  followersCount.value = Math.max(0, followersCount.value + (wasFollowing ? -1 : 1));

  try {
    const result = wasFollowing
      ? await unfollowUser(user.value.id)
      : await followUser(user.value.id);

    if (result.success) {
      isFollowing.value = result.status;
      followersCount.value = result.followersCount;
      if (result.followingCount !== undefined) {
        followingCount.value = result.followingCount;
      }
    } else {
      isFollowing.value = wasFollowing;
      followersCount.value = Math.max(0, followersCount.value + (wasFollowing ? 1 : -1));
    }
  } catch {
    isFollowing.value = wasFollowing;
    followersCount.value = Math.max(0, followersCount.value + (wasFollowing ? 1 : -1));
  } finally {
    isFollowProcessing.value = false;
  }
};

const { posts, loading, loadingMore, hasMore, loadPosts, loadMore } = usePostList({
  fetchFn: async (page: number) => {
    if (authUser.value?.username === user.value.username) {
      return await getUserPosts(usernameStr, page);
    } else {
      return await getUserAndPosts(usernameStr, page);
    }
  }
});

const repostPosts = ref<Post[]>([]);
const repostPagination = ref<Pagination | null>(null);
const repostCurrentPage = ref(1);
const repostHasMore = ref(true);
const repostLoading = ref(false);
const repostLoadingMore = ref(false);
const repostsFetched = ref(false);

const fetchReposts = async (page: number, append: boolean) => {
  if (append && repostLoadingMore.value) return;
  if (append) {
    repostLoadingMore.value = true;
  } else {
    repostLoading.value = true;
  }

  try {
    const isOwn = authUser.value?.username === user.value.username;
    const result = isOwn
      ? await getMyReposts(page)
      : await getUserReposts(usernameStr, page);

    if (append) {
      repostPosts.value = [...repostPosts.value, ...result.posts];
    } else {
      repostPosts.value = result.posts;
    }
    repostPagination.value = result.pagination;
    if (result.pagination) {
      repostHasMore.value =
        result.pagination.current_page < result.pagination.last_page;
      repostCurrentPage.value = result.pagination.current_page;
    } else {
      repostHasMore.value = false;
    }
  } catch (e) {
    console.error(e);
  } finally {
    repostLoading.value = false;
    repostLoadingMore.value = false;
  }
};

const loadMoreReposts = () => {
  if (repostHasMore.value && !repostLoadingMore.value) {
    fetchReposts(repostCurrentPage.value + 1, true);
  }
};

const loadTrigger = ref<HTMLElement | null>(null);

const tab = ref<'posts' | 'reposts'>('posts');

const toggleTab = async (t: 'posts' | 'reposts') => {
  if (t === 'reposts' && !repostsFetched.value) {
    repostsFetched.value = true;
    repostLoading.value = true;
    tab.value = t;
    await fetchReposts(1, false);
    return;
  }
  tab.value = t;
};

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await loadPosts();

  if (import.meta.client) {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (tab.value === 'posts') {
          loadMore();
        } else {
          loadMoreReposts();
        }
      },
      { threshold: 0.1 },
    );

    nextTick(() => {
      if (loadTrigger.value && observer) {
        observer.observe(loadTrigger.value);
      }
    });
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div id="user-profile-page" class="sm:p-6">
    <div class="p-3 sm:p-0">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-lg sm:text-xl">{{ user.name }}</h3>
          <h5 class="dark:text-white/70">{{ user.username }}</h5>
        </div>
        <div>
          <button>
            <Avatar :src="user.avatar" class="w-[75px]" />
          </button>
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <div>
              <p :class="user.bio ? 'visible' : 'invisible'">
                {{ user.bio ?? "Bio..." }}
              </p>
            </div>
            <div class="flex items-center space-x-3 text-sm">
              <div>
                <button class="hover:underline">
                  {{ followersCount }} followers
                </button>
              </div>
              <div>
                <button class="hover:underline">
                  {{ followingCount }} following
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="my-4">
        <div v-if="user?.username === authUser?.username">
          <button class="w-full border dark:border-darkGray py-1.5 rounded-lg">
            Edit profile
          </button>
        </div>
        <div v-else>
          <button
            :disabled="isFollowProcessing"
            @click="handleToggleFollow"
            class="w-full border dark:border-darkGray py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
            :class="isFollowing ? 'border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/70 hover:border-red-500 hover:text-red-500' : 'bg-black text-white dark:bg-white dark:text-black'"
          >
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>
    </div>

    <div>
      <div class="border-b dark:border-white/10">
        <div class="btn-tabs">
          <button
            :class="['tab-btn', tab == 'posts' ? 'active-tab' : '']"
            @click="toggleTab('posts')"
          >
            Posts
          </button>
          <button
            :class="['tab-btn', tab == 'reposts' ? 'active-tab' : '']"
            @click="toggleTab('reposts')"
          >
            Reposts
          </button>
        </div>
      </div>

      <div class="mt-6">
        <ProfilePostsList
          :posts="posts"
          v-if="tab == 'posts'"
          :loading="loading"
        />

        <ProfileRepostsList
          v-if="tab == 'reposts'"
          :posts="repostPosts"
          :loading="repostLoading"
        />
      </div>
    </div>
    
    <div ref="loadTrigger" class="py-4 text-center">
      <div v-if="tab === 'posts' && loadingMore" class="text-sm text-gray-500">Loading more...</div>
      <div
        v-else-if="tab === 'posts' && !hasMore && posts.length > 0"
        class="text-sm text-gray-500"
      >
        No more posts
      </div>
      <div
        v-else-if="tab === 'reposts' && repostLoadingMore"
        class="text-sm text-gray-500"
      >
        Loading more…
      </div>
      <div
        v-else-if="tab === 'reposts' && !repostHasMore && repostPosts.length > 0"
        class="text-sm text-gray-500"
      >
        No more reposts
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.social-btn {
  @apply hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full flex items-center;
}
.btn-tabs {
  @apply flex;
}
.tab-btn {
  @apply block w-[50%] py-5 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 text-center;
}
.active-tab {
  @apply border-b-2 border-b-black/60 dark:border-b-white/50;
}
</style>

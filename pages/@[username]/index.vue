<script lang="ts" setup>
import type { User, Post } from '~/types';

definePageMeta({
  middleware: "sanctum:auth",
});

const { user: authUser } = useAuth();
const { getUserPosts, getUserAndPosts, getUser } = useUser();
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

const { posts, loading, loadingMore, hasMore, loadPosts, loadMore } = usePostList({
  fetchFn: async (page: number) => {
    if (authUser.value?.username === user.value.username) {
      return await getUserPosts(usernameStr, page);
    } else {
      return await getUserAndPosts(usernameStr, page);
    }
  }
});

const loadTrigger = ref<HTMLElement | null>(null);

const tab = ref<'posts' | 'reposts'>('posts');
const toggleTab = (_tab: 'posts' | 'reposts') => {
  tab.value = _tab;
};

onMounted(async () => {
  await loadPosts();
  
  if (import.meta.client) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        loadMore();
      }
    }, { threshold: 0.1 });
    
    nextTick(() => {
      if (loadTrigger.value) {
        observer.observe(loadTrigger.value);
      }
    });
    
    onUnmounted(() => observer.disconnect());
  }
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
                  {{ user.followes ?? 0 }} followers
                </button>
              </div>
              <div>
                <button class="hover:underline">
                  {{ user.following ?? 0 }} following
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
          <button class="w-full border dark:border-darkGray py-1.5 rounded-lg">
            Follow
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
          :loading="!loading"
        />

        <ProfileRepostsList :posts="user.reposts" v-if="tab == 'reposts'" />
      </div>
    </div>
    
    <div ref="loadTrigger" class="py-4 text-center">
      <div v-if="loadingMore" class="text-sm text-gray-500">Loading more...</div>
      <div v-else-if="!hasMore && posts.length > 0" class="text-sm text-gray-500">No more posts</div>
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

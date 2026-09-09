<script setup lang="ts">
import type { Notification } from "~/types";

/**
 * In-App Notifications Page.
 * Displays user activity alerts organized into tabs (All, Replies, Mentions, Follows).
 * Features read-state indicators, mark-as-read mutations, and direct thread/user navigation.
 */
definePageMeta({
  middleware: "sanctum:auth",
});

const router = useRouter();
const { fetchNotifications, markAsRead, markAllAsRead } = useNotification();

type TabType = 'all' | 'replies' | 'mentions' | 'follows';
const activeTab = ref<TabType>('all');

const tabs: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'replies', label: 'Replies' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'follows', label: 'Follows' },
];

const notifications = ref<Notification[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);
const loadTrigger = ref<HTMLElement | null>(null);

const loadNotifications = async (page: number = 1, append: boolean = false) => {
  if (append && loadingMore.value) return;

  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const filter = activeTab.value === 'all' ? undefined : activeTab.value;
    const result = await fetchNotifications(page, filter);

    if (append) {
      notifications.value = [...notifications.value, ...result.notifications];
    } else {
      notifications.value = result.notifications;
    }

    if (result.pagination) {
      hasMore.value = result.pagination.current_page < result.pagination.last_page;
      currentPage.value = result.pagination.current_page;
    } else {
      hasMore.value = false;
    }
  } catch (err) {
    console.error('Failed to load notifications:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const switchTab = (tab: TabType) => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  notifications.value = [];
  loadNotifications(1, false);
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value && !loading.value) {
    loadNotifications(currentPage.value + 1, true);
  }
};

const handleMarkAllRead = async () => {
  await markAllAsRead();
  notifications.value.forEach((n) => {
    n.read_at = new Date().toISOString();
  });
};

const handleNotificationClick = async (notif: Notification) => {
  if (!notif.read_at) {
    notif.read_at = new Date().toISOString();
    await markAsRead(notif.id);
  }

  if (notif.type === 'follow') {
    if (notif.sender?.username) {
      router.push(`/@${notif.sender.username}`);
    }
  } else if (notif.post?.id || notif.entity_id) {
    const targetPostId = notif.post?.id ?? notif.entity_id;
    router.push(`/post/${targetPostId}`);
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return { name: 'ph:heart-fill', color: 'text-red-500 bg-red-500/10' };
    case 'comment':
      return { name: 'ph:chat-circle-fill', color: 'text-sky-500 bg-sky-500/10' };
    case 'repost':
      return { name: 'ph:repeat-bold', color: 'text-emerald-500 bg-emerald-500/10' };
    case 'follow':
      return { name: 'gravity-ui:person-plus', color: 'text-purple-500 bg-purple-500/10' };
    case 'mention':
      return { name: 'ph:at-bold', color: 'text-amber-500 bg-amber-500/10' };
    default:
      return { name: 'gravity-ui:bell', color: 'text-gray-500 bg-gray-500/10' };
  }
};

const getNotificationMessage = (notif: Notification) => {
  switch (notif.type) {
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'replied to your thread';
    case 'repost':
      return 'reposted your thread';
    case 'follow':
      return 'started following you';
    case 'mention':
      return 'mentioned you in a reply';
    default:
      return 'interacted with your content';
  }
};

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await loadNotifications(1, false);

  if (import.meta.client) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
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
  <div class="space-y-2">
    <!-- Header & Tabs -->
    <div class="px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Activity</h1>
      <button
        @click="handleMarkAllRead"
        class="text-xs font-semibold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
      >
        Mark all as read
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="flex space-x-2 px-4 py-2 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="switchTab(t.id)"
        :class="[
          'px-4 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap',
          activeTab === t.id
            ? 'bg-black text-white dark:bg-white dark:text-black'
            : 'border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
        ]"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Notifications List -->
    <div
      v-if="notifications.length > 0"
      class="divide-y divide-gray-200 dark:divide-white/10"
    >
      <div
        v-for="notif in notifications"
        :key="notif.id"
        @click="handleNotificationClick(notif)"
        class="p-4 flex items-start space-x-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer relative"
        :class="{ 'bg-purple-50/50 dark:bg-purple-950/10': !notif.read_at }"
      >
        <!-- Unread Indicator Dot -->
        <div
          v-if="!notif.read_at"
          class="absolute top-5 left-1 w-2 h-2 rounded-full bg-purple-600"
        ></div>

        <!-- Sender Avatar + Action Badge -->
        <div class="relative shrink-0">
          <Avatar :src="notif.sender?.avatar" class="w-10 h-10" />
          <div
            class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
            :class="getNotificationIcon(notif.type).color"
          >
            <Icon :name="getNotificationIcon(notif.type).name" size="11px" />
          </div>
        </div>

        <!-- Notification Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-1 text-sm">
            <span class="font-bold text-gray-900 dark:text-white truncate">
              {{ notif.sender?.username ?? 'user' }}
            </span>
            <span class="text-gray-500 dark:text-gray-400 text-xs">
              {{ notif.created_at }}
            </span>
          </div>

          <p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
            {{ getNotificationMessage(notif) }}
          </p>

          <!-- Post Content Preview Snippet -->
          <p
            v-if="notif.post?.content"
            class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 border-l-2 border-gray-300 dark:border-white/20 pl-2 italic"
          >
            "{{ notif.post.content }}"
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && notifications.length === 0"
      class="py-20 text-center px-4 space-y-4"
    >
      <div class="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
        <Icon name="gravity-ui:bell" size="32px" />
      </div>
      <div class="space-y-1">
        <h3 class="font-bold text-lg text-gray-900 dark:text-white">No notifications yet</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          When people interact with your threads, reply, or follow you, you'll see them here.
        </p>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="divide-y divide-gray-200 dark:divide-white/10 p-4 space-y-4">
      <div v-for="i in 5" :key="i" class="flex items-center space-x-3 animate-pulse">
        <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-darkGray shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200 dark:bg-darkGray rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 dark:bg-darkGray rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Infinite Scroll Trigger -->
    <div ref="loadTrigger" class="py-4 text-center">
      <div v-if="loadingMore" class="text-sm text-gray-500">
        <Loader />
      </div>
      <div
        v-else-if="!hasMore && notifications.length > 0"
        class="text-sm text-gray-500"
      >
        No more notifications
      </div>
    </div>
  </div>
</template>

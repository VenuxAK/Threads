import { defineStore } from 'pinia';

/**
 * Pinia state store for managing in-app notifications and unread badge counters.
 * Maintains real-time reactive badge values for desktop sidebar and mobile navigation.
 */
interface NotificationsState {
  unreadCount: number;
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    unreadCount: 0,
  }),

  actions: {
    setUnreadCount(count: number) {
      this.unreadCount = Math.max(0, count);
    },

    decrementUnreadCount(amount: number = 1) {
      this.unreadCount = Math.max(0, this.unreadCount - amount);
    },

    clearUnreadCount() {
      this.unreadCount = 0;
    },
  },
});

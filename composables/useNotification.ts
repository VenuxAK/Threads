import type { Notification, Pagination } from '~/types';
import {
  NOTIFICATIONS_QUERY,
  UNREAD_NOTIFICATIONS_COUNT_QUERY,
} from '~/graphql/queries/notifications';
import {
  MARK_NOTIFICATION_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
} from '~/graphql/mutations/notifications';
import { useNotificationsStore } from '~/stores/notifications';

/**
 * Composable for user in-app notifications and unread badges via GraphQL.
 * Coordinates data retrieval with Pinia notifications store to ensure navigation badges
 * stay synchronized whenever alerts are read or fetched.
 */
export const useNotification = () => {
  const { query, mutate } = useGraphQL();
  const notificationsStore = useNotificationsStore();

  /**
   * Fetch paginated notifications with optional type filtering.
   *
   * @param page Target page number (default 1).
   * @param type Filter type ('replies', 'mentions', 'follows', or null for all).
   */
  const fetchNotifications = async (
    page: number = 1,
    type?: string
  ): Promise<{ notifications: Notification[]; pagination: Pagination | null }> => {
    try {
      const variables: { page: number; perPage: number; type?: string } = {
        page,
        perPage: 20,
      };
      if (type && type !== 'all') {
        variables.type = type;
      }

      const { data, error } = await query<{
        notifications: {
          data: Notification[];
          pagination: Pagination;
        };
      }>(NOTIFICATIONS_QUERY, variables);

      if (error || !data?.notifications) {
        console.error('fetchNotifications GraphQL error:', error);
        return { notifications: [], pagination: null };
      }

      return {
        notifications: data.notifications.data ?? [],
        pagination: data.notifications.pagination ?? null,
      };
    } catch (err) {
      console.error('fetchNotifications unexpected error:', err);
      return { notifications: [], pagination: null };
    }
  };

  /**
   * Query the total unread notifications count and synchronize with Pinia store.
   */
  const fetchUnreadCount = async (): Promise<number> => {
    try {
      const { data, error } = await query<{ unreadNotificationsCount: number }>(
        UNREAD_NOTIFICATIONS_COUNT_QUERY
      );

      if (error || data?.unreadNotificationsCount === undefined) {
        return 0;
      }

      const count = Number(data.unreadNotificationsCount) || 0;
      notificationsStore.setUnreadCount(count);
      return count;
    } catch (err) {
      console.error('fetchUnreadCount error:', err);
      return 0;
    }
  };

  /**
   * Mark an individual notification as read.
   */
  const markAsRead = async (id: string | number): Promise<boolean> => {
    try {
      const { data, error } = await mutate<{ markNotificationAsRead: boolean }>(
        MARK_NOTIFICATION_AS_READ_MUTATION,
        { id: String(id) }
      );

      if (error) {
        return false;
      }

      const success = Boolean(data?.markNotificationAsRead);
      if (success) {
        notificationsStore.decrementUnreadCount(1);
      }
      return success;
    } catch (err) {
      console.error('markAsRead error:', err);
      return false;
    }
  };

  /**
   * Mark all unread notifications as read.
   */
  const markAllAsRead = async (): Promise<boolean> => {
    try {
      const { data, error } = await mutate<{ markAllNotificationsAsRead: boolean }>(
        MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION
      );

      if (error) {
        return false;
      }

      const success = Boolean(data?.markAllNotificationsAsRead);
      if (success) {
        notificationsStore.clearUnreadCount();
      }
      return success;
    } catch (err) {
      console.error('markAllAsRead error:', err);
      return false;
    }
  };

  return {
    unreadCount: computed(() => notificationsStore.unreadCount),
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};

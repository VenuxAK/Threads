/**
 * GraphQL Mutation operations for in-app notification read state transitions.
 * Supports marking individual alerts as read upon navigation, or clearing all pending unreads.
 */

export const MARK_NOTIFICATION_AS_READ_MUTATION = `
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id)
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = `
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

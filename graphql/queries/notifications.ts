import { POST_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for user in-app notifications and unread badges.
 * Hydrates sender identities and post snippets for rich notification list items.
 */

export const NOTIFICATIONS_QUERY = `
  ${POST_FRAGMENT}
  query GetNotifications($page: Int, $perPage: Int, $type: String) {
    notifications(page: $page, perPage: $perPage, type: $type) {
      data {
        id
        type
        entity_id
        read_at
        created_at
        sender {
          ...UserFields
        }
        post {
          ...PostFields
        }
      }
      pagination {
        total
        per_page
        current_page
        last_page
        has_more
      }
    }
  }
`;

export const UNREAD_NOTIFICATIONS_COUNT_QUERY = `
  query GetUnreadNotificationsCount {
    unreadNotificationsCount
  }
`;

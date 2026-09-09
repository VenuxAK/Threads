import type { Post, Pagination } from './post';
import type { Author } from './user';

/**
 * TypeScript interface representing an in-app notification in ThreadsApp.
 * Matches the GraphQL Notification type, providing sender and post details for display.
 */
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'repost' | 'follow' | 'mention' | string;
  entity_id?: string | null;
  read_at?: string | null;
  created_at: string;
  sender: Author;
  post?: Post | null;
}

export interface NotificationPaginator {
  data: Notification[];
  pagination: Pagination;
}

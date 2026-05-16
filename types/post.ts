export interface Author {
  id: number | string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  id: number | string;
  content: string;
  author: Author;
  published_at: string;
  edited_at?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
  is_liked?: boolean;
  is_reposted?: boolean;
  parent_id?: number | string;
  tags?: string[];
  interactions?: {
    likes: number;
    comments: number;
    shares: number;
    reposts: number;
  };
}

export interface Comment {
  id: string | number;
  content: string;
  post_id: string | number;
  parent_id?: string | number;
  created_at: string;
  author: Author;
  reply_count?: number;
  /** Flat thread under a top-level comment (from GET …/comments/{id}/thread) */
  threadItems?: Comment[];
  replies?: Comment[];
  showReplies?: boolean;
  /** Shown when this reply is to another reply (not the root comment) */
  replying_to?: { username: string } | null;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

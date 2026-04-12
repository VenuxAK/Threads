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
  parent_id?: number | string;
  tags?: string[];
  interactions?: {
    likes: number;
    comments: number;
    shares: number;
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
  replies?: Comment[];
  showReplies?: boolean;
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

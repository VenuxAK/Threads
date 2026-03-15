export interface Author {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

export interface Post {
  id: number;
  content: string;
  author: Author;
  published_at: string;
  likes?: number;
  comments?: number;
  reposts?: number;
  parent_id?: number;
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

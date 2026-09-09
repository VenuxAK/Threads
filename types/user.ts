import type { Post } from './post';

export interface User {
  id: number | string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  following?: number;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
  created_at?: string;
  reposts?: Post[];
}

export interface Author {
  id: number | string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
}


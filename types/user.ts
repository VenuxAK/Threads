import type { Post } from './post';

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  avatar?: string;
  followes?: number;
  following?: number;
  reposts?: Post[];
}

export interface Author {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

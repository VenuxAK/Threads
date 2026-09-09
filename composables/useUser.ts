import type { User, Post, Pagination } from '~/types';
import { USER_QUERY } from '~/graphql/queries/user';
import {
  MY_POSTS_QUERY,
  USER_POSTS_QUERY,
  MY_REPOSTS_QUERY,
  USER_REPOSTS_QUERY,
  MY_LIKED_POSTS_QUERY,
} from '~/graphql/queries/feed';

/**
 * Composable for querying user profiles, user posts, and reposts via GraphQL.
 *
 * Centralizes user-specific feed queries for profile pages, providing typed responses
 * matching the frontend's Post and Pagination interface contracts.
 */
export const useUser = () => {
  const { query } = useGraphQL();

  /**
   * Fetch a public user profile by username.
   *
   * @param username The unique handle of the user.
   * @returns The User profile object, or null if not found.
   */
  const getUser = async (username: string): Promise<User | null> => {
    const { data, error } = await query<{ user: User }>(USER_QUERY, { username });
    if (error || !data?.user) return null;
    return data.user;
  };

  /**
   * Fetch authored posts for the authenticated user.
   *
   * @param username The username (retained for backward compatibility).
   * @param page The requested pagination page number.
   * @returns Object containing the posts list and pagination metadata.
   */
  const getUserPosts = async (username: string, page: number = 1) => {
    try {
      const { data, error } = await query<{
        myPosts: {
          data: Post[];
          pagination: Pagination;
        };
      }>(MY_POSTS_QUERY, { page, perPage: 15 });

      if (error || !data?.myPosts) {
        return { posts: [], pagination: null };
      }

      return {
        posts: data.myPosts.data ?? [],
        pagination: data.myPosts.pagination ?? null,
      };
    } catch (err) {
      console.error('getUserPosts error:', err);
      return { posts: [], pagination: null };
    }
  };

  /**
   * Fetch posts for a specific public user profile.
   *
   * @param username The target user's username.
   * @param page The requested pagination page number.
   * @returns Object containing the posts list and pagination metadata.
   */
  const getUserAndPosts = async (username: string, page: number = 1) => {
    try {
      const { data, error } = await query<{
        userPosts: {
          data: Post[];
          pagination: Pagination;
        };
      }>(USER_POSTS_QUERY, { username, page, perPage: 15 });

      if (error || !data?.userPosts) {
        return { posts: [], pagination: null };
      }

      return {
        posts: data.userPosts.data ?? [],
        pagination: data.userPosts.pagination ?? null,
      };
    } catch (err) {
      console.error('getUserAndPosts error:', err);
      return { posts: [], pagination: null };
    }
  };

  /**
   * Fetch reposted posts for the authenticated user.
   *
   * @param page The requested pagination page number.
   * @returns Object containing the reposted posts and pagination metadata.
   */
  const getMyReposts = async (page: number = 1) => {
    try {
      const { data, error } = await query<{
        myReposts: {
          data: Post[];
          pagination: Pagination;
        };
      }>(MY_REPOSTS_QUERY, { page, perPage: 15 });

      if (error || !data?.myReposts) {
        return { posts: [], pagination: null };
      }

      return {
        posts: data.myReposts.data ?? [],
        pagination: data.myReposts.pagination ?? null,
      };
    } catch (err) {
      console.error('getMyReposts error:', err);
      return { posts: [], pagination: null };
    }
  };

  /**
   * Fetch reposted posts for a specific public user.
   *
   * @param username The target user's username.
   * @param page The requested pagination page number.
   * @returns Object containing the reposted posts and pagination metadata.
   */
  const getUserReposts = async (username: string, page: number = 1) => {
    try {
      const { data, error } = await query<{
        userReposts: {
          data: Post[];
          pagination: Pagination;
        };
      }>(USER_REPOSTS_QUERY, { username, page, perPage: 15 });

      if (error || !data?.userReposts) {
        return { posts: [], pagination: null };
      }

      return {
        posts: data.userReposts.data ?? [],
        pagination: data.userReposts.pagination ?? null,
      };
    } catch (err) {
      console.error('getUserReposts error:', err);
      return { posts: [], pagination: null };
    }
  };

  /**
   * Fetch posts liked by the authenticated user via GraphQL.
   *
   * @param page The requested pagination page number.
   * @returns Object containing the liked posts and pagination metadata.
   */
  const getMyLikedPosts = async (page: number = 1) => {
    try {
      const { data, error } = await query<{
        myLikedPosts: {
          data: Post[];
          pagination: Pagination;
        };
      }>(MY_LIKED_POSTS_QUERY, { page, perPage: 15 });

      if (error || !data?.myLikedPosts) {
        return { posts: [], pagination: null };
      }

      return {
        posts: data.myLikedPosts.data ?? [],
        pagination: data.myLikedPosts.pagination ?? null,
      };
    } catch (err) {
      console.error('getMyLikedPosts error:', err);
      return { posts: [], pagination: null };
    }
  };

  return {
    getUser,
    getUserPosts,
    getUserAndPosts,
    getMyReposts,
    getUserReposts,
    getMyLikedPosts,
  };
};

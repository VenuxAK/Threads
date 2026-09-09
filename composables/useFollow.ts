import type { Post, Pagination, User } from '~/types';
import {
  FOLLOWING_FEED_QUERY,
  FOLLOWING_QUERY,
  FOLLOWERS_QUERY,
} from '~/graphql/queries/follow';
import {
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from '~/graphql/mutations/follow';

/**
 * Composable for managing user follow graphs and followed post feeds via GraphQL.
 * Encapsulates mutation operations with typed returns to drive reactive follow buttons
 * and handles pagination for the Following feed.
 */
export const useFollow = () => {
  const { query, mutate } = useGraphQL();

  /**
   * Follow a user by their unique ID.
   *
   * @param userId The target user ID.
   * @returns Object containing success flag, updated follower/following counts, and user object.
   */
  const followUser = async (userId: string | number) => {
    try {
      const { data, error } = await mutate<{
        followUser: {
          status: boolean;
          followers_count: number;
          following_count: number;
          user?: User;
        };
      }>(FOLLOW_USER_MUTATION, { userId: String(userId) });

      if (error || !data?.followUser) {
        console.error('followUser GraphQL error:', error);
        return { success: false, status: false, followersCount: 0, followingCount: 0 };
      }

      return {
        success: true,
        status: data.followUser.status,
        followersCount: data.followUser.followers_count,
        followingCount: data.followUser.following_count,
        user: data.followUser.user,
      };
    } catch (err) {
      console.error('followUser unexpected error:', err);
      return { success: false, status: false, followersCount: 0, followingCount: 0 };
    }
  };

  /**
   * Unfollow a user by their unique ID.
   *
   * @param userId The target user ID.
   * @returns Object containing success flag and updated counter state.
   */
  const unfollowUser = async (userId: string | number) => {
    try {
      const { data, error } = await mutate<{
        unfollowUser: {
          status: boolean;
          followers_count: number;
          following_count: number;
          user?: User;
        };
      }>(UNFOLLOW_USER_MUTATION, { userId: String(userId) });

      if (error || !data?.unfollowUser) {
        console.error('unfollowUser GraphQL error:', error);
        return { success: false, status: false, followersCount: 0, followingCount: 0 };
      }

      return {
        success: true,
        status: data.unfollowUser.status,
        followersCount: data.unfollowUser.followers_count,
        followingCount: data.unfollowUser.following_count,
        user: data.unfollowUser.user,
      };
    } catch (err) {
      console.error('unfollowUser unexpected error:', err);
      return { success: false, status: false, followersCount: 0, followingCount: 0 };
    }
  };

  /**
   * Fetch a paginated feed of posts from accounts the authenticated user follows.
   *
   * @param page Target page number (default 1).
   * @returns Array of posts and pagination metadata.
   */
  const getFollowingFeed = async (
    page: number = 1
  ): Promise<{ posts: Post[]; pagination: Pagination | null }> => {
    try {
      const { data, error } = await query<{
        followingFeed: {
          data: Post[];
          pagination: Pagination;
        };
      }>(FOLLOWING_FEED_QUERY, { page, perPage: 15 });

      if (error || !data?.followingFeed) {
        console.error('getFollowingFeed GraphQL error:', error);
        return { posts: [], pagination: null };
      }

      return {
        posts: data.followingFeed.data ?? [],
        pagination: data.followingFeed.pagination ?? null,
      };
    } catch (err) {
      console.error('getFollowingFeed unexpected error:', err);
      return { posts: [], pagination: null };
    }
  };

  /**
   * Retrieve the list of users that a specific user is following.
   */
  const getFollowing = async (userId: string | number): Promise<User[]> => {
    try {
      const { data, error } = await query<{ following: User[] }>(FOLLOWING_QUERY, {
        userId: String(userId),
      });

      if (error || !data?.following) {
        return [];
      }

      return data.following;
    } catch (err) {
      console.error('getFollowing error:', err);
      return [];
    }
  };

  /**
   * Retrieve the list of users following a specific user.
   */
  const getFollowers = async (userId: string | number): Promise<User[]> => {
    try {
      const { data, error } = await query<{ followers: User[] }>(FOLLOWERS_QUERY, {
        userId: String(userId),
      });

      if (error || !data?.followers) {
        return [];
      }

      return data.followers;
    } catch (err) {
      console.error('getFollowers error:', err);
      return [];
    }
  };

  return {
    followUser,
    unfollowUser,
    getFollowingFeed,
    getFollowing,
    getFollowers,
  };
};

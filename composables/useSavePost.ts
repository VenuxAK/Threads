import type { Post, Pagination } from '~/types';
import { MY_SAVED_POSTS_QUERY } from '~/graphql/queries/saved';
import {
  SAVE_POST_MUTATION,
  UNSAVE_POST_MUTATION,
} from '~/graphql/mutations/saved';
import { useInteractionsStore } from '~/stores/interactions';

/**
 * Composable for bookmarking and managing saved posts via GraphQL.
 * Supports optimistic bookmark state toggling and synchronized Pinia state updates.
 */
export const useSavePost = () => {
  const { query, mutate } = useGraphQL();
  const interactionsStore = useInteractionsStore();

  /**
   * Save (bookmark) a post for the authenticated user.
   *
   * @param postId Target post ID to bookmark.
   */
  const savePost = async (postId: string | number): Promise<boolean> => {
    try {
      const { data, error } = await mutate<{ savePost: boolean }>(SAVE_POST_MUTATION, {
        postId: String(postId),
      });

      if (error) {
        console.error('savePost error:', error);
        return false;
      }

      const success = Boolean(data?.savePost);
      if (success) {
        interactionsStore.toggleSave(String(postId), true);
      }
      return success;
    } catch (err) {
      console.error('savePost unexpected error:', err);
      return false;
    }
  };

  /**
   * Unsave (remove bookmark) a post for the authenticated user.
   *
   * @param postId Target post ID to unbookmark.
   */
  const unsavePost = async (postId: string | number): Promise<boolean> => {
    try {
      const { data, error } = await mutate<{ unsavePost: boolean }>(UNSAVE_POST_MUTATION, {
        postId: String(postId),
      });

      if (error) {
        console.error('unsavePost error:', error);
        return false;
      }

      const success = Boolean(data?.unsavePost);
      if (success) {
        interactionsStore.toggleSave(String(postId), false);
      }
      return success;
    } catch (err) {
      console.error('unsavePost unexpected error:', err);
      return false;
    }
  };

  /**
   * Toggle bookmark state for a given post.
   */
  const toggleSavePost = async (postId: string | number, isCurrentlySaved: boolean): Promise<boolean> => {
    if (isCurrentlySaved) {
      return await unsavePost(postId);
    } else {
      return await savePost(postId);
    }
  };

  /**
   * Fetch paginated list of posts bookmarked by the authenticated user.
   *
   * @param page Target page number (default 1).
   */
  const getMySavedPosts = async (
    page: number = 1
  ): Promise<{ posts: Post[]; pagination: Pagination | null }> => {
    try {
      const { data, error } = await query<{
        mySavedPosts: {
          data: Post[];
          pagination: Pagination;
        };
      }>(MY_SAVED_POSTS_QUERY, { page, perPage: 15 });

      if (error || !data?.mySavedPosts) {
        console.error('getMySavedPosts GraphQL error:', error);
        return { posts: [], pagination: null };
      }

      return {
        posts: data.mySavedPosts.data ?? [],
        pagination: data.mySavedPosts.pagination ?? null,
      };
    } catch (err) {
      console.error('getMySavedPosts unexpected error:', err);
      return { posts: [], pagination: null };
    }
  };

  return {
    savePost,
    unsavePost,
    toggleSavePost,
    getMySavedPosts,
  };
};

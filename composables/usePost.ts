import type { Post, Pagination } from '~/types';
import {
  FEED_QUERY,
  SINGLE_POST_QUERY,
} from '~/graphql/queries/feed';
import { SEARCH_QUERY } from '~/graphql/queries/search';
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
} from '~/graphql/mutations/posts';

/**
 * Composable for post-related operations using GraphQL.
 *
 * Manages fetching paginated feed posts, retrieving individual threads,
 * performing multi-entity searches, and creating new posts via GraphQL operations.
 * Preserves existing component return shapes to avoid breaking UI consumers.
 */
export const usePost = () => {
  const { query, mutate } = useGraphQL();

  /**
   * Fetch a paginated feed of posts from the GraphQL backend.
   *
   * @param page The target page number (defaults to 1).
   * @returns An object with the posts array and pagination metadata.
   */
  const getPosts = async (page: number = 1): Promise<{ posts: Post[]; pagination: Pagination | null }> => {
    try {
      const { data, error } = await query<{
        feed: {
          data: Post[];
          pagination: Pagination;
        };
      }>(FEED_QUERY, { page, perPage: 15 });

      if (error || !data?.feed) {
        console.error('getPosts GraphQL error:', error);
        return { posts: [], pagination: null };
      }

      return {
        posts: data.feed.data ?? [],
        pagination: data.feed.pagination ?? null,
      };
    } catch (err) {
      console.error('getPosts unexpected error:', err);
      return { posts: [], pagination: null };
    }
  };

  /**
   * Retrieve a single post by ID using the GetPost GraphQL query.
   *
   * @param id The unique identifier of the post.
   * @returns The post object, or null if not found.
   */
  const getPost = async (id: string): Promise<Post | null> => {
    const { data, error } = await query<{ post: Post }>(SINGLE_POST_QUERY, { id });

    if (error || !data?.post) {
      const apiError = useApiError(error);
      if (apiError.isNotFoundError) {
        throw createError({ status: 404, statusMessage: 'Post Not Found' });
      }
      return null;
    }

    return data.post;
  };

  /**
   * Search for users and posts via the Search GraphQL query.
   *
   * @param keyword The search keyword or hashtag.
   * @param includePosts Whether to include post results alongside users.
   * @returns Search results containing matched users and posts.
   */
  const search = async (keyword: string, includePosts: boolean = false) => {
    try {
      const { data, error } = await query<{ search: any }>(SEARCH_QUERY, {
        keyword,
        includePosts,
        page: 1,
        perPage: 20,
      });

      if (error) {
        console.error('Search GraphQL error:', error);
        return null;
      }

      return data?.search ?? null;
    } catch (error) {
      console.error('search error:', error);
      return null;
    }
  };

  /**
   * Publish a new post via the CreatePost GraphQL mutation.
   *
   * @param content The text content of the post.
   * @returns The newly created post object.
   */
  const createPost = async (content: string): Promise<Post | null> => {
    try {
      const { data, error } = await mutate<{ createPost: Post }>(CREATE_POST_MUTATION, { content });

      if (error) {
        const apiError = useApiError(error);
        if (apiError.isValidationError) {
          throw apiError.bag;
        }
        throw new Error(error);
      }

      return data?.createPost ?? null;
    } catch (err) {
      const apiError = useApiError(err);
      if (apiError.isValidationError) {
        throw apiError.bag;
      }
      throw err;
    }
  };

  /**
   * Delete a post by ID via the DeletePost GraphQL mutation.
   *
   * @param id The unique identifier of the post.
   * @returns Boolean indicating deletion success.
   */
  const deletePost = async (id: string): Promise<boolean> => {
    const { data, error } = await mutate<{ deletePost: boolean }>(DELETE_POST_MUTATION, { id });
    if (error) {
      console.error('Delete post error:', error);
      return false;
    }
    return Boolean(data?.deletePost);
  };

  return { getPosts, getPost, search, createPost, deletePost };
};

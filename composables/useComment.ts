import type { Comment } from '~/types';
import {
  POST_COMMENTS_QUERY,
  COMMENT_THREAD_QUERY,
  COMMENT_REPLIES_QUERY,
} from '~/graphql/queries/comments';
import {
  CREATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
} from '~/graphql/mutations/comments';

/**
 * Composable for managing comments and threaded conversations via GraphQL.
 *
 * Provides functions to fetch top-level comments, traverse hierarchical thread
 * trees using MongoDB's $graphLookup, author replies, and delete owned comments.
 */
export const useComment = () => {
  const { query, mutate } = useGraphQL();

  /**
   * Fetch all root-level comments for a post.
   *
   * @param postId The ID of the parent post.
   * @returns List of top-level comment objects and any error message.
   */
  const getComments = async (postId: string | number) => {
    const { data, error } = await query<{ postComments: Comment[] }>(
      POST_COMMENTS_QUERY,
      { postId: postId.toString() },
    );
    return { data: data?.postComments ?? [], error };
  };

  /**
   * Post a new root comment or nested reply.
   *
   * @param postId The ID of the post.
   * @param content The comment text.
   * @param parentId Optional ID of the parent comment being replied to.
   * @returns The newly created comment and any error message.
   */
  const createComment = async (
    postId: string | number,
    content: string,
    parentId?: string,
  ) => {
    const { data, error } = await mutate<{ createComment: Comment }>(
      CREATE_COMMENT_MUTATION,
      {
        postId: postId.toString(),
        content,
        parentId: parentId || null,
      },
    );
    return { data: data?.createComment ?? null, error };
  };

  /**
   * Delete an existing comment owned by the current user.
   *
   * @param commentId The unique identifier of the comment.
   * @returns Object indicating success and any error message.
   */
  const deleteComment = async (commentId: string | number) => {
    const { data, error } = await mutate<{ deleteComment: boolean }>(
      DELETE_COMMENT_MUTATION,
      { id: commentId.toString() },
    );
    return { success: Boolean(data?.deleteComment), error };
  };

  /**
   * Fetch direct replies to a given comment.
   *
   * @param commentId The parent comment identifier.
   * @returns Array of direct child replies and error message.
   */
  const getReplies = async (commentId: string | number) => {
    const { data, error } = await query<{ commentReplies: Comment[] }>(
      COMMENT_REPLIES_QUERY,
      { id: commentId.toString() },
    );
    return { data: data?.commentReplies ?? [], error };
  };

  /**
   * Fetch the entire flat chronological reply thread under a comment.
   *
   * @param commentId The root comment identifier.
   * @returns Flat array of all descendant comments and error message.
   */
  const getCommentThread = async (commentId: string | number) => {
    const { data, error } = await query<{ commentThread: Comment[] }>(
      COMMENT_THREAD_QUERY,
      { id: commentId.toString() },
    );
    return { data: data?.commentThread ?? [], error };
  };

  return {
    getComments,
    createComment,
    deleteComment,
    getReplies,
    getCommentThread,
  };
};

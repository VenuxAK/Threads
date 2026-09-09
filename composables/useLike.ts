import { LIKE_POST_MUTATION } from '~/graphql/mutations/interactions';

/**
 * Composable for liking posts using GraphQL.
 *
 * Dispatches the LikePost GraphQL mutation to atomically toggle like state
 * in the MySQL backend, returning updated counters for optimistic UI synchronizations.
 */
export const useLike = () => {
  const { mutate } = useGraphQL();

  /**
   * Toggle like on a target post.
   *
   * @param postId The ID of the post to like or unlike.
   * @returns Object containing success status, updated likesCount, and boolean liked flag.
   */
  const likePost = async (postId: string | number) => {
    const { data, error } = await mutate<{
      likePost: {
        count: number;
        status: boolean;
      };
    }>(LIKE_POST_MUTATION, { postId: postId.toString() });

    if (error || !data?.likePost) {
      return { success: false, error: error || 'Failed to like post' };
    }

    return {
      success: true,
      likesCount: data.likePost.count,
      liked: data.likePost.status,
    };
  };

  return { likePost };
};

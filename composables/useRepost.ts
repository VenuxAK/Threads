import { REPOST_MUTATION } from '~/graphql/mutations/interactions';

/**
 * Composable for reposting posts using GraphQL.
 *
 * Dispatches the Repost mutation to toggle the repost relationship in MySQL,
 * returning the new repost counter and active boolean status.
 */
export const useRepost = () => {
  const { mutate } = useGraphQL();

  /**
   * Toggle repost on a target post.
   *
   * @param postId The ID of the post to repost or un-repost.
   * @returns Object containing success status, updated repostsCount, and boolean reposted flag.
   */
  const toggleRepost = async (postId: string | number) => {
    const { data, error } = await mutate<{
      repost: {
        count: number;
        status: boolean;
      };
    }>(REPOST_MUTATION, { postId: postId.toString() });

    if (error || !data?.repost) {
      return { success: false, error: error || 'Failed to repost thread' };
    }

    return {
      success: true,
      repostsCount: data.repost.count,
      reposted: data.repost.status,
    };
  };

  return { toggleRepost };
};

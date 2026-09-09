/**
 * GraphQL Mutation operations for post interactions (likes, unlikes, reposts).
 *
 * Each mutation returns an InteractionResult containing the updated count
 * and the user's active status flag to synchronize optimistic UI states.
 */

export const LIKE_POST_MUTATION = `
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      count
      status
    }
  }
`;

export const UNLIKE_POST_MUTATION = `
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      count
      status
    }
  }
`;

export const REPOST_MUTATION = `
  mutation Repost($postId: ID!) {
    repost(postId: $postId) {
      count
      status
    }
  }
`;

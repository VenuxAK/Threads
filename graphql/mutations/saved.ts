/**
 * GraphQL Mutation operations for saving and unsaving threads.
 * Provides boolean confirmation to drive optimistic bookmark icons in post footers.
 */

export const SAVE_POST_MUTATION = `
  mutation SavePost($postId: ID!) {
    savePost(postId: $postId)
  }
`;

export const UNSAVE_POST_MUTATION = `
  mutation UnsavePost($postId: ID!) {
    unsavePost(postId: $postId)
  }
`;

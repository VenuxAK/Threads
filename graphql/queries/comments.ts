import { COMMENT_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for post comments and nested reply threads.
 *
 * Employs CommentFields fragment to ensure consistent author hydration
 * and support for replying_to contextual badges across nested rows.
 */

export const POST_COMMENTS_QUERY = `
  ${COMMENT_FRAGMENT}
  query GetPostComments($postId: ID!) {
    postComments(postId: $postId) {
      ...CommentFields
    }
  }
`;

export const COMMENT_THREAD_QUERY = `
  ${COMMENT_FRAGMENT}
  query GetCommentThread($id: ID!) {
    commentThread(id: $id) {
      ...CommentFields
    }
  }
`;

export const COMMENT_REPLIES_QUERY = `
  ${COMMENT_FRAGMENT}
  query GetCommentReplies($id: ID!) {
    commentReplies(id: $id) {
      ...CommentFields
    }
  }
`;

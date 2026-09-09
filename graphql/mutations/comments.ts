import { COMMENT_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Mutation operations for creating and deleting comments.
 *
 * Creation returns the newly saved comment along with author profile fields
 * to allow direct appending to the active comment dialog list.
 */

export const CREATE_COMMENT_MUTATION = `
  ${COMMENT_FRAGMENT}
  mutation CreateComment($postId: ID!, $content: String!, $parentId: ID) {
    createComment(postId: $postId, content: $content, parentId: $parentId) {
      ...CommentFields
    }
  }
`;

export const DELETE_COMMENT_MUTATION = `
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;
